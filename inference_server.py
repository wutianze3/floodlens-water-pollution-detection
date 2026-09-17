"""Lightweight OpenCV visual-screening API for FloodLens.

This service uses deterministic colour thresholds and contour analysis. It is
designed for a Raspberry Pi demonstration and is not a trained ML model or a
water-safety test.
"""

import os

import cv2
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
import numpy as np


MAX_UPLOAD_BYTES = 12 * 1024 * 1024
MAX_ANALYSIS_SIDE = int(os.getenv("OPENCV_MAX_SIDE", "960"))
MAX_DETECTIONS = int(os.getenv("OPENCV_MAX_DETECTIONS", "8"))

app = FastAPI(title="FloodLens OpenCV API", version="2.0.0")


def resize_for_analysis(image: np.ndarray):
    height, width = image.shape[:2]
    largest = max(width, height)
    if largest <= MAX_ANALYSIS_SIDE:
        return image, 1.0
    scale = MAX_ANALYSIS_SIDE / largest
    resized = cv2.resize(image, (round(width * scale), round(height * scale)), interpolation=cv2.INTER_AREA)
    return resized, scale


def water_focus_mask(height: int, width: int):
    """Bias analysis towards the central/lower region where water is expected."""
    mask = np.zeros((height, width), dtype=np.uint8)
    polygon = np.array([
        [round(width * 0.08), round(height * 0.18)],
        [round(width * 0.92), round(height * 0.18)],
        [width - 1, height - 1],
        [0, height - 1],
    ], dtype=np.int32)
    cv2.fillConvexPoly(mask, polygon, 255)
    return mask


def build_candidate_mask(image: np.ndarray, focus: np.ndarray):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hue, saturation, value = cv2.split(hsv)

    # Bright, low-saturation objects can represent foam or pale plastic.
    bright = ((saturation < 52) & (value > 205)).astype(np.uint8) * 255

    # Strong synthetic colours are useful litter cues. Exclude the broad green
    # range to avoid treating vegetation as plastic.
    vivid = ((saturation > 135) & (value > 75)).astype(np.uint8) * 255
    vegetation = ((hue >= 30) & (hue <= 95)).astype(np.uint8) * 255
    vivid = cv2.bitwise_and(vivid, cv2.bitwise_not(vegetation))

    candidates = cv2.bitwise_or(bright, vivid)
    candidates = cv2.bitwise_and(candidates, focus)
    candidates = cv2.medianBlur(candidates, 5)
    candidates = cv2.morphologyEx(candidates, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    candidates = cv2.morphologyEx(candidates, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    return candidates, hsv


def contour_detections(mask: np.ndarray, original_width: int, original_height: int, scale: float):
    height, width = mask.shape
    frame_area = width * height
    minimum_area = max(55, frame_area * 0.00045)
    maximum_area = frame_area * 0.075
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    ranked = []

    for contour in contours:
        area = cv2.contourArea(contour)
        if not minimum_area <= area <= maximum_area:
            continue
        x, y, box_width, box_height = cv2.boundingRect(contour)
        if box_width < 7 or box_height < 7:
            continue
        rectangularity = area / max(1, box_width * box_height)
        if rectangularity < 0.20:
            continue
        area_ratio = area / frame_area
        confidence = min(0.92, 0.50 + rectangularity * 0.20 + min(area_ratio * 12, 0.22))
        ranked.append((area, x, y, box_width, box_height, confidence))

    detections = []
    for area, x, y, box_width, box_height, confidence in sorted(ranked, reverse=True)[:MAX_DETECTIONS]:
        x1, y1 = x / scale, y / scale
        x2, y2 = (x + box_width) / scale, (y + box_height) / scale
        detections.append({
            "x1": round(max(0.0, x1 / original_width), 5),
            "y1": round(max(0.0, y1 / original_height), 5),
            "x2": round(min(1.0, x2 / original_width), 5),
            "y2": round(min(1.0, y2 / original_height), 5),
            "confidence": round(float(confidence), 4),
            "classId": 0,
            "label": "visual anomaly",
            "areaRatio": round(float(area / frame_area), 5),
        })
    return detections


def scene_features(image: np.ndarray, hsv: np.ndarray, focus: np.ndarray, detections):
    hue, saturation, value = cv2.split(hsv)
    focused = focus > 0
    pixel_count = max(1, int(np.count_nonzero(focused)))

    brown = focused & (hue >= 5) & (hue <= 28) & (saturation > 45) & (value > 35)
    green = focused & (hue >= 30) & (hue <= 90) & (saturation > 55) & (value > 30)
    brown_ratio = np.count_nonzero(brown) / pixel_count
    green_ratio = np.count_nonzero(green) / pixel_count

    grey = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    focused_values = grey[focused]
    contrast = float(np.std(focused_values)) if focused_values.size else 0.0
    turbidity = min(1.0, brown_ratio * 2.1 + max(0.0, 25.0 - contrast) / 80.0)
    discoloration = min(1.0, max(brown_ratio * 1.8, green_ratio * 1.25))
    detected_area = sum(item["areaRatio"] for item in detections)
    debris = min(1.0, len(detections) / 6.0 + detected_area * 5.0)
    quality = min(1.0, max(0.15, contrast / 48.0))
    return turbidity, debris, discoloration, quality


@app.get("/health")
def health():
    return {
        "status": "ready",
        "name": "OpenCV threshold screening",
        "runtime": f"OpenCV {cv2.__version__}",
        "maxAnalysisSide": MAX_ANALYSIS_SIDE,
    }


@app.post("/analyze")
async def analyze(image: UploadFile = File(...), context: str = Form("melbourne_flood")):
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(415, "Only JPEG, PNG, and WEBP images are supported")
    raw = await image.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Image exceeds the 12 MB limit")
    frame = cv2.imdecode(np.frombuffer(raw, dtype=np.uint8), cv2.IMREAD_COLOR)
    if frame is None:
        raise HTTPException(400, "Invalid image")

    original_height, original_width = frame.shape[:2]
    analysis_frame, scale = resize_for_analysis(frame)
    height, width = analysis_frame.shape[:2]
    focus = water_focus_mask(height, width)
    candidate_mask, hsv = build_candidate_mask(analysis_frame, focus)
    detections = contour_detections(candidate_mask, original_width, original_height, scale)
    turbidity, debris, discoloration, quality = scene_features(analysis_frame, hsv, focus, detections)

    score = round(min(95, max(5, 8 + turbidity * 34 + debris * 38 + discoloration * 20)))
    evidence = max(turbidity, debris, discoloration)
    confidence = round(58 + evidence * 30)

    return {
        "score": score,
        "confidence": confidence,
        "source": "opencv_threshold_v1",
        "modelScope": "visible_colour_and_contour_screening_only",
        "method": "deterministic_opencv_not_trained_ml",
        "context": context,
        "detectionCount": len(detections),
        "detections": detections,
        "factors": {
            "turbidity": round(turbidity, 4),
            "debris": round(debris, 4),
            "discoloration": round(discoloration, 4),
            "quality": round(quality, 4),
        },
    }
