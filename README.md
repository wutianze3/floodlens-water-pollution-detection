# FloodLens — Melbourne Floodwater Visual Screening Prototype

FloodLens allows a user to capture or upload an image and run the pLitter deep-learning model to detect visible floating plastic on the water surface.

> Images cannot detect bacteria, viruses, heavy metals or most dissolved contaminants. This project provides visual risk screening only and cannot determine whether water is safe to drink.

## Run the complete system

The official pLitterFloat YOLOv5s weights are included. Clone the YOLOv5 submodule and open two PowerShell windows in the project directory:

```powershell
git clone --recurse-submodules <repository-url>
cd <repository-folder>
```

The first model start automatically creates an isolated Python 3.11 environment with `uv` when available.

Start the model service in the first window:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-model.ps1
```

Start the web application in the second window:

```powershell
node server.mjs
```

Open <http://localhost:8080>. Browser camera access normally requires `localhost` or HTTPS.

## Current features

- Responsive English/Chinese interface with a persistent language switcher.
- Image upload, drag and drop, live camera capture and image preview.
- Official pLitterFloat YOLOv5s v0.1 weights for visible floating-plastic detection.
- Full-image plus overlapping-tile inference to improve recall for small debris.
- Conservative class-specific thresholds to suppress ripple, reflection and rock false positives.
- Bounding boxes with detection labels and confidence scores.
- A visual risk score based on detection count, confidence and image coverage.
- An explicitly labelled local demonstration fallback when the model service is offline.
- `GET /api/health` for model status and `POST /api/analyze` for inference.

## Example response

```json
{
  "score": 66,
  "confidence": 84,
  "source": "pLitterFloat_yolov5s_v0.1",
  "modelScope": "visible_floating_plastic_only",
  "detectionCount": 3,
  "detections": [
    { "x1": 0.12, "y1": 0.31, "x2": 0.24, "y2": 0.45, "confidence": 0.84, "label": "debris" }
  ]
}
```

## Project structure

- `index.html`: page structure and content
- `styles.css`: visual and responsive design
- `app.js`: camera, upload, results and detection boxes
- `server.mjs`: static server and model-service proxy
- `inference_server.py`: pLitter PyTorch/FastAPI inference service
- `models/pLitterFloat_yolov5s.pt`: official floating-plastic model weights
- `vendor/yolov5`: vendored YOLOv5 v7.0 inference runtime
- `requirements-model.txt`: model-service dependencies

## Recommended next step

The existing weights were not trained on Melbourne flood imagery. For a final assessment, collect positive and negative local images, fine-tune the model, and split training and testing data by location or flood event to prevent adjacent video frames from leaking across datasets.

## Third-party model

The pLitterFloat checkpoint comes from the [pLitter project](https://github.com/gicait/pLitter/releases/tag/v0.1). YOLOv5 is included as a submodule from the [Ultralytics YOLOv5 repository](https://github.com/ultralytics/yolov5/tree/v7.0). Review the upstream terms before redistributing or using these components commercially.
