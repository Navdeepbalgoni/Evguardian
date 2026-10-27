# EV Guardian

**Full Title:** AI-Powered Digital Twin for Predictive Health Monitoring and Failure Prevention in Electric Vehicles  
**Repository:** [https://github.com/Navdeepbalgoni/Evguardian.git](https://github.com/Navdeepbalgoni/Evguardian.git)

---

## Overview

**EV Guardian** is an AI-powered Digital Twin system designed to continuously monitor electric vehicle (EV) health, analyze vehicle and battery telematics, detect electro-thermal and operational anomalies, predict potential failures, and deliver actionable maintenance recommendations in real time.

By integrating multi-parameter EV sensor telemetry, machine learning pipelines (XGBoost, Isolation Forest, Random Forest, LightGBM), a Flask REST backend, and a modern glassmorphic React dashboard, EV Guardian shifts vehicle maintenance from reactive repair to data-driven, proactive prevention.

> This project is developed as a **Final-Year Engineering Project**.

---

## System Architecture

The EV Guardian platform operates across three interconnected layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React Frontend (Vite)                          │
│  - Real-Time Monitoring & Telemetry Streaming                          │
│  - Digital Twin State Simulator (Healthy, Warning, Critical)          │
│  - 16-Cell Battery Matrix Visualizer & Recharts Analytics              │
│  - AI Fault Diagnosis & SHAP-style Attribution                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (port 5000)
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Flask Backend Service                            │
│  - /api/health          - System & Model Status Check                  │
│  - /api/simulate        - Telemetry Profile Simulation                 │
│  - /api/predict         - Real-Time Multi-Model ML Inference           │
│  - /api/batch-simulate  - Multi-reading Telematics Generation          │
│  - /api/model-info      - Benchmark Metrics & Performance Metadata     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Joblib Pipelines
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Machine Learning & Analytics Engine                 │
│  - Vehicle Health Score Regression  (XGBoost / Random Forest)          │
│  - Battery State of Health (SOH)   (XGBoost / Random Forest)          │
│  - Remaining Range Estimation       (XGBoost / Random Forest)          │
│  - Failure Risk Classification      (XGBoost / LightGBM / Stacking)    │
│  - Sensor Anomaly Detection         (Isolation Forest)                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Machine Learning Models & Performance

The ML engine was trained and validated on a comprehensive 15,000-record EV operational dataset (`ev_guardian_middle_ground_final.csv`) spanning 32 telematics features including electrical dynamics, thermal loads, motor metrics, environmental variables, and driving styles.

### Model Benchmarks

| Task / Target | Best Model | Primary Metric | Baseline Comparison |
| :--- | :--- | :--- | :--- |
| **Vehicle Health Score** | **XGBoost Regressor** | **$R^2 = 0.8616$** (MAE: 1.10) | Random Forest ($R^2 = 0.8417$) |
| **Battery SOH (%)** | **XGBoost Regressor** | **$R^2 = 0.8661$** (MAE: 1.09%) | Random Forest ($R^2 = 0.8458$) |
| **Estimated Range (km)** | **XGBoost Regressor** | **$R^2 = 0.9022$** (MAE: 7.71 km) | Random Forest ($R^2 = 0.8872$) |
| **Failure Risk Classification** | **XGBoost Classifier** | **ROC-AUC: 0.9267** (Acc: 79.02%) | OOF Stacking (0.9275), LightGBM (0.9240) |
| **Anomaly Detection** | **Isolation Forest** | Unsupervised Multi-Sensor Outlier Scoring | Outlier Contamination: 5% |

### Key Features Used for Inference
- **Battery Dynamics:** SOC, Pack Voltage, Discharge Current, Pack Temperature, Internal Resistance, Cell Imbalance, Charge Cycles.
- **Powertrain & Motor:** Motor RPM, Torque (Nm), Current, Motor Temperature, Motor Efficiency.
- **Driving & Dynamics:** Vehicle Speed, Longitudinal Acceleration, Specific Energy Consumption (Wh/km), Driving Style Score, Harsh Accel/Brake counts.
- **Environment & Route:** Ambient Temperature, Humidity, Road Surface Type, Traffic Level, Road Gradient/Slope.

---

## Key Features

### 1. Real-Time Monitoring & Telemetry Streaming
- Live streaming view (`RealTimeMonitoringView.jsx`) communicating with the live Python backend via REST polling.
- Live radar visualization of subsystem risk profiles (Battery, Motor, Thermal, Electrical, Inverter).
- Interactive parameter charts updating in real time (Voltage, Current, Temperatures, Speed, RPM).
- Telemetry profile switcher (*Healthy*, *Warning*, *Critical*) for on-the-fly model evaluation.

### 2. Digital Twin & Battery Diagnostics
- **16-Cell Battery Pack Matrix:** Interactive heat and voltage balance visualization across individual cells.
- **Dynamic Time-Series Analytics:**
  - State of Charge (SOC) tracking and discharge trends.
  - Thermal monitoring with threshold warning limits.
  - High-rate discharge vs. Regenerative braking recovery.
  - Long-term battery degradation and capacity fade forecast curve.

### 3. AI Predictive Health & Fault Diagnosis
- Multimodal failure risk assessment across 4 primary domains: *Battery Fault*, *Motor Fault*, *Performance Degradation*, and *Operational Anomaly*.
- Anomaly score evaluation using Isolation Forest decision boundaries.
- Contextual severity indicators (*Low*, *Medium*, *High Risk*) with diagnostic explanation.

### 4. Comprehensive Fleet & Trip Analytics
- **Powertrain Analytics:** Time-filtered aggregations (Today, 7 Days, 30 Days) for speed profiles, specific energy consumption, and efficiency curves.
- **Trip History Logs:** Detailed trip telemetry with elevation route profiles, consumption rates, and anomaly tags.
- **Smart Recommendations:** Prescriptive maintenance actions prioritized by severity with root cause and estimated recovery impact.
- **Audit History:** Full chronological log of past AI model predictions, confidence scores, and resolution statuses.

---

## Technology Stack

### Frontend
- **Framework:** React 18 (Vite build system)
- **Styling:** Tailwind CSS & Glassmorphism design system
- **Visualization:** Recharts & Lucide React Icons
- **State & Context:** React Context API (`VehicleContext`, `AuthContext`)

### Backend & API
- **Web Framework:** Flask & Flask-CORS
- **Server:** RESTful endpoints running on port 5000
- **Serialization:** Joblib model pipelines and NumPy/Pandas JSON adapters

### Machine Learning & Data Science
- **Libraries:** Scikit-Learn, XGBoost, LightGBM, NumPy, Pandas, Joblib
- **Training Pipeline:** Multi-output regression pipelines, stratified K-fold cross-validation, and out-of-fold stacking

---

## Project Structure

```
Evguardian/
└── MAIN/
    ├── backend/
    │   ├── app.py                     # Flask REST API serving live ML predictions
    │   └── requirements.txt           # Python backend dependencies
    │
    ├── ML MODEL 1/
    │   ├── models_final/              # Serialized production models (.pkl)
    │   │   ├── xgboost_vehicle_health_score.pkl
    │   │   ├── xgboost_battery_soh.pkl
    │   │   ├── xgboost_estimated_range.pkl
    │   │   ├── failure_xgboost.pkl
    │   │   └── isolation_forest.pkl
    │   ├── results_final/             # Model evaluation summaries & metrics (JSON/CSV)
    │   ├── ev_guardian_middle_ground_final.csv  # 15,000-record training dataset
    │   └── train_ev_guardian_final.py # End-to-end model training script
    │
    ├── src/
    │   ├── main.jsx                   # React entry point
    │   ├── App.jsx                    # Navigation, layout & modal management
    │   ├── index.css                  # Tailwind styles & glowing glass theme
    │   │
    │   ├── context/                   # Context providers (Vehicle & Auth)
    │   ├── data/                      # Baseline telematics, presets & trip data
    │   ├── services/                  # Frontend API abstraction layer
    │   ├── components/                # Reusable UI cards, gauges, charts & modals
    │   └── views/                     # 15 full application views
    │       ├── RealTimeMonitoringView.jsx # Live ML inference dashboard (port 5000)
    │       ├── HomeDashboardView.jsx      # Central health dashboard
    │       ├── BatteryHealthView.jsx      # 16-cell matrix & battery degradation
    │       ├── VehicleHealthView.jsx      # Motor & powertrain diagnostics
    │       ├── AIPredictionView.jsx       # AI predictive health breakdown
    │       ├── AnalyticsView.jsx          # Efficiency & consumption trends
    │       ├── TripHistoryView.jsx        # Journey logs & elevation profiles
    │       └── ...
    │
    ├── package.json                   # Node.js dependencies and scripts
    ├── vite.config.js                 # Vite bundler configuration
    ├── tailwind.config.js             # Tailwind design token configuration
    └── .gitignore                     # Git rules (excludes venv, node_modules, build)
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher) and **npm**
- **Python** (v3.10 or higher) and **pip**
- **Git**

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Navdeepbalgoni/Evguardian.git
cd Evguardian/MAIN
```

---

### Step 2: Set Up and Run the Python ML Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows:**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask prediction API:
   ```bash
   python app.py
   ```
   *The backend server will start at `http://localhost:5000` and load all trained ML models.*

---

### Step 3: Set Up and Run the React Frontend

Open a new terminal window and navigate to the project directory:

```bash
cd Evguardian/MAIN
```

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   *(or the URL printed in your terminal)*

---

## REST API Endpoints

The Flask backend exposes the following REST endpoints on `http://localhost:5000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check verifying model loading status and server timestamp. |
| `GET` | `/api/simulate?profile={healthy\|warning\|critical}` | Generates simulated telematics reading and returns live multi-model predictions. |
| `POST` | `/api/predict` | Accepts a JSON payload containing vehicle sensor readings and returns inference results. |
| `GET` | `/api/model-info` | Returns validation metrics ($R^2$, MAE, RMSE, ROC-AUC) for all models. |
| `GET` | `/api/batch-simulate?profile={healthy\|warning\|critical}&count=10` | Generates a batch of sequential sensor readings with predictions. |

---

## Future Scope

- **Hardware CAN Bus Ingestion:** Interfacing with physical OBD-II / CAN transceiver hardware (e.g., ESP32 or Raspberry Pi) for real-vehicle data streaming.
- **Electrochemical Aging & RUL Forecast:** Integrating physics-based single-particle battery models (SPM) with LSTM recurrent networks to forecast Remaining Useful Life (RUL).
- **Automated Diagnostic Trouble Codes (DTC):** Translating predicted anomalies directly into standard automotive SAE J1939 / ISO 14229 DTC codes.
- **Cloud & Edge Containerization:** Packaging the digital twin into Docker containers for edge deployment on automotive compute units (NVIDIA DRIVE / Jetson).

---

## Academic Project & Disclaimer

This project is developed as a **Final-Year Engineering Project** exploring the intersection of electric vehicle telemetry, machine learning predictive maintenance, and digital twin technology.

> [!NOTE]
> This system is an academic research and engineering prototype developed for demonstration, analysis, and educational purposes. It is not an officially certified automotive safety system, and should not replace certified on-board vehicle diagnostic equipment (OBD/BMS) or manufacturer safety protocols.
