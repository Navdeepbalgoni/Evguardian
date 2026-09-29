# EV Guardian

**Full Title:** AI-Powered Digital Twin for Predictive Health Monitoring and Failure Prevention in Electric Vehicles

---

## Overview

**EV Guardian** is an AI-powered Digital Twin based system designed to monitor electric vehicle (EV) health, analyze vehicle and battery parameters, detect abnormal conditions, predict possible failures, and provide health status, alerts, and maintenance recommendations.

The system is developed to combine EV operational and sensor telemetry, data analytics, machine learning, anomaly detection, fault prediction, and a digital-twin-inspired interface to deliver proactive, predictive vehicle health monitoring.

This project is being developed as a **final-year engineering project**.

---

## Problem Statement

Conventional electric vehicle monitoring systems primarily provide basic descriptive indicators and current status metrics (such as immediate State of Charge, speedometer readings, or simple threshold fault lamps). They often fail to identify subtle, progressive degradation trends or thermal and electrical anomalies before they escalate.

**EV Guardian** addresses this limitation by analyzing multiple interrelated vehicle and battery parameters over time. By observing trends across electrical, thermal, and mechanical subsystems, the system aims to detect abnormal behavior and predict potential failures before they compromise vehicle reliability, performance, or safety.

---

## Objectives

The primary objectives of the EV Guardian project include:

- **Monitor EV Health Parameters:** Continuously track operational telemetry across powertrain and battery systems.
- **Monitor Battery and Vehicle Condition:** Observe critical parameters including State of Charge (SOC), State of Health (SOH), pack temperature, cell voltage balance, and internal resistance.
- **Detect Abnormal Behavior:** Identify deviations from baseline operating patterns across thermal and electrical signals.
- **Predict Possible Failures:** Estimate failure risks and degradation trends before critical hardware breakdowns occur.
- **Provide Vehicle Health Status:** Present clear, aggregated health scores across overall vehicle, motor, battery, and driving efficiency domains.
- **Generate Alerts and Recommendations:** Provide proactive warnings and actionable maintenance guidance based on observed anomalies.
- **Visualize Vehicle Information:** Deliver a digital-twin-inspired, responsive user interface reflecting real-time and historical vehicle behavior.
- **Support Predictive Maintenance:** Shift maintenance strategies from reactive repairs to data-driven, preventive intervention.

---

## Key Features

### Currently Implemented (Frontend Prototype)

- **Interactive Health Dashboard:** Central radial vehicle health gauge, primary health metric cards (Battery Health, Motor Health, Temperature, Remaining Range), and quick operational status alerts.
- **Live Vehicle Telemetry Grid:** Interactive visualization of 12 vehicle parameters including SOC, pack voltage, discharge current, battery temperature, vehicle speed, acceleration, energy consumption, regenerative braking, road gradient, distance travelled, and remaining range.
- **Dedicated Battery Health Monitor:** Detailed battery diagnostics interface including SOH/SOC tracking, 16-cell battery pack voltage and thermal matrix visualizer, and 5 interactive charts:
  - State of Charge (SOC) vs. Time
  - Battery Temperature vs. Time (with threshold limits)
  - Pack Voltage vs. Time
  - Current Dynamics (Discharge vs. Regen Recovery)
  - Battery Degradation & Capacity Forecast Curve
- **Powertrain & Vehicle Health Page:** Subsystem diagnostics for Permanent Magnet Synchronous Motor (PMSM), motor torque and power curve visualization, and driving behavior metrics.
- **AI Fault Prediction Interface:** A frontend demonstration interface (not a deployed machine learning model) that visualizes 4 fault domains (*Battery Fault*, *Motor Fault*, *Performance Fault*, *Operational Fault*) using simulated/mock risk values and SHAP-inspired visualization.
- **Predictive Alert Modal System:** Reusable modal alerts that dynamically reflect *Healthy*, *Warning*, and *Critical* states with recommended actions and diagnostic shortcuts.
- **Powertrain Analytics Dashboard:** Time-filtered analytics (*Today*, *7 Days*, *30 Days*) for speed profiles, longitudinal acceleration/deceleration, specific energy consumption (Wh/km), and estimated vs. delivered range.
- **Trip History & Telemetry Breakdown:** Detailed trip session logs with distance, energy consumption rates, battery utilization, elevation route profiles, and recorded anomaly flags.
- **Notification Center:** Filterable alert feed (*All*, *Alerts*, *Predictions*, *Maintenance*, *System*) with timestamped notices and direct action shortcuts.
- **Smart Recommendations:** Prescriptive guidance categorized by priority (*High*, *Medium*, *Low Priority*) with root-cause diagnoses, prescribed actions, and estimated impacts.
- **Prediction Audit History:** Chronological table tracking historical model predictions, risk levels, probability scores, and maintenance resolution statuses.
- **Interactive State Simulator (For Evaluation & Demo):** Top simulation control bar allowing seamless switching between *NORMAL (94%)*, *WARNING (76%)*, and *CRITICAL (52%)* conditions, along with a toggleable 10 Hz telemetry streaming ticker.
- **Service Layer Architecture:** Abstracted API service layer (`src/services/api.js`) ready to connect to a live backend API.

