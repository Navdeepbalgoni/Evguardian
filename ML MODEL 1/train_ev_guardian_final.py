"""
EV GUARDIAN - FINAL REALISTIC ML TRAINING PIPELINE
Changes implemented:
1. SOH prediction excludes downstream/output variables.
2. Estimated Range is treated as a less-direct target in the supplied dataset.
3. Failure Risk stacking uses proper out-of-fold (OOF) predictions.

Dataset expected:
    ev_guardian_middle_ground_final.csv
Place this file in the same folder as this script.
"""

import os
import json
import joblib
import warnings
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, IsolationForest
from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix, roc_auc_score
)
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold
from xgboost import XGBRegressor, XGBClassifier

try:
    from lightgbm import LGBMClassifier
    LIGHTGBM_AVAILABLE = True
except ImportError:
    LIGHTGBM_AVAILABLE = False

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "ev_guardian_middle_ground_final.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models_final")
RESULT_DIR = os.path.join(BASE_DIR, "results_final")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

RANDOM_STATE = 42

print("=" * 70)
print("EV GUARDIAN - FINAL REALISTIC ML TRAINING")
print("=" * 70)

# -------------------------------------------------------------------
# 1. LOAD DATA
# -------------------------------------------------------------------
print("\nLoading dataset...")
df = pd.read_csv(DATA_PATH)

df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp").reset_index(drop=True)

# Timestamp-derived features
df["Timestamp_Year"] = df["Timestamp"].dt.year
df["Timestamp_Day"] = df["Timestamp"].dt.day
df["Timestamp_DayOfYear"] = df["Timestamp"].dt.dayofyear

print(f"Dataset shape: {df.shape}")

# -------------------------------------------------------------------
# 2. TARGETS
# -------------------------------------------------------------------
TARGET_HEALTH = "Vehicle_Health_Score"
TARGET_FAILURE = "Failure_Risk"
TARGET_SOH = "Battery_SOH"
TARGET_RANGE = "Estimated_Range"

OUTPUT_VARIABLES = [
    "Failure_Risk",
    "Predicted_Failure",
    "Vehicle_Health_Score",
    "Remaining_Useful_Life_Days",
    "Preventive_Measure",
    "Battery_SOH",
    "Estimated_Range",
    "Capacity_Loss_Wh",
]

# -------------------------------------------------------------------
# 3. LEAKAGE-SAFE FEATURE GROUPS
# -------------------------------------------------------------------
common_current_state = [
    "Vehicle_Type",
    "Vehicle_Age_Years",
    "Odometer_km",
    "Battery_SOC",
    "Battery_Design_Capacity_Wh",
    "Battery_Voltage",
    "Battery_Current",
    "Battery_Temperature",
    "Battery_Internal_Resistance",
    "Battery_Cell_Imbalance",
    "Charge_Cycles",
    "Charging_Status",
    "Charging_Type",
    "Charging_Duration_Min",
    "Motor_RPM",
    "Motor_Torque_Nm",
    "Motor_Current",
    "Motor_Temperature",
    "Motor_Efficiency",
    "Vehicle_Speed",
    "Acceleration",
    "Distance_Travelled",
    "Energy_Consumption_Wh_per_km",
    "Driving_Style",
    "Driving_Score",
    "Harsh_Acceleration_Count",
    "Hard_Braking_Count",
    "Ambient_Temperature",
    "Humidity",
    "Road_Type",
    "Traffic_Level",
    "Road_Slope",
    "Hour",
    "DayOfWeek",
    "Month",
    "Is_Weekend",
    "Hour_sin",
    "Hour_cos",
    "Battery_Power_W",
    "Temp_Diff_Motor_Ambient",
    "Temp_Diff_Battery_Ambient",
    "Km_per_Year",
    "Aggressive_Events",
    "Motor_Power_Proxy",
]

# Health: current observable vehicle state only.
health_features = common_current_state.copy()

# Failure: current observable vehicle state only.
failure_features = common_current_state.copy()

