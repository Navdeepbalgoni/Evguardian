"""
EV Guardian - Real-Time Simulation & Prediction API
Loads trained ML models and serves predictions via REST endpoints.
"""

import os
import json
import random
import math
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ── Paths ──────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "ML MODEL 1", "models_final")
RESULTS_DIR = os.path.join(BASE_DIR, "..", "ML MODEL 1", "results_final")

# ── Load Models ────────────────────────────────────────────────────
print("Loading ML models...")

# Regression models (sklearn pipelines with preprocessor baked in)
health_model = joblib.load(os.path.join(MODEL_DIR, "xgboost_vehicle_health_score.pkl"))
soh_model = joblib.load(os.path.join(MODEL_DIR, "xgboost_battery_soh.pkl"))
range_model = joblib.load(os.path.join(MODEL_DIR, "xgboost_estimated_range.pkl"))

# Classification model (dict with preprocessor, model, classes)
failure_bundle = joblib.load(os.path.join(MODEL_DIR, "failure_xgboost.pkl"))
failure_preprocessor = failure_bundle["preprocessor"]
failure_model = failure_bundle["model"]
failure_classes = failure_bundle["classes"]

# Anomaly detection (dict with preprocessor, model)
anomaly_bundle = joblib.load(os.path.join(MODEL_DIR, "isolation_forest.pkl"))
anomaly_preprocessor = anomaly_bundle["preprocessor"]
anomaly_model = anomaly_bundle["model"]

# Load model results for display
with open(os.path.join(RESULTS_DIR, "final_summary.json"), "r") as f:
    model_results = json.load(f)

print("All models loaded successfully!")

# ── Feature columns (must match training) ──────────────────────────
FEATURE_COLUMNS = [
    "Vehicle_Type", "Vehicle_Age_Years", "Odometer_km", "Battery_SOC",
    "Battery_Design_Capacity_Wh", "Battery_Voltage", "Battery_Current",
    "Battery_Temperature", "Battery_Internal_Resistance", "Battery_Cell_Imbalance",
    "Charge_Cycles", "Charging_Status", "Charging_Type", "Charging_Duration_Min",
    "Motor_RPM", "Motor_Torque_Nm", "Motor_Current", "Motor_Temperature",
    "Motor_Efficiency", "Vehicle_Speed", "Acceleration", "Distance_Travelled",
    "Energy_Consumption_Wh_per_km", "Driving_Style", "Driving_Score",
    "Harsh_Acceleration_Count", "Hard_Braking_Count", "Ambient_Temperature",
    "Humidity", "Road_Type", "Traffic_Level", "Road_Slope",
    "Hour", "DayOfWeek", "Month", "Is_Weekend",
    "Hour_sin", "Hour_cos", "Battery_Power_W", "Temp_Diff_Motor_Ambient",
    "Temp_Diff_Battery_Ambient", "Km_per_Year", "Aggressive_Events",
    "Motor_Power_Proxy"
]

