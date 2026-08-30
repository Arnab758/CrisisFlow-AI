# 🌐 CrisisFlow AI
### Autonomous Disaster Relief Intelligence & Multimodal Logistics Grid

[![Google AI Studio](https://img.shields.io/badge/Built%20with-Google%20AI%20Studio-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.studio)
[![Gemini 3.7](https://img.shields.io/badge/Gemini%20API-3.7%20Flash%20%2F%203.1%20Pro-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**CrisisFlow AI** is a real-time, AI-native disaster response operating system. It ingests multimodal aerial drone feeds, satellite surveys, and field telemetry to grade structural collapse, locate stranded survivors, optimize emergency fleet dispatches, generate FEMA Incident Action Plans (IAPs), and broadcast multilingual voice alerts.

---

## 🚀 Key Modules & Capabilities

### 1. 🛰️ Tactical GIS Command Grid
- **Real-Time Geospatial Map**: Interactive multi-layer command map rendering active incident clusters, radar sweeps, and emergency perimeters.
- **Environmental Hazard Overlays**: Live toggleable layers for **Flood Water Surges**, **FLIR Thermal Wildfire Plumes**, **Wind Corridors**, and **Infrastructure Safe Routes**.
- **Incident Inspection**: Real-time drill-down into any triage marker for status updates, casualty estimates, and matched unit dispatch history.

### 2. 🛩️ Multimodal Vision & Drone Telemetry Triage
- **Pixel-Level Damage Grading**: Ingests high-resolution aerial drone captures and eyewitness imagery directly to **Gemini 3.7 Flash** for damage estimation (0–100%) and survivor detection.
- **Tactical Sensor HUD**:
  - **Optical Mode**: True-color field surveillance.
  - **FLIR Thermal Simulation**: Infrared thermal inversion for detecting spot fires and living heat signatures.
  - **Edge Detection Grid**: Concrete fracture and structural shearing analysis.
- **AI Detection Bounding Boxes**: Dynamic visual overlays highlighting collapse zones, hazmat plumes, and survivor pockets.
- **1-Click Grid Deployment**: Instantly injects analyzed drone targets into the live dispatch map.

### 3. 🚑 Autonomous Rescue Dispatch Matrix
- **Automated Capability Matching**: Evaluates vehicle capabilities (USAR Heavy Extrication, Swiftwater Rescue Boats, Swift Helo Air-Evac, Hazmat Containment) against incident priority levels (`P1-CRITICAL`, `P2-HIGH`, `P3-MODERATE`).
- **Fleet ETA Minimization**: Calculates response times avoiding hazard zones and dynamically updates unit states (`DISPATCHED`, `EN_ROUTE`, `ON_SCENE`, `AVAILABLE`).

### 4. 📢 Multilingual Emergency Broadcast & Voice Synthesis
- **Civic Warning Generator**: Generates emergency announcements tailored for SMS, Mega-Siren, EAS Radio Broadcasts, and Social Media feeds.
- **Multi-Language Support**: English, Spanish, Mandarin, Vietnamese, Tagalog, Arabic, French, and Japanese.
- **Radio Voice Synthesis**: Embedded Web Speech API engine allowing field dispatchers to listen to live audio radio transmissions in multiple languages.

### 5. 📋 FEMA ICS Incident Action Plan (IAP) Formulator
- **ICS-201 / ICS-202 Formulation**: Generates standard Incident Action Plans complete with Operational Period objectives, command structures, hazard mitigations, and air support branches.
- **Print & Export Ready**: 1-click export/print formatting for emergency coordination staff.

---

## 🛠️ Architecture & Tech Stack

```
├── client (React 18 + TypeScript + Vite)
│   ├── src/components/       # Modular UI (Map, Triage HUD, Dispatch, Broadcast, IAP)
│   ├── src/data/             # Disaster scenarios, fleets, incident feeds
│   └── src/types.ts          # Strongly typed crisis data models
│
└── server (Express + Node.js)
    ├── server.ts             # REST API Proxy + Vite middleware
    └── server/gemini.ts      # Google Gen AI SDK integration & structured schemas
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Motion (Framer Motion).
- **Backend**: Node.js, Express, `@google/genai` TypeScript SDK.
- **AI Models**: `gemini-3.7-flash`, `gemini-flash-latest`, `gemini-3.1-pro-preview`.
- **Audio & Synthesis**: Web Speech API for emergency radio broadcasting.

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm
- Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/crisisflow-ai.git
cd crisisflow-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the command dashboard.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🎯 Demo Walkthrough Guide (Hackathon Video)

1. **Overview (0:00 - 0:30)**: Open the **Tactical GIS Command Grid**, inspect live crisis pins, and toggle environmental layers (Thermal Heat & Flood Surges).
2. **Multimodal Drone Triage (0:30 - 1:05)**: Navigate to **Drone Triage**, drag-and-drop a disaster image, toggle **FLIR Thermal / Edge Grid**, click **Run AI Triage Analysis** to see Gemini extract structural damage & casualties, then click **Inject into Active Grid**.
3. **Autonomous Dispatch (1:05 - 1:30)**: Click **Run AI Autonomous Dispatch** in the Dispatch Matrix to view automated vehicle routing and ETA calculations.
4. **Broadcast & Voice Alert (1:30 - 1:45)**: Switch languages in **Emergency Broadcast** and click **Play Radio Audio** for speech output.
5. **Incident Action Plan (1:45 - 2:00)**: Generate and review the FEMA ICS-201/202 command document.

---

## 📜 License
Licensed under the [MIT License](LICENSE).