# IMPORTANT:
# SOH does NOT use Battery_Current_Capacity_Wh, Capacity_Loss_Wh,
# Health Score, RUL, Range, Failure Risk, or Predicted Failure.
soh_features = common_current_state.copy()

# Range excludes direct target/output variables.
# Battery_Current_Capacity_Wh and Capacity_Loss_Wh are deliberately excluded.
range_features = common_current_state.copy()

print("\nFEATURE SAFETY")
print(f"Health features : {len(health_features)}")
print(f"Failure features: {len(failure_features)}")
print(f"SOH features    : {len(soh_features)}")
print(f"Range features  : {len(range_features)}")

assert TARGET_SOH not in soh_features
assert "Battery_Current_Capacity_Wh" not in soh_features
assert "Capacity_Loss_Wh" not in soh_features
assert "Vehicle_Health_Score" not in soh_features
assert "Remaining_Useful_Life_Days" not in soh_features
assert "Estimated_Range" not in soh_features
assert "Failure_Risk" not in soh_features
assert "Predicted_Failure" not in soh_features
assert "Preventive_Measure" not in soh_features

# -------------------------------------------------------------------
# 4. PREPROCESSOR
# -------------------------------------------------------------------
def make_preprocessor(X):
    numeric_cols = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = [c for c in X.columns if c not in numeric_cols]

    numeric_pipe = Pipeline([
        ("imputer", SimpleImputer(strategy="median"))
    ])

    categorical_pipe = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ])

    return ColumnTransformer([
        ("num", numeric_pipe, numeric_cols),
        ("cat", categorical_pipe, categorical_cols)
    ])

# -------------------------------------------------------------------
# 5. CHRONOLOGICAL SPLIT
# -------------------------------------------------------------------
n = len(df)
train_end = int(n * 0.70)
val_end = int(n * 0.85)

train_df = df.iloc[:train_end].copy()
val_df = df.iloc[train_end:val_end].copy()
test_df = df.iloc[val_end:].copy()

print("\nCHRONOLOGICAL SPLIT")
print(f"Train      : {train_df.shape}")
print(f"Validation : {val_df.shape}")
print(f"Test       : {test_df.shape}")

# -------------------------------------------------------------------
# 6. REGRESSION HELPER
# -------------------------------------------------------------------
def train_regression(target, features, name, model):
    print(f"\nTraining {name} for {target}...")

    X_train = train_df[features]
    y_train = train_df[target]

    X_test = test_df[features]
    y_test = test_df[target]

    preprocessor = make_preprocessor(X_train)

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    pipeline.fit(X_train, y_train)

    pred = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, pred)
    rmse = np.sqrt(mean_squared_error(y_test, pred))
    r2 = r2_score(y_test, pred)

    print(f"\n{name} - {target}")
    print(f"MAE  : {mae:.4f}")
    print(f"RMSE : {rmse:.4f}")
    print(f"R²   : {r2:.4f}")

    joblib.dump(pipeline, os.path.join(MODEL_DIR, f"{name.lower().replace(' ', '_')}_{target.lower()}.pkl"))

    return {
        "Target": target,
        "Model": name,
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2
    }

# -------------------------------------------------------------------
# 7. MODELS
# -------------------------------------------------------------------
rf_reg_params = dict(
    n_estimators=300,
    max_depth=10,
    min_samples_split=10,
    min_samples_leaf=5,
    max_features=0.7,
    random_state=RANDOM_STATE,
    n_jobs=-1
)

xgb_reg_params = dict(
    n_estimators=300,
    learning_rate=0.04,
    max_depth=4,
    min_child_weight=8,
    subsample=0.75,
    colsample_bytree=0.75,
    reg_alpha=0.1,
    reg_lambda=2.0,
    objective="reg:squarederror",
    random_state=RANDOM_STATE,
    n_jobs=-1
)

# -------------------------------------------------------------------
# 8. HEALTH
# -------------------------------------------------------------------
print("\n" + "=" * 70)
print("VEHICLE HEALTH SCORE")
print("=" * 70)

health_results = []

