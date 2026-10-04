# ============================================================
# EV GUARDIAN - REALISTIC ML TRAINING PIPELINE
# ============================================================
#
# Project:
# EV Guardian - AI-Powered Digital Twin for Predictive
# Health Monitoring and Failure Prevention in EVs
#
# Models:
# 1. Vehicle Health Score      -> Random Forest + XGBoost
# 2. Failure Risk              -> RF + XGBoost + LightGBM + Stacking
# 3. Battery SOH               -> RF + XGBoost
# 4. Anomaly Detection         -> Isolation Forest
# 5. Estimated Range           -> RF + XGBoost
#
# Important:
# - Chronological train/validation/test split
# - Target leakage audit
# - Explicit feature selection
# - Future/output variables excluded
# - Regularized models
# - Results saved to CSV
# ============================================================

import os
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

from sklearn.ensemble import (
    RandomForestRegressor,
    RandomForestClassifier,
    IsolationForest
)

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)

from sklearn.linear_model import LogisticRegression

from xgboost import (
    XGBRegressor,
    XGBClassifier
)

try:
    from lightgbm import LGBMClassifier
    LIGHTGBM_AVAILABLE = True
except ImportError:
    LIGHTGBM_AVAILABLE = False


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "ev_guardian_middle_ground.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models_realistic"
)

RESULT_DIR = os.path.join(
    BASE_DIR,
    "results_realistic"
)

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)


# ============================================================
# 2. LOAD DATA
# ============================================================

print("=" * 70)
print("EV GUARDIAN - REALISTIC ML TRAINING")
print("=" * 70)

print("\nLoading dataset...")

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(
        f"\nDataset not found:\n{DATA_PATH}\n\n"
        "Put ev_data_cleaned.csv in the same folder as this script."
    )

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# ============================================================
# 3. TIMESTAMP PROCESSING
# ============================================================

