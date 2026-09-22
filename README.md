# FloodLens — Lightweight Floodwater Visual Screening

FloodLens is a bilingual web application for preliminary visual screening of Melbourne floodwater. A user can take a photo with the device camera or upload an image, then receive highlighted anomaly regions, visual indicators and a risk score.

The `main` branch uses deterministic OpenCV colour thresholds and contour analysis. It is lightweight enough for a Raspberry Pi and does **not** use a trained machine-learning model. The earlier pretrained YOLO prototype is preserved in the [`yolo-prototype`](https://github.com/wutianze3/floodlens-water-pollution-detection/tree/yolo-prototype) branch.

> An image cannot detect bacteria, viruses, heavy metals or most dissolved contaminants. FloodLens is a visual demonstration only and cannot determine whether water is safe to drink.

## Run the application

Requirements: Python 3.10+ and Node.js 18+. On a Raspberry Pi, use the 64-bit Raspberry Pi OS when possible.

Open two PowerShell windows in the project directory. Start the OpenCV service in the first window:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-model.ps1
```

Start the web application in the second window:

```powershell
node server.mjs
```

Open <http://localhost:8080>. Browser camera access normally requires `localhost` or HTTPS.

For Raspberry Pi OS/Linux, create a virtual environment, install `requirements-model.txt`, run the API, and then run the web server:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-model.txt
uvicorn inference_server:app --host 0.0.0.0 --port 8000
# In a second terminal:
node server.mjs
```

## Current features

- Responsive English/Chinese interface with a persistent language switcher.
- Image upload, drag and drop, live camera capture and preview.
- Lightweight OpenCV colour, brightness and contour screening.
- Conservative water-region, vegetation and contour-shape filtering to reduce false positives.
- Up to three bounding boxes for the strongest bright or unusually coloured regions.
- Visual turbidity, discolouration, anomaly and image-quality indicators.
- Local risk scoring and safety recommendations.
- Browser fallback if the OpenCV service is unavailable.
- `GET /api/health` and `POST /api/analyze` endpoints.

## Example response

```json
{
  "score": 48,
  "confidence": 73,
  "source": "opencv_threshold_v2_conservative",
  "method": "deterministic_opencv_not_trained_ml",
  "detectionCount": 1,
  "detections": [
    {
      "x1": 0.12,
      "y1": 0.31,
      "x2": 0.24,
      "y2": 0.45,
      "confidence": 0.68,
      "label": "visual anomaly"
    }
  ]
}
```

## Project structure

- `index.html` and `styles.css`: responsive bilingual interface
- `app.js`: camera, upload, results and bounding-box rendering
- `server.mjs`: static server and API proxy
- `inference_server.py`: lightweight OpenCV/FastAPI screening service
- `requirements-model.txt`: Raspberry Pi-friendly Python dependencies
- `start-model.ps1`: Windows service setup and launcher

## Limitations

Thresholding can flag bright foam, pale objects and vivid non-green regions, and it estimates broad colour or turbidity cues. Reflections, rocks, vegetation and lighting can cause false results. It does not recognise a reliable waste category, prove that a detected region is litter, or measure actual water contamination. Laboratory tests or suitable water sensors are required for health and environmental decisions.

The next useful improvement is to test representative Melbourne flood images, tune the thresholds for the chosen camera, and report false-positive and false-negative results.