health_results.append(train_regression(
    TARGET_HEALTH,
    health_features,
    "RandomForest",
    RandomForestRegressor(**rf_reg_params)
))

health_results.append(train_regression(
    TARGET_HEALTH,
    health_features,
    "XGBoost",
    XGBRegressor(**xgb_reg_params)
))

# -------------------------------------------------------------------
# 9. FAILURE RISK
# -------------------------------------------------------------------
print("\n" + "=" * 70)
print("FAILURE RISK")
print("=" * 70)

X_train_fail = train_df[failure_features]
X_test_fail = test_df[failure_features]

y_train_fail = train_df[TARGET_FAILURE]
y_test_fail = test_df[TARGET_FAILURE]

classes = sorted(y_train_fail.unique())
class_to_int = {c: i for i, c in enumerate(classes)}
int_to_class = {i: c for c, i in class_to_int.items()}

y_train_encoded = y_train_fail.map(class_to_int)
y_test_encoded = y_test_fail.map(class_to_int)

pre_fail = make_preprocessor(X_train_fail)

X_train_fail_p = pre_fail.fit_transform(X_train_fail)
X_test_fail_p = pre_fail.transform(X_test_fail)

rf_clf = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    min_samples_split=10,
    min_samples_leaf=5,
    max_features=0.7,
    class_weight=None,
    random_state=RANDOM_STATE,
    n_jobs=-1
)

xgb_clf = XGBClassifier(
    n_estimators=300,
    learning_rate=0.04,
    max_depth=4,
    min_child_weight=8,
    subsample=0.75,
    colsample_bytree=0.75,
    reg_alpha=0.1,
    reg_lambda=2.0,
    objective="multi:softprob",
    num_class=len(classes),
    eval_metric="mlogloss",
    random_state=RANDOM_STATE,
    n_jobs=-1
)

models = {
    "RandomForest": rf_clf,
    "XGBoost": xgb_clf
}

if LIGHTGBM_AVAILABLE:
    models["LightGBM"] = LGBMClassifier(
        n_estimators=300,
        learning_rate=0.04,
        max_depth=5,
        num_leaves=24,
        min_child_samples=20,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=2.0,
        objective="multiclass",
        random_state=RANDOM_STATE,
        verbosity=-1
    )

failure_results = []
test_probabilities = {}

for name, model in models.items():
    print(f"\nTraining Failure {name}...")
    model.fit(X_train_fail_p, y_train_encoded)

    pred = model.predict(X_test_fail_p)
    prob = model.predict_proba(X_test_fail_p)

    acc = accuracy_score(y_test_encoded, pred)
    precision = precision_score(y_test_encoded, pred, average="weighted", zero_division=0)
    recall = recall_score(y_test_encoded, pred, average="weighted", zero_division=0)
    f1 = f1_score(y_test_encoded, pred, average="weighted", zero_division=0)
    auc = roc_auc_score(
        y_test_encoded,
        prob,
        multi_class="ovr",
        average="weighted"
    )

    print(f"\n{name} - Failure Risk")
    print(f"Accuracy  : {acc:.4f}")
    print(f"Precision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1 Score  : {f1:.4f}")
    print(f"ROC-AUC   : {auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(
        y_test_encoded,
        pred,
        target_names=[int_to_class[i] for i in range(len(classes))],
        zero_division=0
    ))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test_encoded, pred))

    failure_results.append({
        "Model": name,
        "Accuracy": acc,
        "Precision": precision,
        "Recall": recall,
        "F1": f1,
        "ROC_AUC": auc
    })

    test_probabilities[name] = prob
    joblib.dump(
        {"preprocessor": pre_fail, "model": model,
         "classes": classes},
        os.path.join(MODEL_DIR, f"failure_{name.lower()}.pkl")
    )

# -------------------------------------------------------------------
# 10. PROPER OOF STACKING
# -------------------------------------------------------------------
print("\n" + "=" * 70)
print("FAILURE RISK - PROPER OOF STACKING")
print("=" * 70)