# ── Simulation Profiles ───────────────────────────────────────────
PROFILES = {
    "healthy": {
        "Vehicle_Type": "Four-Wheeler",
        "Vehicle_Age_Years": (0.5, 3.0),
        "Odometer_km": (5000, 30000),
        "Battery_SOC": (65, 95),
        "Battery_Design_Capacity_Wh": (50000, 65000),
        "Battery_Voltage": (355, 385),
        "Battery_Current": (8, 25),
        "Battery_Temperature": (25, 38),
        "Battery_Internal_Resistance": (0.035, 0.055),
        "Battery_Cell_Imbalance": (0.005, 0.02),
        "Charge_Cycles": (50, 250),
        "Charging_Status": ["Not Charging", "Charging"],
        "Charging_Type": ["AC", "DC Fast"],
        "Charging_Duration_Min": (0, 30),
        "Motor_RPM": (800, 2500),
        "Motor_Torque_Nm": (30, 55),
        "Motor_Current": (8, 22),
        "Motor_Temperature": (22, 35),
        "Motor_Efficiency": (92, 98),
        "Vehicle_Speed": (15, 60),
        "Acceleration": (-2, 2),
        "Distance_Travelled": (20, 60),
        "Energy_Consumption_Wh_per_km": (130, 180),
        "Driving_Style": ["Calm", "Normal"],
        "Driving_Score": (70, 98),
        "Harsh_Acceleration_Count": (0, 3),
        "Hard_Braking_Count": (0, 3),
        "Ambient_Temperature": (22, 35),
        "Humidity": (40, 75),
        "Road_Type": ["City", "Highway", "Mixed"],
        "Traffic_Level": ["Low", "Medium"],
        "Road_Slope": (-3, 3),
    },
    "warning": {
        "Vehicle_Type": "Four-Wheeler",
        "Vehicle_Age_Years": (3.5, 6.0),
        "Odometer_km": (40000, 70000),
        "Battery_SOC": (35, 65),
        "Battery_Design_Capacity_Wh": (48000, 58000),
        "Battery_Voltage": (340, 365),
        "Battery_Current": (18, 35),
        "Battery_Temperature": (38, 52),
        "Battery_Internal_Resistance": (0.06, 0.085),
        "Battery_Cell_Imbalance": (0.025, 0.05),
        "Charge_Cycles": (300, 500),
        "Charging_Status": ["Not Charging", "Charging"],
        "Charging_Type": ["DC Fast", "AC"],
        "Charging_Duration_Min": (0, 60),
        "Motor_RPM": (1500, 3000),
        "Motor_Torque_Nm": (40, 65),
        "Motor_Current": (18, 35),
        "Motor_Temperature": (35, 48),
        "Motor_Efficiency": (87, 94),
        "Vehicle_Speed": (30, 70),
        "Acceleration": (-3, 3),
        "Distance_Travelled": (25, 55),
        "Energy_Consumption_Wh_per_km": (160, 200),
        "Driving_Style": ["Normal", "Aggressive"],
        "Driving_Score": (45, 72),
        "Harsh_Acceleration_Count": (3, 8),
        "Hard_Braking_Count": (3, 7),
        "Ambient_Temperature": (18, 38),
        "Humidity": (50, 90),
        "Road_Type": ["City", "Mixed"],
        "Traffic_Level": ["Medium", "High"],
        "Road_Slope": (-5, 5),
    },
    "critical": {
        "Vehicle_Type": "Four-Wheeler",
        "Vehicle_Age_Years": (6.0, 8.0),
        "Odometer_km": (70000, 95000),
        "Battery_SOC": (15, 40),
        "Battery_Design_Capacity_Wh": (44000, 55000),
        "Battery_Voltage": (330, 360),
        "Battery_Current": (30, 48),
        "Battery_Temperature": (48, 58),
        "Battery_Internal_Resistance": (0.08, 0.1),
        "Battery_Cell_Imbalance": (0.04, 0.07),
        "Charge_Cycles": (500, 700),
        "Charging_Status": ["Not Charging", "Charging"],
        "Charging_Type": ["DC Fast"],
        "Charging_Duration_Min": (0, 90),
        "Motor_RPM": (2000, 3200),
        "Motor_Torque_Nm": (50, 80),
        "Motor_Current": (25, 45),
        "Motor_Temperature": (40, 55),
        "Motor_Efficiency": (82, 90),
        "Vehicle_Speed": (35, 75),
        "Acceleration": (-4, 4),
        "Distance_Travelled": (15, 45),
        "Energy_Consumption_Wh_per_km": (180, 250),
        "Driving_Style": ["Aggressive"],
        "Driving_Score": (30, 55),
        "Harsh_Acceleration_Count": (6, 15),
        "Hard_Braking_Count": (5, 12),
        "Ambient_Temperature": (15, 40),
        "Humidity": (30, 95),
        "Road_Type": ["City", "Mixed", "Highway"],
        "Traffic_Level": ["High"],
        "Road_Slope": (-8, 8),
    }
}