if "Timestamp" in df.columns:

    df["Timestamp"] = pd.to_datetime(
        df["Timestamp"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["Timestamp"]
    )

    df = df.sort_values(
        "Timestamp"
    ).reset_index(drop=True)

    # Time features
    df["Timestamp_Year"] = df["Timestamp"].dt.year
    df["Timestamp_Day"] = df["Timestamp"].dt.day
    df["Timestamp_DayOfYear"] = df["Timestamp"].dt.dayofyear

    print("Timestamp processed successfully.")

else:

    print("WARNING: Timestamp column not found.")


# ============================================================
# 4. BASIC DATA INFORMATION
# ============================================================

print("\n" + "=" * 70)
print("DATASET INFORMATION")
print("=" * 70)

print("\nRows:", len(df))
print("Columns:", len(df.columns))

print("\nMissing values:")

missing = df.isnull().sum()

missing = missing[
    missing > 0
].sort_values(
    ascending=False
)

if len(missing) == 0:
    print("No missing values.")

else:
    print(missing)


# ============================================================
# 5. TARGET COLUMNS
# ============================================================

TARGET_HEALTH = "Vehicle_Health_Score"
TARGET_FAILURE = "Failure_Risk"
TARGET_SOH = "Battery_SOH"
TARGET_RANGE = "Estimated_Range"


# ============================================================
# 6. TARGET LEAKAGE AUDIT
# ============================================================

print("\n" + "=" * 70)
print("1. TARGET LEAKAGE AUDIT")
print("=" * 70)


# ------------------------------------------------------------
# 6.1 Numeric correlation audit
# ------------------------------------------------------------

numeric_targets = [
    TARGET_HEALTH,
    TARGET_SOH,
    TARGET_RANGE
]

correlation_results = []


for target in numeric_targets:

    if target not in df.columns:
        continue

    print("\nAnalyzing target:", target)

    numeric_df = df.select_dtypes(
        include=np.number
    )

    correlations = (
        numeric_df.corr()[target]
        .drop(target)
        .abs()
        .sort_values(
            ascending=False
        )
    )

    print(
        correlations.head(15)
    )

    for feature, corr in correlations.items():

        correlation_results.append({
            "Target": target,
            "Feature": feature,
            "Absolute_Correlation": corr
        })


correlation_df = pd.DataFrame(
    correlation_results
)

correlation_path = os.path.join(
    RESULT_DIR,
    "target_correlation_audit.csv"
)

correlation_df.to_csv(
    correlation_path,
    index=False
)

print(
    "\nSaved:",
    correlation_path
)


# ------------------------------------------------------------
# 6.2 Failure Risk categorical audit
# ------------------------------------------------------------

failure_analysis = []

if TARGET_FAILURE in df.columns:

    print(
        "\nAnalyzing categorical target:",
        TARGET_FAILURE
    )

    print("\nFailure Risk distribution:")

    print(
        df[TARGET_FAILURE]
        .value_counts()
    )

    numeric_features = df.select_dtypes(
        include=np.number
    ).columns.tolist()

    numeric_features = [
        col
        for col in numeric_features
        if col != TARGET_FAILURE
    ]

    for feature in numeric_features:

        try:

            grouped = (
                df.groupby(
                    TARGET_FAILURE
                )[feature]
                .mean()
            )

            row = {
                "Feature": feature
            }

            for risk_class, value in grouped.items():

                row[
                    f"Mean_{risk_class}"
                ] = value

            failure_analysis.append(
                row
            )

        except Exception:
            pass


failure_analysis_df = pd.DataFrame(
    failure_analysis
)

failure_analysis_path = os.path.join(
    RESULT_DIR,
    "failure_risk_feature_analysis.csv"
)

failure_analysis_df.to_csv(
    failure_analysis_path,
    index=False
)

print(
    "Saved:",
    failure_analysis_path
)


# ============================================================
# 7. FEATURE GROUPS
# ============================================================

print("\n" + "=" * 70)
print("2. DEFINING LEAKAGE-SAFE FEATURES")
print("=" * 70)


# ------------------------------------------------------------
# Common current-state vehicle features
# ------------------------------------------------------------

common_features = [

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
    "Motor_Power_Proxy",

    "Temp_Diff_Motor_Ambient",
    "Temp_Diff_Battery_Ambient",

    "Km_per_Year",
    "Aggressive_Events"
]


# ------------------------------------------------------------
# Variables that represent future/model outputs
# ------------------------------------------------------------

OUTPUT_VARIABLES = [

    "Failure_Risk",
    "Predicted_Failure",
    "Vehicle_Health_Score",
    "Remaining_Useful_Life_Days",
    "Preventive_Measure",

    "Estimated_Range",

    "Battery_SOH",

    "Battery_Current_Capacity_Wh",
    "Capacity_Loss_Wh"
]


# ------------------------------------------------------------
# Filter features that actually exist
# ------------------------------------------------------------

def existing_features(feature_list):

    return [
        col
        for col in feature_list
        if col in df.columns
    ]


# ============================================================
# 8. HEALTH SCORE FEATURES
# ============================================================

health_features = existing_features(
    common_features
)

# Explicitly remove suspicious features
health_features = [
    col
    for col in health_features
    if col not in [
        "Battery_SOH",
        "Battery_Current_Capacity_Wh",
        "Capacity_Loss_Wh",
        "Estimated_Range"
    ]
]


# ============================================================
# 9. FAILURE RISK FEATURES
# ============================================================

failure_features = existing_features(
    common_features
)

failure_features = [
    col
    for col in failure_features
    if col not in [
        "Battery_SOH",
        "Battery_Current_Capacity_Wh",
        "Capacity_Loss_Wh",
        "Estimated_Range"
    ]
]


# ============================================================
# 10. SOH FEATURES
# ============================================================

soh_features = existing_features(
    common_features
)

# SOH prediction should not directly use
# current capacity or capacity-loss variables
soh_features = [
    col
    for col in soh_features
    if col not in [
        "Battery_Current_Capacity_Wh",
        "Capacity_Loss_Wh",
        "Estimated_Range"
    ]
]


# ============================================================
# 11. RANGE FEATURES
# ============================================================

range_features = existing_features(
    common_features
)

# Avoid direct capacity-derived variables
range_features = [
    col
    for col in range_features
    if col not in [
        "Battery_Current_Capacity_Wh",
        "Capacity_Loss_Wh"
    ]
]


# ============================================================
# 12. DISPLAY FEATURES
# ============================================================

print("\nHealth features:", len(health_features))
print("Failure features:", len(failure_features))
print("SOH features:", len(soh_features))
print("Range features:", len(range_features))


# ============================================================
# 13. PREPROCESSOR FUNCTION
# ============================================================

def create_preprocessor(X):

    numeric_features = X.select_dtypes(
        include=np.number
    ).columns.tolist()

    categorical_features = X.select_dtypes(
        exclude=np.number
    ).columns.tolist()

    numeric_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(
                    strategy="median"
                )
            )
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(
                    strategy="most_frequent"
                )
            ),

            (
                "onehot",
                OneHotEncoder(
                    handle_unknown="ignore"
                )
            )
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[

            (
                "num",
                numeric_pipeline,
                numeric_features
            ),

            (
                "cat",
                categorical_pipeline,
                categorical_features
            )
        ]
    )

    return preprocessor


