"""pLitter YOLOv5 inference API for FloodLens.

The model detects visible floating macro-plastic. It does not infer chemical,
microbiological, or drinking-water safety.
"""

from io import BytesIO
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
os.environ.setdefault("MPLCONFIGDIR", str(ROOT / ".matplotlib"))
(ROOT / ".matplotlib").mkdir(exist_ok=True)

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
import torch


YOLO_ROOT = ROOT / "vendor" / "yolov5"
WEIGHTS = ROOT / "models" / "pLitterFloat_yolov5s.pt"
CONFIDENCE = float(os.getenv("PLITTER_CONFIDENCE", "0.18"))
# pLitter classes have very different false-positive behaviour. The model often
# mistakes ripples and rocks for debris/styrofoam, so deployment thresholds are
# deliberately stricter than the candidate-generation threshold above.
CLASS_THRESHOLDS = {
    0: float(os.getenv("PLITTER_DEBRIS_THRESHOLD", "0.55")),
    1: float(os.getenv("PLITTER_BOTTLE_THRESHOLD", "0.65")),
    2: float(os.getenv("PLITTER_STYROFOAM_THRESHOLD", "0.90")),
}

app = FastAPI(title="FloodLens pLitter API", version="1.0.0")
_model = None


def get_model():
    global _model
    if _model is not None:
        return _model
    if not WEIGHTS.exists() or not YOLO_ROOT.exists():
        raise RuntimeError("pLitter weights or YOLOv5 runtime is missing")
    try:
        _model = torch.hub.load(
            str(YOLO_ROOT), "custom", path=str(WEIGHTS), source="local"
        )
        _model.conf = CONFIDENCE
        _model.iou = 0.45
        _model.max_det = 100
        return _model
    except Exception as exc:
        raise RuntimeError(f"{type(exc).__name__}: {exc}") from exc


def inference_windows(width: int, height: int):
    """Return a full-image window plus overlapping 2x2 crops for small debris."""
    windows = [(0, 0, width, height)]
    if min(width, height) < 320:
        return windows
    tile_width = min(width, max(320, round(width * 0.62)))
    tile_height = min(height, max(320, round(height * 0.62)))
    x_starts = sorted({0, width - tile_width})
    y_starts = sorted({0, height - tile_height})
    windows.extend(
        (x, y, x + tile_width, y + tile_height)
        for y in y_starts for x in x_starts
        if (x, y, x + tile_width, y + tile_height) != windows[0]
    )
    return windows


def box_iou(a, b):
    intersection = max(0.0, min(a[2], b[2]) - max(a[0], b[0])) * max(0.0, min(a[3], b[3]) - max(a[1], b[1]))
    area_a = max(0.0, a[2] - a[0]) * max(0.0, a[3] - a[1])
    area_b = max(0.0, b[2] - b[0]) * max(0.0, b[3] - b[1])
    union = area_a + area_b - intersection
    return intersection / union if union else 0.0


def merge_detections(rows, iou_threshold=0.45):
    """Apply a second NMS pass after mapping tiled detections to the full image."""
    kept = []
    for candidate in sorted(rows, key=lambda row: row[4], reverse=True):
        if all(box_iou(candidate, existing) < iou_threshold for existing in kept):
            kept.append(candidate)
    return kept


@app.get("/health")
def health():
    try:
        model = get_model()
        return {
            "status": "ready",
            "name": "pLitterFloat YOLOv5s",
            "device": str(next(model.parameters()).device),
            "confidenceThreshold": CONFIDENCE,
        }
    except RuntimeError as exc:
        return {"status": "error", "detail": str(exc)}


@app.post("/analyze")
async def analyze(image: UploadFile = File(...), context: str = Form("melbourne_flood")):
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(415, "Only JPEG, PNG, and WEBP images are supported")
    raw = await image.read()
    if len(raw) > 12 * 1024 * 1024:
        raise HTTPException(413, "Image exceeds the 12 MB limit")
    try:
        source = Image.open(BytesIO(raw)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(400, "Invalid image") from exc

    try:
        model = get_model()
        windows = inference_windows(*source.size)
        crops = [source.crop(window) for window in windows]
        with torch.inference_mode():
            results = model(crops, size=640)
    except RuntimeError as exc:
        raise HTTPException(503, f"Model could not be loaded: {exc}") from exc

    width, height = source.size
    mapped_rows = []
    for window, tile_result in zip(windows, results.xyxy):
        offset_x, offset_y = window[0], window[1]
        for x1, y1, x2, y2, confidence, class_id in tile_result.detach().cpu().tolist():
            mapped_rows.append([
                x1 + offset_x, y1 + offset_y, x2 + offset_x, y2 + offset_y,
                confidence, class_id,
            ])
    candidate_count = len(mapped_rows)
    filtered_rows = [
        row for row in mapped_rows
        if row[4] >= CLASS_THRESHOLDS.get(int(row[5]), 0.65)
    ]
    rows = merge_detections(filtered_rows)
    names = model.names
    detections = []
    covered_area = 0.0
    max_confidence = 0.0

    for x1, y1, x2, y2, confidence, class_id in rows:
        class_id = int(class_id)
        label = names[class_id] if isinstance(names, (list, tuple)) else names.get(class_id, "plastic litter")
        confidence = float(confidence)
        nx1, ny1 = max(0.0, x1 / width), max(0.0, y1 / height)
        nx2, ny2 = min(1.0, x2 / width), min(1.0, y2 / height)
        covered_area += max(0.0, nx2 - nx1) * max(0.0, ny2 - ny1)
        max_confidence = max(max_confidence, confidence)
        detections.append({
            "x1": round(nx1, 5), "y1": round(ny1, 5),
            "x2": round(nx2, 5), "y2": round(ny2, 5),
            "confidence": round(confidence, 4),
            "classId": class_id, "label": str(label),
        })

    count = len(detections)
    score = min(95, round(15 + min(count, 5) * 15 + min(covered_area, 0.25) * 160 + max_confidence * 30)) if count else 10
    confidence = round(max_confidence * 100) if count else 70

    return {
        "score": score,
        "confidence": confidence,
        "source": "pLitterFloat_yolov5s_v0.1",
        "modelScope": "visible_floating_plastic_only",
        "context": context,
        "detectionCount": count,
        "candidateCount": candidate_count,
        "inferenceMode": "full_image_plus_overlapping_tiles",
        "tilesProcessed": len(windows),
        "classThresholds": {
            "debris": CLASS_THRESHOLDS[0],
            "bottle": CLASS_THRESHOLDS[1],
            "styrofoam": CLASS_THRESHOLDS[2],
        },
        "detections": detections,
        "factors": {
            "turbidity": 0.0,
            "debris": round(min(1.0, count / 4 + covered_area * 2), 4),
            "discoloration": 0.0,
            "quality": 1.0,
        },
    }