def generate_reading(profile_name="healthy"):
    """Generate a single simulated EV sensor reading."""
    profile = PROFILES.get(profile_name, PROFILES["healthy"])
    now = datetime.now()

    def rand_range(r):
        return round(random.uniform(r[0], r[1]), 4)

    def rand_choice(lst):
        return random.choice(lst)

    vehicle_type = profile["Vehicle_Type"]
    vehicle_age = rand_range(profile["Vehicle_Age_Years"])
    odometer = rand_range(profile["Odometer_km"])
    battery_soc = rand_range(profile["Battery_SOC"])
    battery_design_cap = rand_range(profile["Battery_Design_Capacity_Wh"])
    battery_voltage = rand_range(profile["Battery_Voltage"])
    battery_current = rand_range(profile["Battery_Current"])
    battery_temp = rand_range(profile["Battery_Temperature"])
    battery_ir = rand_range(profile["Battery_Internal_Resistance"])
    battery_imbalance = rand_range(profile["Battery_Cell_Imbalance"])
    charge_cycles = int(rand_range(profile["Charge_Cycles"]))
    charging_status = rand_choice(profile["Charging_Status"])
    charging_type = rand_choice(profile["Charging_Type"])
    charging_duration = rand_range(profile["Charging_Duration_Min"]) if charging_status == "Charging" else 0.0
    motor_rpm = rand_range(profile["Motor_RPM"])
    motor_torque = rand_range(profile["Motor_Torque_Nm"])
    motor_current = rand_range(profile["Motor_Current"])
    motor_temp = rand_range(profile["Motor_Temperature"])
    motor_eff = rand_range(profile["Motor_Efficiency"])
    speed = rand_range(profile["Vehicle_Speed"])
    accel = rand_range(profile["Acceleration"])
    distance = rand_range(profile["Distance_Travelled"])
    energy_cons = rand_range(profile["Energy_Consumption_Wh_per_km"])
    driving_style = rand_choice(profile["Driving_Style"])
    driving_score = rand_range(profile["Driving_Score"])
    harsh_accel = int(rand_range(profile["Harsh_Acceleration_Count"]))
    hard_brake = int(rand_range(profile["Hard_Braking_Count"]))
    ambient_temp = rand_range(profile["Ambient_Temperature"])
    humidity = rand_range(profile["Humidity"])
    road_type = rand_choice(profile["Road_Type"])
    traffic = rand_choice(profile["Traffic_Level"])
    road_slope = rand_range(profile["Road_Slope"])

    # Derived features (matching training)
    hour = now.hour
    day_of_week = now.weekday()
    month = now.month
    is_weekend = 1 if day_of_week >= 5 else 0
    hour_sin = round(math.sin(2 * math.pi * hour / 24), 10)
    hour_cos = round(math.cos(2 * math.pi * hour / 24), 10)
    battery_power = round(battery_voltage * battery_current, 4)
    temp_diff_motor_ambient = round(motor_temp - ambient_temp, 4)
    temp_diff_battery_ambient = round(battery_temp - ambient_temp, 4)
    km_per_year = round(odometer / max(vehicle_age, 0.1), 4)
    aggressive_events = harsh_accel + hard_brake
    motor_power_proxy = round(motor_torque * motor_current, 4)

    reading = {
        "Vehicle_Type": vehicle_type,
        "Vehicle_Age_Years": vehicle_age,
        "Odometer_km": odometer,
        "Battery_SOC": battery_soc,
        "Battery_Design_Capacity_Wh": battery_design_cap,
        "Battery_Voltage": battery_voltage,
        "Battery_Current": battery_current,
        "Battery_Temperature": battery_temp,
        "Battery_Internal_Resistance": battery_ir,
        "Battery_Cell_Imbalance": battery_imbalance,
        "Charge_Cycles": charge_cycles,
        "Charging_Status": charging_status,
        "Charging_Type": charging_type,
        "Charging_Duration_Min": charging_duration,
        "Motor_RPM": motor_rpm,
        "Motor_Torque_Nm": motor_torque,
        "Motor_Current": motor_current,
        "Motor_Temperature": motor_temp,
        "Motor_Efficiency": motor_eff,
        "Vehicle_Speed": speed,
        "Acceleration": accel,
        "Distance_Travelled": distance,
        "Energy_Consumption_Wh_per_km": energy_cons,
        "Driving_Style": driving_style,
        "Driving_Score": driving_score,
        "Harsh_Acceleration_Count": harsh_accel,
        "Hard_Braking_Count": hard_brake,
        "Ambient_Temperature": ambient_temp,
        "Humidity": humidity,
        "Road_Type": road_type,
        "Traffic_Level": traffic,
        "Road_Slope": road_slope,
        "Hour": hour,
        "DayOfWeek": day_of_week,
        "Month": month,
        "Is_Weekend": is_weekend,
        "Hour_sin": hour_sin,
        "Hour_cos": hour_cos,
        "Battery_Power_W": battery_power,
        "Temp_Diff_Motor_Ambient": temp_diff_motor_ambient,
        "Temp_Diff_Battery_Ambient": temp_diff_battery_ambient,
        "Km_per_Year": km_per_year,
        "Aggressive_Events": aggressive_events,
        "Motor_Power_Proxy": motor_power_proxy,
    }

    return reading