# ============================================================
# 14. CHRONOLOGICAL SPLIT
# ============================================================

def chronological_split(
    X,
    y,
    train_ratio=0.70,
    validation_ratio=0.15
):

    n = len(X)

    train_end = int(
        n * train_ratio
    )

    validation_end = int(
        n * (
            train_ratio +
            validation_ratio
        )
    )

    X_train = X.iloc[
        :train_end
    ]

    X_val = X.iloc[
        train_end:validation_end
    ]

    X_test = X.iloc[
        validation_end:
    ]

    y_train = y.iloc[
        :train_end
    ]

    y_val = y.iloc[
        train_end:validation_end
    ]

    y_test = y.iloc[
        validation_end:
    ]

    return (
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test
    )


# ============================================================
# 15. REGRESSION EVALUATION
# ============================================================

def evaluate_regression(
    model,
    X_test,
    y_test,
    model_name,
    target_name
):

    predictions = model.predict(
        X_test
    )

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions
        )
    )

    r2 = r2_score(
        y_test,
        predictions
    )

    print(
        f"\n{model_name} - {target_name}"
    )

    print(
        f"MAE  : {mae:.4f}"
    )

    print(
        f"RMSE : {rmse:.4f}"
    )

    print(
        f"R²   : {r2:.4f}"
    )

    result = pd.DataFrame({

        "Actual": y_test.values,

        "Predicted": predictions

    })

    result.to_csv(
        os.path.join(
            RESULT_DIR,
            f"{target_name}_{model_name}_predictions.csv"
        ),
        index=False
    )

    return {
        "Target": target_name,
        "Model": model_name,
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2
    }


# ============================================================
# 16. CLASSIFICATION EVALUATION
# ============================================================

def evaluate_classification(
    model,
    X_test,
    y_test,
    model_name
):

    predictions = model.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    precision = precision_score(
        y_test,
        predictions,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        y_test,
        predictions,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        predictions,
        average="weighted",
        zero_division=0
    )

    print(
        f"\n{model_name} - Failure Risk"
    )

    print(
        f"Accuracy  : {accuracy:.4f}"
    )

    print(
        f"Precision : {precision:.4f}"
    )

    print(
        f"Recall    : {recall:.4f}"
    )

    print(
        f"F1 Score  : {f1:.4f}"
    )

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0
        )
    )

    print("Confusion Matrix:")

    print(
        confusion_matrix(
            y_test,
            predictions
        )
    )

    # Probability-based AUC
    auc = np.nan

    if hasattr(
        model,
        "predict_proba"
    ):

        try:

            probabilities = model.predict_proba(
                X_test
            )

            if len(
                np.unique(y_test)
            ) > 2:

                auc = roc_auc_score(
                    y_test,
                    probabilities,
                    multi_class="ovr",
                    average="weighted"
                )

        except Exception:
            pass

    return {
        "Model": model_name,
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1": f1,
        "ROC_AUC": auc
    }


# ============================================================
# 17. VEHICLE HEALTH SCORE
# ============================================================

print("\n" + "=" * 70)
print("3. VEHICLE HEALTH SCORE")
print("=" * 70)

health_results = []