# IMPORTANT:
# Base learners are fitted on K-1 folds and predict the held-out fold.
# The meta-learner sees ONLY out-of-fold predictions.
# This prevents training-data leakage.

skf = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=RANDOM_STATE
)

base_factories = {
    "RF": lambda: RandomForestClassifier(
        n_estimators=250,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=5,
        max_features=0.7,
        random_state=RANDOM_STATE,
        n_jobs=-1
    ),
    "XGB": lambda: XGBClassifier(
        n_estimators=250,
        learning_rate=0.04,
        max_depth=4,
        min_child_weight=8,
        subsample=0.75,
        colsample_bytree=0.75,
        reg_alpha=0.1,
        reg_lambda=2.0,
        objective="multi:softprob",
        num_class=len(classes),
        eval_metric="mlogloss",
        random_state=RANDOM_STATE,
        n_jobs=-1
    )
}

if LIGHTGBM_AVAILABLE:
    base_factories["LGBM"] = lambda: LGBMClassifier(
        n_estimators=250,
        learning_rate=0.04,
        max_depth=5,
        num_leaves=24,
        min_child_samples=20,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=2.0,
        objective="multiclass",
        random_state=RANDOM_STATE,
        verbosity=-1
    )

n_classes = len(classes)
n_train = len(X_train_fail_p)

oof_meta = np.zeros((n_train, len(base_factories) * n_classes))
test_meta = np.zeros((len(X_test_fail_p), len(base_factories) * n_classes))

for model_index, (model_name, factory) in enumerate(base_factories.items()):
    print(f"\nOOF training: {model_name}")

    oof_probs = np.zeros((n_train, n_classes))
    fold_test_probs = []

    for fold, (tr_idx, val_idx) in enumerate(
        skf.split(X_train_fail_p, y_train_encoded),
        start=1
    ):
        model = factory()

        X_tr = X_train_fail_p[tr_idx]
        X_val = X_train_fail_p[val_idx]
        y_tr = y_train_encoded.iloc[tr_idx]

        model.fit(X_tr, y_tr)

        oof_probs[val_idx] = model.predict_proba(X_val)
        fold_test_probs.append(model.predict_proba(X_test_fail_p))

        print(f"  Fold {fold}/5 complete")

    start_col = model_index * n_classes
    end_col = start_col + n_classes

    oof_meta[:, start_col:end_col] = oof_probs
    test_meta[:, start_col:end_col] = np.mean(fold_test_probs, axis=0)

# Meta learner is trained only on OOF predictions.
meta_model = LogisticRegression(
    max_iter=2000,
    C=0.5,
    random_state=RANDOM_STATE
)

meta_model.fit(oof_meta, y_train_encoded)

stack_pred = meta_model.predict(test_meta)
stack_prob = meta_model.predict_proba(test_meta)

stack_acc = accuracy_score(y_test_encoded, stack_pred)
stack_precision = precision_score(
    y_test_encoded, stack_pred, average="weighted", zero_division=0
)
stack_recall = recall_score(
    y_test_encoded, stack_pred, average="weighted", zero_division=0
)
stack_f1 = f1_score(
    y_test_encoded, stack_pred, average="weighted", zero_division=0
)
stack_auc = roc_auc_score(
    y_test_encoded,
    stack_prob,
    multi_class="ovr",
    average="weighted"
)

print("\nPROPER STACKING RESULTS")
print(f"Accuracy  : {stack_acc:.4f}")
print(f"Precision : {stack_precision:.4f}")
print(f"Recall    : {stack_recall:.4f}")
print(f"F1 Score  : {stack_f1:.4f}")
print(f"ROC-AUC   : {stack_auc:.4f}")
print("\nClassification Report:")
print(classification_report(
    y_test_encoded,
    stack_pred,
    target_names=[int_to_class[i] for i in range(len(classes))],
    zero_division=0
))
print("Confusion Matrix:")
print(confusion_matrix(y_test_encoded, stack_pred))

failure_results.append({
    "Model": "OOF_Stacking",
    "Accuracy": stack_acc,
    "Precision": stack_precision,
    "Recall": stack_recall,
    "F1": stack_f1,
    "ROC_AUC": stack_auc
})