### Planned / Under Development

- **AI-Based Fault Prediction Engine:** Deployment of trained machine learning models to generate live inference from streaming data.
- **Isolation Forest Anomaly Detection:** Unsupervised anomaly detection for multi-sensor CAN bus data streams.
- **Random Forest Fault Classification:** Supervised multi-class classification for identifying specific fault types.
- **XGBoost Model Comparison:** Comparative evaluation of gradient boosting algorithms against ensemble methods for classification accuracy.
- **Battery Health & RUL Prediction:** Recurrent Neural Network (LSTM) and physics-informed models for State of Health (SOH) and Remaining Useful Life (RUL) estimation.
- **Real-Time Digital Twin Synchronization:** Bi-directional synchronization between vehicle telemetry hardware/API and the digital twin model.
- **Backend API Integration:** REST/WebSocket service using Python (FastAPI/Flask) to serve real-time predictions.

---

## Technology Stack

The currently implemented application uses the following technologies:

- **Frontend Framework:** React (v18.3.1) & React DOM (v18.3.1) [package.json: `^18.3.1`]
- **Build Tool & Dev Server:** Vite (v6.4.3) [package.json: `^6.2.0`]
- **Styling & Design System:** Tailwind CSS (v3.4.19) [package.json: `^3.4.17`]
- **Programming Language:** JavaScript (ES Modules)
- **Charting & Data Visualization:** Recharts (v2.15.4) [package.json: `^2.15.1`]
- **Icons:** Lucide React (v0.475.0) [package.json: `^0.475.0`]
- **CSS Processing:** PostCSS (v8.5.28) & Autoprefixer (v10.5.5) [package.json: `^8.5.3` & `^10.4.20`]

---

## Project Structure

The project follows a clean, component-based modular structure:

```
code/
├── index.html                       # HTML5 entry point
├── package.json                     # Project dependencies and npm scripts
├── package-lock.json                # Locked dependency tree
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind theme configuration
├── postcss.config.js                # PostCSS plugin setup
├── .gitignore                       # Git ignore rules for node_modules, build, logs, and env
├── README.md                        # Project documentation
└── src/
    ├── main.jsx                     # Application root entry point
    ├── App.jsx                      # Navigation router, layout manager & alert modal integration
    ├── index.css                    # Tailwind CSS directives and glassmorphism styling
    │
    ├── context/                     # React Context providers
    │   ├── AuthContext.jsx          # User identity, demo credentials & onboarding state
    │   └── VehicleContext.jsx       # State management for simulation presets, live ticker & alerts
    │
    ├── data/                        # Modular datasets (structured for future API replacement)
    │   ├── batteryData.js           # SOH/SOC, 16-cell matrix, and 5 chart time-series datasets
    │   ├── notificationData.js      # System, alert, and predictive maintenance notifications
    │   ├── predictionData.js        # 4 fault domain models, risk presets & SHAP contributions
    │   ├── predictionHistoryData.js # Historical log of past AI predictions and resolutions
    │   ├── recommendationData.js    # Prioritized maintenance recommendations and impact metrics
    │   ├── tripData.js              # Historical journey logs with elevation and anomaly telemetry
    │   └── vehicleData.js           # Vehicle specs, 12 live sensor parameters, and health presets
    │
    ├── services/                    # API abstraction layer
    │   └── api.js                   # Asynchronous service layer ready for backend ML endpoints
    │
    ├── components/                  # Reusable UI components
    │   ├── common/                  # Shared presentation components
    │   │   ├── AlertModal.jsx       # Reusable predictive alert modal (Healthy/Warning/Critical)
    │   │   ├── ChartCard.jsx        # Glassmorphic container for Recharts visualizers
    │   │   ├── DigitalTwinPipeline.jsx # Visual 6-stage ML pipeline indicator
    │   │   ├── EmptyState.jsx       # Fallback display for empty data lists
    │   │   ├── HealthCard.jsx       # Key metric card (Battery, Motor, Temp, Range)
    │   │   ├── HealthScore.jsx      # Circular glowing SVG radial health score gauge
    │   │   ├── LoadingState.jsx     # Telemetry loading indicator
    │   │   ├── RiskIndicator.jsx    # Pulsing Low/Medium/High risk badge
    │   │   └── SensorCard.jsx       # Parameter card with min/max bounds and status pill
    │   │
    │   ├── layout/                  # Navigation and frame components
    │   │   ├── BottomNavigation.jsx # Mobile navigation bar
    │   │   ├── DemoControlBar.jsx   # Top simulator bar for switching Normal/Warning/Critical
    │   │   ├── Navbar.jsx           # Top header with vehicle status and notification bell
    │   │   └── Sidebar.jsx          # Collapsible desktop navigation with risk badges
    │   │
    │   └── modules/                 # Domain-specific UI modules
    │       ├── CellMatrixVisualizer.jsx # 16-cell battery pack voltage and thermal grid
    │       ├── FaultDetailModal.jsx # Deep-dive diagnostic modal with SHAP-style attribution
    │       ├── LiveParametersGrid.jsx   # 12 real-time CAN bus sensor parameter cards
    │       └── TripDetailModal.jsx  # Individual trip telemetry breakdown and elevation chart
    │
    └── views/                       # Main application screens
        ├── HomeDashboardView.jsx    # Central dashboard with health ring, live parameters & AI card
        ├── VehicleHealthView.jsx    # Motor health, torque/power curve & operational performance
        ├── BatteryHealthView.jsx    # Battery digital twin with 5 Recharts & cell matrix
        ├── AIPredictionView.jsx     # AI fault prediction screen with 4 fault domains
        ├── AnalyticsView.jsx        # Driving, battery, and range analytics (Today/7D/30D)
        ├── TripHistoryView.jsx      # Clickable trip history with detailed telemetry view
        ├── NotificationsView.jsx    # Notification center with category filters
        ├── RecommendationsView.jsx  # Smart prioritized recommendations with impact estimates
        ├── PredictionHistoryView.jsx# Audit table of past predictions and outcomes
        ├── ProfileSettingsView.jsx  # User profile, vehicle specs, and telemetry preferences
        ├── LoginView.jsx            # Authentication view with one-click demo logins
        ├── RegisterView.jsx         # User registration with password validation
        └── VehicleSetupView.jsx     # Vehicle and battery pack onboarding with live preview card
```