if TARGET_HEALTH in df.columns:

    X = df[
        health_features
    ].copy()

    y = df[
        TARGET_HEALTH
    ].copy()

    (
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test
    ) = chronological_split(
        X,
        y
    )

    print(
        "\nTrain:",
        X_train.shape
    )

    print(
        "Validation:",
        X_val.shape
    )

    print(
        "Test:",
        X_test.shape
    )

    preprocessor = create_preprocessor(
        X_train
    )

    # --------------------------------------------------------
    # Random Forest
    # --------------------------------------------------------

    health_rf = Pipeline(
        steps=[

            (
                "preprocessor",
                preprocessor
            ),

            (
                "model",
                RandomForestRegressor(

                    n_estimators=300,

                    max_depth=10,

                    min_samples_split=10,

                    min_samples_leaf=5,

                    max_features=0.7,

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )

    print(
        "\nTraining Health Random Forest..."
    )

    health_rf.fit(
        X_train,
        y_train
    )

    result = evaluate_regression(
        health_rf,
        X_test,
        y_test,
        "RandomForest",
        "Vehicle_Health_Score"
    )

    health_results.append(
        result
    )

    joblib.dump(
        health_rf,
        os.path.join(
            MODEL_DIR,
            "health_random_forest.pkl"
        )
    )


    # --------------------------------------------------------
    # XGBoost
    # --------------------------------------------------------

    health_xgb = Pipeline(
        steps=[

            (
                "preprocessor",
                create_preprocessor(
                    X_train
                )
            ),

            (
                "model",
                XGBRegressor(

                    n_estimators=300,

                    learning_rate=0.04,

                    max_depth=4,

                    min_child_weight=8,

                    subsample=0.75,

                    colsample_bytree=0.75,

                    reg_alpha=0.1,

                    reg_lambda=2,

                    objective="reg:squarederror",

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )

    print(
        "\nTraining Health XGBoost..."
    )

    health_xgb.fit(
        X_train,
        y_train
    )

    result = evaluate_regression(
        health_xgb,
        X_test,
        y_test,
        "XGBoost",
        "Vehicle_Health_Score"
    )

    health_results.append(
        result
    )

    joblib.dump(
        health_xgb,
        os.path.join(
            MODEL_DIR,
            "health_xgboost.pkl"
        )
    )


# ============================================================
# 18. FAILURE RISK
# ============================================================

print("\n" + "=" * 70)
print("4. FAILURE RISK PREDICTION")
print("=" * 70)

failure_results = []

if TARGET_FAILURE in df.columns:

    X = df[
        failure_features
    ].copy()

    y = df[
        TARGET_FAILURE
    ].copy()

    (
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test
    ) = chronological_split(
        X,
        y
    )

    print(
        "\nFailure classes:"
    )

    print(
        y_train.value_counts()
    )


    # --------------------------------------------------------
    # Encode labels
    # --------------------------------------------------------

    classes = sorted(
        y_train.unique()
    )

    label_to_int = {
        label: index
        for index, label
        in enumerate(classes)
    }

    int_to_label = {
        index: label
        for label, index
        in label_to_int.items()
    }

    y_train_encoded = y_train.map(
        label_to_int
    )

    y_test_encoded = y_test.map(
        label_to_int
    )


    # --------------------------------------------------------
    # Random Forest
    # --------------------------------------------------------

    failure_rf = Pipeline(
        steps=[

            (
                "preprocessor",
                create_preprocessor(
                    X_train
                )
            ),

            (
                "model",
                RandomForestClassifier(

                    n_estimators=300,

                    max_depth=10,

                    min_samples_split=10,

                    min_samples_leaf=5,

                    max_features=0.7,

                    class_weight="balanced",

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )

    print(
        "\nTraining Failure Random Forest..."
    )

    failure_rf.fit(
        X_train,
        y_train_encoded
    )

    result = evaluate_classification(
        failure_rf,
        X_test,
        y_test_encoded,
        "RandomForest"
    )

    failure_results.append(
        result
    )

    joblib.dump(
        failure_rf,
        os.path.join(
            MODEL_DIR,
            "failure_random_forest.pkl"
        )
    )


    # --------------------------------------------------------
    # XGBoost
    # --------------------------------------------------------

    failure_xgb = Pipeline(
        steps=[

            (
                "preprocessor",
                create_preprocessor(
                    X_train
                )
            ),

            (
                "model",
                XGBClassifier(

                    n_estimators=300,

                    learning_rate=0.04,

                    max_depth=4,

                    min_child_weight=8,

                    subsample=0.75,

                    colsample_bytree=0.75,

                    reg_alpha=0.1,

                    reg_lambda=2,

                    objective="multi:softprob",

                    num_class=len(classes),

                    eval_metric="mlogloss",

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )

    print(
        "\nTraining Failure XGBoost..."
    )

    failure_xgb.fit(
        X_train,
        y_train_encoded
    )

    result = evaluate_classification(
        failure_xgb,
        X_test,
        y_test_encoded,
        "XGBoost"
    )

    failure_results.append(
        result
    )

    joblib.dump(
        failure_xgb,
        os.path.join(
            MODEL_DIR,
            "failure_xgboost.pkl"
        )
    )


    # --------------------------------------------------------
    # LightGBM
    # --------------------------------------------------------

    failure_lgbm = None

    if LIGHTGBM_AVAILABLE:

        failure_lgbm = Pipeline(
            steps=[

                (
                    "preprocessor",
                    create_preprocessor(
                        X_train
                    )
                ),

                (
                    "model",
                    LGBMClassifier(

                        n_estimators=300,

                        learning_rate=0.04,

                        max_depth=6,

                        num_leaves=20,

                        min_child_samples=30,

                        subsample=0.8,

                        colsample_bytree=0.8,

                        reg_alpha=0.1,

                        reg_lambda=2,

                        class_weight="balanced",

                        random_state=42,

                        verbosity=-1,

                        n_jobs=-1
                    )
                )
            ]
        )

        print(
            "\nTraining Failure LightGBM..."
        )

        failure_lgbm.fit(
            X_train,
            y_train_encoded
        )

        result = evaluate_classification(
            failure_lgbm,
            X_test,
            y_test_encoded,
            "LightGBM"
        )

        failure_results.append(
            result
        )

        joblib.dump(
            failure_lgbm,
            os.path.join(
                MODEL_DIR,
                "failure_lightgbm.pkl"
            )
        )

    else:

        print(
            "\nLightGBM not installed."
        )

        print(
            "Install using:"
        )

        print(
            "pip install lightgbm"
        )


# ============================================================
# 19. STACKING ENSEMBLE
# ============================================================

if (
    "failure_rf" in locals()
    and "failure_xgb" in locals()
):

    print("\n" + "=" * 70)
    print("5. FAILURE RISK STACKING ENSEMBLE")
    print("=" * 70)

    # Transform data
    rf_preprocessor = failure_rf.named_steps[
        "preprocessor"
    ]

    X_train_transformed = (
        rf_preprocessor.transform(
            X_train
        )
    )

    X_test_transformed = (
        rf_preprocessor.transform(
            X_test
        )
    )

    # --------------------------------------------------------
    # Base models
    # --------------------------------------------------------

    rf_model = RandomForestClassifier(

        n_estimators=250,

        max_depth=8,

        min_samples_leaf=5,

        min_samples_split=10,

        max_features=0.7,

        class_weight="balanced",

        random_state=42,

        n_jobs=-1
    )

    xgb_model = XGBClassifier(

        n_estimators=250,

        learning_rate=0.04,

        max_depth=4,

        min_child_weight=8,

        subsample=0.75,

        colsample_bytree=0.75,

        reg_alpha=0.1,

        reg_lambda=2,

        objective="multi:softprob",

        num_class=len(classes),

        eval_metric="mlogloss",

        random_state=42,

        n_jobs=-1
    )


    print(
        "\nTraining stacking base models..."
    )

    rf_model.fit(
        X_train_transformed,
        y_train_encoded
    )

    xgb_model.fit(
        X_train_transformed,
        y_train_encoded
    )


    # --------------------------------------------------------
    # Base predictions
    # --------------------------------------------------------

    rf_train_prob = rf_model.predict_proba(
        X_train_transformed
    )

    xgb_train_prob = xgb_model.predict_proba(
        X_train_transformed
    )

    rf_test_prob = rf_model.predict_proba(
        X_test_transformed
    )

    xgb_test_prob = xgb_model.predict_proba(
        X_test_transformed
    )


    # --------------------------------------------------------
    # Meta features
    # --------------------------------------------------------

    meta_train = np.hstack(
        [
            rf_train_prob,
            xgb_train_prob
        ]
    )

    meta_test = np.hstack(
        [
            rf_test_prob,
            xgb_test_prob
        ]
    )


    # --------------------------------------------------------
    # Logistic Regression meta learner
    # --------------------------------------------------------

    meta_model = LogisticRegression(
        max_iter=1000
    )

    meta_model.fit(
        meta_train,
        y_train_encoded
    )

    stacking_predictions = (
        meta_model.predict(
            meta_test
        )
    )


    accuracy = accuracy_score(
        y_test_encoded,
        stacking_predictions
    )

    precision = precision_score(
        y_test_encoded,
        stacking_predictions,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        y_test_encoded,
        stacking_predictions,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        y_test_encoded,
        stacking_predictions,
        average="weighted",
        zero_division=0
    )


    print(
        "\nSTACKING RESULTS"
    )

    print(
        f"Accuracy  : {accuracy:.4f}"
    )

    print(
        f"Precision : {precision:.4f}"
    )

    print(
        f"Recall    : {recall:.4f}"
    )

    print(
        f"F1 Score  : {f1:.4f}"
    )


    print(
        "\nClassification Report:"
    )

    print(
        classification_report(
            y_test_encoded,
            stacking_predictions,
            zero_division=0
        )
    )


    failure_results.append({

        "Model": "Stacking",

        "Accuracy": accuracy,

        "Precision": precision,

        "Recall": recall,

        "F1": f1,

        "ROC_AUC": np.nan
    })


    joblib.dump(
        {
            "preprocessor": rf_preprocessor,
            "rf_model": rf_model,
            "xgb_model": xgb_model,
            "meta_model": meta_model,
            "label_to_int": label_to_int,
            "int_to_label": int_to_label
        },
        os.path.join(
            MODEL_DIR,
            "failure_stacking.pkl"
        )
    )


# ============================================================
# 20. BATTERY SOH
# ============================================================

print("\n" + "=" * 70)
print("6. BATTERY SOH PREDICTION")
print("=" * 70)

soh_results = []

if TARGET_SOH in df.columns:

    X = df[
        soh_features
    ].copy()

    y = df[
        TARGET_SOH
    ].copy()

    (
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test
    ) = chronological_split(
        X,
        y
    )


    # --------------------------------------------------------
    # Random Forest
    # --------------------------------------------------------

    soh_rf = Pipeline(
        steps=[

            (
                "preprocessor",
                create_preprocessor(
                    X_train
                )
            ),

            (
                "model",
                RandomForestRegressor(

                    n_estimators=300,

                    max_depth=10,

                    min_samples_split=10,

                    min_samples_leaf=5,

                    max_features=0.7,

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )


    print(
        "\nTraining SOH Random Forest..."
    )

    soh_rf.fit(
        X_train,
        y_train
    )

    result = evaluate_regression(
        soh_rf,
        X_test,
        y_test,
        "RandomForest",
        "Battery_SOH"
    )

    soh_results.append(
        result
    )

    joblib.dump(
        soh_rf,
        os.path.join(
            MODEL_DIR,
            "soh_random_forest.pkl"
        )
    )


    # --------------------------------------------------------
    # XGBoost
    # --------------------------------------------------------

    soh_xgb = Pipeline(
        steps=[

            (
                "preprocessor",
                create_preprocessor(
                    X_train
                )
            ),

            (
                "model",
                XGBRegressor(

                    n_estimators=300,

                    learning_rate=0.04,

                    max_depth=4,

                    min_child_weight=8,

                    subsample=0.75,

                    colsample_bytree=0.75,

                    reg_alpha=0.1,

                    reg_lambda=2,

                    objective="reg:squarederror",

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )


    print(
        "\nTraining SOH XGBoost..."
    )

    soh_xgb.fit(
        X_train,
        y_train
    )

    result = evaluate_regression(
        soh_xgb,
        X_test,
        y_test,
        "XGBoost",
        "Battery_SOH"
    )

    soh_results.append(
        result
    )

    joblib.dump(
        soh_xgb,
        os.path.join(
            MODEL_DIR,
            "soh_xgboost.pkl"
        )
    )


# ============================================================
# 21. ANOMALY DETECTION
# ============================================================

print("\n" + "=" * 70)
print("7. ANOMALY DETECTION")
print("=" * 70)


anomaly_features = existing_features(
    common_features
)


if len(anomaly_features) > 0:

    X_anomaly = df[
        anomaly_features
    ].copy()

    preprocessor_anomaly = create_preprocessor(
        X_anomaly
    )

    # First 70% only for fitting
    split_point = int(
        len(X_anomaly) * 0.70
    )

    X_anomaly_train = (
        X_anomaly.iloc[
            :split_point
        ]
    )

    X_anomaly_test = (
        X_anomaly.iloc[
            split_point:
        ]
    )

    preprocessor_anomaly.fit(
        X_anomaly_train
    )

    X_train_anomaly_transformed = (
        preprocessor_anomaly.transform(
            X_anomaly_train
        )
    )

    X_test_anomaly_transformed = (
        preprocessor_anomaly.transform(
            X_anomaly_test
        )
    )


    # --------------------------------------------------------
    # Isolation Forest
    # --------------------------------------------------------

    isolation_forest = IsolationForest(

        n_estimators=300,

        contamination=0.05,

        max_samples="auto",

        max_features=0.8,

        random_state=42,

        n_jobs=-1
    )


    print(
        "\nTraining Isolation Forest..."
    )

    isolation_forest.fit(
        X_train_anomaly_transformed
    )


    anomaly_predictions = (
        isolation_forest.predict(
            X_test_anomaly_transformed
        )
    )


    anomaly_labels = np.where(
        anomaly_predictions == -1,
        "Anomaly",
        "Normal"
    )


    anomaly_rate = (
        np.mean(
            anomaly_labels == "Anomaly"
        )
        * 100
    )


    print(
        f"\nTest anomaly rate: "
        f"{anomaly_rate:.2f}%"
    )


    anomaly_scores = (
        isolation_forest.decision_function(
            X_test_anomaly_transformed
        )
    )


    anomaly_result = pd.DataFrame({

        "Timestamp": df[
            "Timestamp"
        ].iloc[
            split_point:
        ].values
        if "Timestamp" in df.columns
        else np.arange(
            len(anomaly_labels)
        ),

        "Anomaly_Label":
            anomaly_labels,

        "Anomaly_Score":
            anomaly_scores

    })


    anomaly_result.to_csv(
        os.path.join(
            RESULT_DIR,
            "anomaly_detection_results.csv"
        ),
        index=False
    )


    joblib.dump(
        {
            "preprocessor":
                preprocessor_anomaly,

            "model":
                isolation_forest
        },
        os.path.join(
            MODEL_DIR,
            "isolation_forest.pkl"
        )
    )


# ============================================================
# 22. ESTIMATED RANGE
# ============================================================

print("\n" + "=" * 70)
print("8. ESTIMATED RANGE PREDICTION")
print("=" * 70)

range_results = []

if TARGET_RANGE in df.columns:

    X = df[
        range_features
    ].copy()

    y = df[
        TARGET_RANGE
    ].copy()

    (
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test
    ) = chronological_split(
        X,
        y
    )


    # --------------------------------------------------------
    # Random Forest
    # --------------------------------------------------------

    range_rf = Pipeline(
        steps=[

            (
                "preprocessor",
                create_preprocessor(
                    X_train
                )
            ),

            (
                "model",
                RandomForestRegressor(

                    n_estimators=300,

                    max_depth=10,

                    min_samples_split=10,

                    min_samples_leaf=5,

                    max_features=0.7,

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )


    print(
        "\nTraining Range Random Forest..."
    )

    range_rf.fit(
        X_train,
        y_train
    )

    result = evaluate_regression(
        range_rf,
        X_test,
        y_test,
        "RandomForest",
        "Estimated_Range"
    )

    range_results.append(
        result
    )

    joblib.dump(
        range_rf,
        os.path.join(
            MODEL_DIR,
            "range_random_forest.pkl"
        )
    )


    # --------------------------------------------------------
    # XGBoost
    # --------------------------------------------------------

    range_xgb = Pipeline(
        steps=[

            (
                "preprocessor",
                create_preprocessor(
                    X_train
                )
            ),

            (
                "model",
                XGBRegressor(

                    n_estimators=300,

                    learning_rate=0.04,

                    max_depth=4,

                    min_child_weight=8,

                    subsample=0.75,

                    colsample_bytree=0.75,

                    reg_alpha=0.1,

                    reg_lambda=2,

                    objective="reg:squarederror",

                    random_state=42,

                    n_jobs=-1
                )
            )
        ]
    )


    print(
        "\nTraining Range XGBoost..."
    )

    range_xgb.fit(
        X_train,
        y_train
    )

    result = evaluate_regression(
        range_xgb,
        X_test,
        y_test,
        "XGBoost",
        "Estimated_Range"
    )

    range_results.append(
        result
    )

    joblib.dump(
        range_xgb,
        os.path.join(
            MODEL_DIR,
            "range_xgboost.pkl"
        )
    )


# ============================================================
# 23. SAVE RESULT TABLES
# ============================================================

print("\n" + "=" * 70)
print("9. SAVING RESULTS")
print("=" * 70)


# ------------------------------------------------------------
# Health
# ------------------------------------------------------------

if len(health_results) > 0:

    health_results_df = pd.DataFrame(
        health_results
    )

    health_results_df.to_csv(
        os.path.join(
            RESULT_DIR,
            "health_model_results.csv"
        ),
        index=False
    )


# ------------------------------------------------------------
# Failure
# ------------------------------------------------------------

if len(failure_results) > 0:

    failure_results_df = pd.DataFrame(
        failure_results
    )

    failure_results_df.to_csv(
        os.path.join(
            RESULT_DIR,
            "failure_model_results.csv"
        ),
        index=False
    )


# ------------------------------------------------------------
# SOH
# ------------------------------------------------------------

if len(soh_results) > 0:

    soh_results_df = pd.DataFrame(
        soh_results
    )

    soh_results_df.to_csv(
        os.path.join(
            RESULT_DIR,
            "soh_model_results.csv"
        ),
        index=False
    )


# ------------------------------------------------------------
# Range
# ------------------------------------------------------------

if len(range_results) > 0:

    range_results_df = pd.DataFrame(
        range_results
    )

    range_results_df.to_csv(
        os.path.join(
            RESULT_DIR,
            "range_model_results.csv"
        ),
        index=False
    )


# ============================================================
# 24. FINAL SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("FINAL MODEL SUMMARY")
print("=" * 70)


if len(health_results) > 0:

    print(
        "\nVEHICLE HEALTH SCORE"
    )

    print(
        pd.DataFrame(
            health_results
        ).to_string(
            index=False
        )
    )


if len(failure_results) > 0:

    print(
        "\nFAILURE RISK"
    )

    print(
        pd.DataFrame(
            failure_results
        ).to_string(
            index=False
        )
    )


if len(soh_results) > 0:

    print(
        "\nBATTERY SOH"
    )

    print(
        pd.DataFrame(
            soh_results
        ).to_string(
            index=False
        )
    )


if len(range_results) > 0:

    print(
        "\nESTIMATED RANGE"
    )

    print(
        pd.DataFrame(
            range_results
        ).to_string(
            index=False
        )
    )


# ============================================================
# 25. COMPLETION
# ============================================================

print("\n" + "=" * 70)
print("TRAINING COMPLETED")
print("=" * 70)

print(
    "\nModels saved in:"
)

print(
    MODEL_DIR
)

print(
    "\nResults saved in:"
)

print(
    RESULT_DIR
)

print(
    "\nImportant:"
)

print(
    "If the metrics are still extremely high (e.g. 99%+),"
)

print(
    "do NOT artificially reduce them."
)

print(
    "Instead inspect the synthetic target-generation rules"
)

print(
    "and remove features that directly encode the target."
)

print(
    "\nDone."
)