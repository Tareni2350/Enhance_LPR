# EnhanceLPR: AI-Powered License Plate Recognition

**EnhanceLPR** is an end-to-end web application for automated detection, optical quality assessment, clarity enhancement, character recognition (OCR), and Indian MoRTH/CMVR format validation of vehicle license plates from real-world images.

---

## Features

- **Flexible Image Ingestion**:
  - Upload vehicle photos (`JPG`, `PNG`, `WEBP`) via file picker or drag-and-drop.
  - Paste screenshots directly from the clipboard (`Ctrl+V`).
  - Capture live snapshots using your device or webcam with an alignment reticle.
  - **5 Real-Time Photorealistic Demo Scenarios** (Delhi Private Sedan, Angled Pune SUV, Electric Vehicle Green Plate, Rainy Night Traffic Cam with Motion Blur, and Ahmedabad Commercial Taxi).
- **7-Stage Automated LPR Pipeline**:
  1. **Image Ingestion** — Validates format and normalizes image resolution (up to `1280px`) for fast vision inference.
  2. **Plate Localization** — Detects the license plate bounding box `[ymin, xmin, ymax, xmax]` and perspective tilt angle, with automatic fallback across Gemini vision models (`gemini-3.8-flash` → `gemini-3.1-flash-lite`).
  3. **High-Res Canvas Crop** — Isolates and upscales the plate region of interest (ROI) cleanly in the browser.
  4. **Blur & Quality Assessment** — Evaluates sharpness score (`0–100`), readability, lighting condition, and degradation factors (motion blur, rain defocus, glare).
  5. **Conditional Clarity Enhancement** — Automatically applies unsharp masking (Laplacian 3×3 convolution), contrast stretching, gamma adjustment, and optional B&W binarization with an interactive **Before/After split comparison slider** and manual tuning controls.
  6. **Neural OCR & HSRP Replica** — Extracts normalized plate text with per-character confidence scores, renders an authentic Indian High Security Registration Plate (HSRP) preview, supports manual inline correction, clipboard copy, and Web Speech audio readout.
  7. **Indian MoRTH / CMVR Validation** — Validates extracted numbers against Central Motor Vehicles Rules (Rule 50 & 51) across all 36 Indian States/Union Territories, district RTO codes, and Bharat (`BH`) Series formats.
- **Scan History & Export**: Persists recent recognition records locally with search, valid/invalid filtering, and **CSV / JSON** export.

---

## Supported Indian License Plate Formats

| Category | Plate Styling | Example Format |
| :--- | :--- | :--- |
| **Standard Private (MoRTH)** | White background, black characters | `DL 01 CA 9081`, `MH 12 DE 1433` |
| **Commercial / Transport** | Yellow background, black characters | `GJ 01 TT 6543` |
| **Electric Vehicle (Private)** | Green background, white characters | `DL 03 EV 2024` |
| **Bharat Series (Pan-India)** | White background, black characters | `22 BH 5432 AA` |
| **Diplomatic / Consular** | Blue background, white characters | `21 CD 1234` |
| **Armed Forces / Legacy** | Defence arrow / Pre-1989 formats | `19D012345A`, `BLA 1234` |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, HTML5 Canvas API
- **Backend**: Node.js, Express, Vite Middleware (`server.ts`)
- **AI Vision**: `@google/genai` SDK (`gemini-3.8-flash` with `ThinkingLevel.LOW` and automatic fallback to `gemini-3.1-flash-lite`)

---

## Project Structure

```text
├── server.ts                       # Express server + server-side Gemini Vision API (/api/analyze-plate)
├── index.html                      # HTML entry point & fonts
├── package.json                    # Dependencies and scripts
├── .env.example                    # Environment variable template
└── src/
    ├── App.tsx                     # Main 7-stage LPR pipeline orchestrator
    ├── types/lpr.ts                # TypeScript interfaces for pipeline, OCR, quality & validation
    ├── assets/images/              # Real-time photorealistic Indian vehicle demo images
    ├── utils/
    │   ├── imageProcessing.ts      # Canvas cropping, Laplacian blur scoring, unsharp masking, resizing
    │   ├── indianRtoData.ts        # Indian States/UTs, RTO lookup & MoRTH CMVR regex validation
    │   └── sampleImages.ts         # Demo vehicle dataset definitions
    └── components/
        ├── Header.tsx              # Navigation bar with history & specs triggers
        ├── PipelineVisualizer.tsx  # Real-time 7-stage progress tracker
        ├── ImageUploader.tsx       # Drag-drop uploader, camera trigger & demo gallery
        ├── VehicleViewfinder.tsx   # Source vehicle viewer with zoom & bounding-box HUD
        ├── PlateEnhancer.tsx       # Split-slider deblur comparison & enhancement sliders
        ├── OcrDisplay.tsx          # HSRP plate replica, per-glyph confidence & speech synthesis
        ├── ValidationReport.tsx    # State/RTO breakdown & CMVR compliance report
        ├── CameraCaptureModal.tsx  # Live webcam capture modal
        ├── HistoryModal.tsx        # Searchable scan log with CSV/JSON export
        └── SpecsModal.tsx          # Indian HSRP & MoRTH specification reference
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` (or configure secrets in your hosting environment) and set your Gemini API key:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 3. Run in Development

Starts the Express server with Vite middleware on port `3000`:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Type-Check & Production Build

```bash
npm run lint     # Run TypeScript compiler check (tsc --noEmit)
npm run build    # Build frontend bundle and server into dist/
npm start        # Run production server (node dist/server.js)
```

---

## API Endpoints

- `GET /api/health` — Returns server health status and API key availability.
- `POST /api/analyze-plate` — Accepts `{ imageBase64, mimeType }` and returns structured JSON containing `boundingBox`, `vehicleType`, `plateStyle`, `angleDegrees`, `qualityAssessment`, `ocrResult`, and `validationResult`.