def predict_from_reading(reading):
    """Run all ML models on a single reading and return predictions."""
    df = pd.DataFrame([reading])

    # 1. Vehicle Health Score (regression pipeline)
    health_score = float(health_model.predict(df[FEATURE_COLUMNS])[0])

    # 2. Battery SOH (regression pipeline)
    battery_soh = float(soh_model.predict(df[FEATURE_COLUMNS])[0])

    # 3. Estimated Range (regression pipeline)
    est_range = float(range_model.predict(df[FEATURE_COLUMNS])[0])

    # 4. Failure Risk (classifier with separate preprocessor)
    X_fail = failure_preprocessor.transform(df[FEATURE_COLUMNS])
    fail_pred_idx = int(failure_model.predict(X_fail)[0])
    fail_proba = failure_model.predict_proba(X_fail)[0]
    failure_risk_label = failure_classes[fail_pred_idx]
    failure_probabilities = {
        failure_classes[i]: round(float(fail_proba[i]) * 100, 2)
        for i in range(len(failure_classes))
    }

    # 5. Anomaly Detection
    X_anom = anomaly_preprocessor.transform(df[FEATURE_COLUMNS])
    anomaly_score = float(anomaly_model.decision_function(X_anom)[0])
    is_anomaly = int(anomaly_model.predict(X_anom)[0]) == -1

    # Determine preventive measure based on failure risk
    if failure_risk_label == "High":
        preventive = "Immediate inspection and battery/motor diagnostics"
    elif failure_risk_label == "Medium":
        preventive = "Schedule battery and motor inspection"
    else:
        preventive = "Routine maintenance and periodic monitoring"

    # Estimate RUL based on health score
    rul_days = max(30, int(health_score * 15 + random.uniform(-50, 50)))

    predictions = {
        "vehicle_health_score": round(health_score, 2),
        "battery_soh": round(battery_soh, 2),
        "estimated_range_km": round(est_range, 2),
        "failure_risk": failure_risk_label,
        "failure_probabilities": failure_probabilities,
        "is_anomaly": is_anomaly,
        "anomaly_score": round(anomaly_score, 4),
        "preventive_measure": preventive,
        "remaining_useful_life_days": rul_days,
        "timestamp": datetime.now().isoformat(),
        "models_used": {
            "health": "XGBoost (R²=0.862)",
            "soh": "XGBoost (R²=0.947)",
            "range": "XGBoost (R²=0.959)",
            "failure": "XGBoost (Acc=79.0%, AUC=0.927)",
            "anomaly": "Isolation Forest (5.5% anomaly rate)"
        }
    }

    return predictions


# ── API Routes ─────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def api_health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "models_loaded": True, "timestamp": datetime.now().isoformat()})


@app.route("/api/simulate", methods=["GET"])
def api_simulate():
    """Generate a simulated EV reading and return with predictions."""
    profile = request.args.get("profile", "healthy")
    reading = generate_reading(profile)
    predictions = predict_from_reading(reading)

    return jsonify({
        "reading": reading,
        "predictions": predictions
    })


@app.route("/api/predict", methods=["POST"])
def api_predict():
    """Accept a custom reading and return predictions."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    predictions = predict_from_reading(data)
    return jsonify({"predictions": predictions})


@app.route("/api/model-info", methods=["GET"])
def api_model_info():
    """Return model performance metrics."""
    return jsonify(model_results)


@app.route("/api/batch-simulate", methods=["GET"])
def api_batch_simulate():
    """Generate multiple simulated readings with predictions."""
    profile = request.args.get("profile", "healthy")
    count = min(int(request.args.get("count", 10)), 50)

    results = []
    for _ in range(count):
        reading = generate_reading(profile)
        predictions = predict_from_reading(reading)
        results.append({"reading": reading, "predictions": predictions})

    return jsonify({"results": results, "count": len(results)})


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("EV GUARDIAN - Real-Time Prediction API")
    print("=" * 60)
    print(f"Models directory: {MODEL_DIR}")
    print(f"Failure classes: {failure_classes}")
    print("Starting server on http://localhost:5000")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=True)