---

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd code
```

*(Or navigate into the directory containing `package.json`).*

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open your browser and navigate to the local URL displayed in the terminal (typically `http://localhost:3000` or `http://localhost:5173`).

### 5. Build for Production (Optional)

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Development Status

This project is currently under **active development**.

- **Currently Implemented:**
  - Complete, responsive frontend user interface and design system.
  - Interactive Digital Twin visualization and simulation engine (*Normal*, *Warning*, and *Critical* states).
  - 14 complete application screens covering all dashboard views, diagnostics, and settings.
  - Realistic time-series datasets and interactive charts for battery and vehicle analytics.
  - Decoupled mock data architecture and service layer prepared for API integration.

- **Under Development / Planned:**
  - Real-time CAN bus sensor data ingestion pipeline.
  - Python (FastAPI/Flask) backend server integration.
  - Machine learning models for anomaly detection (Isolation Forest) and fault prediction (Random Forest / XGBoost / LSTM).
  - Model evaluation, benchmark comparisons, and real-time inference serving.

---

## Future Scope

Planned future enhancements for the EV Guardian project include:

- **Real-Time EV Sensor Integration:** Connecting physical or hardware-in-the-loop (HIL) telemetry via OBD-II or CAN bus interfaces.
- **Machine Learning Based Fault Prediction:** Deploying trained models for real-time inference on multi-dimensional telemetry streams.
- **Unsupervised Anomaly Detection:** Implementing Autoencoders and Isolation Forests to detect subtle electro-thermal deviations.
- **Battery State of Health (SOH) Prediction:** Integrating electrochemical aging models with recurrent neural networks to forecast Remaining Useful Life (RUL).
- **Automated Prescriptive Maintenance:** Linking predicted fault modes to automated service scheduling and diagnostic trouble codes (DTC).
- **Backend / API Integration:** Connecting the frontend service layer (`src/services/api.js`) to live cloud or edge inference APIs.
- **Real-Time Digital Twin Synchronization:** Bi-directional synchronization enabling remote BMS parameter adjustments and safety derating commands.
- **Advanced Historical Analytics:** Fleet-wide degradation analytics and cross-vehicle comparative benchmarking.
- **Production Deployment:** Cloud deployment with containerization and continuous telematics ingestion.

---

## Academic Project

**EV Guardian** is being developed as a **final-year engineering project**. It explores the application of data-driven digital twin concepts, telematics analysis, and predictive machine learning architectures to enhance reliability, performance, and failure prevention in electric vehicles.

---

## Disclaimer

This software system is an academic research and engineering prototype developed for demonstration, analysis, and educational purposes. It is not an officially certified automotive safety system, and it should not be used as a replacement for certified on-board vehicle diagnostic equipment (OBD/BMS), manufacturer safety protocols, or professional automotive maintenance services.