joblib.dump(
    {
        "preprocessor": pre_fail,
        "base_factories": list(base_factories.keys()),
        "meta_model": meta_model,
        "classes": classes
    },
    os.path.join(MODEL_DIR, "failure_oof_stacking.pkl")
)

# -------------------------------------------------------------------
# 11. BATTERY SOH
# -------------------------------------------------------------------
print("\n" + "=" * 70)
print("BATTERY SOH")
print("=" * 70)

soh_results = []

soh_results.append(train_regression(
    TARGET_SOH,
    soh_features,
    "RandomForest",
    RandomForestRegressor(**rf_reg_params)
))

soh_results.append(train_regression(
    TARGET_SOH,
    soh_features,
    "XGBoost",
    XGBRegressor(**xgb_reg_params)
))

# -------------------------------------------------------------------
# 12. ANOMALY DETECTION
# -------------------------------------------------------------------
print("\n" + "=" * 70)
print("ANOMALY DETECTION")
print("=" * 70)

anomaly_features = common_current_state.copy()

pre_anomaly = make_preprocessor(train_df[anomaly_features])
X_train_anomaly = pre_anomaly.fit_transform(train_df[anomaly_features])
X_test_anomaly = pre_anomaly.transform(test_df[anomaly_features])

iso = IsolationForest(
    n_estimators=300,
    contamination=0.05,
    random_state=RANDOM_STATE,
    n_jobs=-1
)

iso.fit(X_train_anomaly)

anomaly_pred = iso.predict(X_test_anomaly)
anomaly_rate = np.mean(anomaly_pred == -1)

print(f"Test anomaly rate: {anomaly_rate * 100:.2f}%")

joblib.dump(
    {"preprocessor": pre_anomaly, "model": iso},
    os.path.join(MODEL_DIR, "isolation_forest.pkl")
)

# -------------------------------------------------------------------
# 13. ESTIMATED RANGE
# -------------------------------------------------------------------
print("\n" + "=" * 70)
print("ESTIMATED RANGE")
print("=" * 70)

range_results = []

range_results.append(train_regression(
    TARGET_RANGE,
    range_features,
    "RandomForest",
    RandomForestRegressor(**rf_reg_params)
))

range_results.append(train_regression(
    TARGET_RANGE,
    range_features,
    "XGBoost",
    XGBRegressor(**xgb_reg_params)
))

# -------------------------------------------------------------------
# 14. SAVE RESULTS
# -------------------------------------------------------------------
health_df = pd.DataFrame(health_results)
failure_df = pd.DataFrame(failure_results)
soh_df = pd.DataFrame(soh_results)
range_df = pd.DataFrame(range_results)

health_df.to_csv(os.path.join(RESULT_DIR, "health_results.csv"), index=False)
failure_df.to_csv(os.path.join(RESULT_DIR, "failure_results.csv"), index=False)
soh_df.to_csv(os.path.join(RESULT_DIR, "soh_results.csv"), index=False)
range_df.to_csv(os.path.join(RESULT_DIR, "range_results.csv"), index=False)

summary = {
    "health": health_results,
    "failure": failure_results,
    "soh": soh_results,
    "range": range_results,
    "anomaly_test_rate": float(anomaly_rate)
}

with open(os.path.join(RESULT_DIR, "final_summary.json"), "w") as f:
    json.dump(summary, f, indent=4)

print("\n" + "=" * 70)
print("FINAL MODEL SUMMARY")
print("=" * 70)

print("\nVEHICLE HEALTH")
print(health_df.to_string(index=False))

print("\nFAILURE RISK")
print(failure_df.to_string(index=False))

print("\nBATTERY SOH")
print(soh_df.to_string(index=False))

print("\nESTIMATED RANGE")
print(range_df.to_string(index=False))

print("\n" + "=" * 70)
print("TRAINING COMPLETED")
print("=" * 70)
print(f"Models : {MODEL_DIR}")
print(f"Results: {RESULT_DIR}")
