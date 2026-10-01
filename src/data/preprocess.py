"""
preprocess.py - Preprocessing pipeline for the EV dataset

Usage:
    python preprocess.py
    python preprocess.py --input "C:\\path\\to\\ev_data.csv"
    python preprocess.py --target Failure_Risk

Requirements:
    pip install pandas numpy scikit-learn joblib

Outputs (in a 'processed' folder next to this script):
    ev_data_cleaned.csv   - cleaned + feature-engineered data (readable, unscaled)
    X_train.csv, X_test.csv, y_train.csv, y_test.csv - model-ready (encoded + scaled)
    scaler.joblib, label_encoder.joblib, feature_columns.json - reuse at prediction time
"""

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

# ----------------------------------------------------------------------------
# CONFIG
# ----------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent      # folder containing this script
OUTPUT_DIR = BASE_DIR / "processed"

DEFAULT_INPUT = "ev_data.csv"                   # can be a name or a full path
DEFAULT_TARGET = "Predicted_Failure"            # or "Failure_Risk", "Remaining_Useful_Life_Days"
TEST_SIZE = 0.2
RANDOM_STATE = 42

# Columns that identify a row but carry no predictive signal
ID_COLS = ["Vehicle_ID"]

# Columns tied directly to the failure label -> data leakage.
# Whichever of these is NOT your target gets dropped automatically.
LEAKAGE_COLS = [
    "Predicted_Failure",
    "Failure_Risk",
    "Preventive_Measure",
    "Vehicle_Health_Score",
    "Remaining_Useful_Life_Days",
]

NOMINAL_COLS = [   # no natural order -> one-hot encode
    "Vehicle_Type", "Charging_Status", "Charging_Type",
    "Driving_Style", "Road_Type",
]
ORDINAL_MAPS = {   # natural order -> integer encode
    "Traffic_Level": {"Low": 0, "Medium": 1, "High": 2},
    "Failure_Risk": {"Low": 0, "Medium": 1, "High": 2},
}


# ----------------------------------------------------------------------------
# STEPS
# ----------------------------------------------------------------------------
def resolve_input(path_str: str) -> Path:
    """Find the CSV even if the script is run from a different folder."""
    p = Path(path_str)
    for candidate in (p, BASE_DIR / p, Path.cwd() / p):
        if candidate.is_file():
            return candidate

    searched = []
    for folder in [BASE_DIR, *list(BASE_DIR.parents)[:3]]:
        for sub in (folder, folder / "data", folder / "raw"):
            searched.append(str(sub))
            matches = sorted(sub.glob("*ev_data*.csv"))
            if matches:
                print(f"[load] '{path_str}' not found, using: {matches[0]}")
                return matches[0]

    raise FileNotFoundError(
        f"Could not find '{path_str}'.\n"
        f"Searched: {searched}\n"
        "Fix: run  python preprocess.py --input \"full\\path\\to\\your_file.csv\""
    )


def load_data(path_str: str) -> pd.DataFrame:
    path = resolve_input(path_str)
    df = pd.read_csv(path)
    print(f"[load] {path}: {df.shape[0]} rows x {df.shape[1]} columns")
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # tidy text columns
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].astype(str).str.strip()

    # duplicates
    n_dup = df.duplicated().sum()
    df = df.drop_duplicates().reset_index(drop=True)
    print(f"[clean] duplicate rows removed: {n_dup}")

    # missing values: median for numeric, mode for categorical
    n_missing = int(df.isna().sum().sum())
    for col in df.columns:
        if df[col].isna().any():
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna(df[col].mode()[0])
    print(f"[clean] missing values filled: {n_missing}")

    # timestamp
    df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
    df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp").reset_index(drop=True)

    # physically impossible values
    bounds = {
        "Battery_SOC": (0, 100),
        "Battery_SOH": (0, 100),
        "Humidity": (0, 100),
        "Motor_Efficiency": (0, 100),
        "Driving_Score": (0, 100),
    }
    for col, (lo, hi) in bounds.items():
        bad = ((df[col] < lo) | (df[col] > hi)).sum()
        if bad:
            print(f"[clean] clipping {bad} out-of-range values in {col}")
            df[col] = df[col].clip(lo, hi)

    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # time features
    df["Hour"] = df["Timestamp"].dt.hour
    df["DayOfWeek"] = df["Timestamp"].dt.dayofweek
    df["Month"] = df["Timestamp"].dt.month
    df["Is_Weekend"] = (df["DayOfWeek"] >= 5).astype(int)
    df["Hour_sin"] = np.sin(2 * np.pi * df["Hour"] / 24)
    df["Hour_cos"] = np.cos(2 * np.pi * df["Hour"] / 24)

    # domain features
    df["Battery_Power_W"] = df["Battery_Voltage"] * df["Battery_Current"]
    df["Capacity_Loss_Wh"] = df["Battery_Design_Capacity_Wh"] - df["Battery_Current_Capacity_Wh"]
    df["Motor_Power_Proxy"] = df["Motor_Torque_Nm"] * df["Motor_RPM"]
    df["Temp_Diff_Motor_Ambient"] = df["Motor_Temperature"] - df["Ambient_Temperature"]
    df["Temp_Diff_Battery_Ambient"] = df["Battery_Temperature"] - df["Ambient_Temperature"]
    df["Km_per_Year"] = df["Odometer_km"] / df["Vehicle_Age_Years"].replace(0, np.nan)
    df["Km_per_Year"] = df["Km_per_Year"].fillna(df["Km_per_Year"].median())
    df["Aggressive_Events"] = df["Harsh_Acceleration_Count"] + df["Hard_Braking_Count"]

    print(f"[features] engineered features added; total columns now {df.shape[1]}")
    return df


def cap_outliers_iqr(df: pd.DataFrame, cols, factor: float = 3.0) -> pd.DataFrame:
    """Winsorize (cap) extreme values instead of deleting rows."""
    df = df.copy()
    total = 0
    for col in cols:
        # skip binary / few-valued columns: IQR is 0 there and capping
        # would flatten the whole column to a constant
        if df[col].nunique() <= 10:
            continue
        q1, q3 = df[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        if iqr == 0:
            continue
        lo, hi = q1 - factor * iqr, q3 + factor * iqr
        n = int(((df[col] < lo) | (df[col] > hi)).sum())
        if n:
            df[col] = df[col].clip(lo, hi)
            total += n
    print(f"[outliers] values capped (IQR x{factor}): {total}")
    return df


def encode_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    for col, mapping in ORDINAL_MAPS.items():
        if col in df.columns:
            df[col] = df[col].map(mapping)
    df = pd.get_dummies(df, columns=[c for c in NOMINAL_COLS if c in df.columns], dtype=int)
    return df


# ----------------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------------
def main(input_path: str, target: str):
    OUTPUT_DIR.mkdir(exist_ok=True)

    df = load_data(input_path)
    if target not in df.columns:
        raise ValueError(f"Target '{target}' not found. Columns: {list(df.columns)}")

    df = clean_data(df)
    df = engineer_features(df)

    # readable cleaned file (before scaling / encoding)
    df.to_csv(OUTPUT_DIR / "ev_data_cleaned.csv", index=False)

    # ---- separate target ------------------------------------------------
    y = df[target].copy()
    drop_cols = ID_COLS + ["Timestamp"] + [c for c in LEAKAGE_COLS if c != target] + [target]
    X = df.drop(columns=[c for c in drop_cols if c in df.columns])
    print(f"[target] {target}\n{y.value_counts().to_string()}")

    # ---- outliers (features only) ---------------------------------------
    # Battery size/voltage differ ~10x between cars and scooters, so those
    # multi-modal columns are not capped.
    skip_cap = {"Battery_Design_Capacity_Wh", "Battery_Current_Capacity_Wh", "Battery_Voltage",
                "Battery_Power_W", "Capacity_Loss_Wh", "Motor_Power_Proxy"}
    numeric_cols = [c for c in X.select_dtypes(include=np.number).columns if c not in skip_cap]
    X = cap_outliers_iqr(X, numeric_cols)

    # ---- encode ---------------------------------------------------------
    X = encode_features(X)

    if y.dtype == object or str(y.dtype).startswith("str"):
        label_encoder = LabelEncoder()
        y = pd.Series(label_encoder.fit_transform(y), name=target)
        print(f"[target] classes: {dict(zip(label_encoder.classes_, range(len(label_encoder.classes_))))}")
        joblib.dump(label_encoder, OUTPUT_DIR / "label_encoder.joblib")
        stratify = y
    else:
        stratify = None

    # ---- split BEFORE scaling (avoids data leakage) ---------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=stratify
    )

    # ---- scale ----------------------------------------------------------
    binary_cols = [c for c in X.columns if set(X[c].unique()) <= {0, 1}]
    scale_cols = [c for c in X.columns if c not in binary_cols]

    scaler = StandardScaler()
    X_train[scale_cols] = scaler.fit_transform(X_train[scale_cols])
    X_test[scale_cols] = scaler.transform(X_test[scale_cols])

    # ---- save -----------------------------------------------------------
    X_train.to_csv(OUTPUT_DIR / "X_train.csv", index=False)
    X_test.to_csv(OUTPUT_DIR / "X_test.csv", index=False)
    y_train.to_csv(OUTPUT_DIR / "y_train.csv", index=False)
    y_test.to_csv(OUTPUT_DIR / "y_test.csv", index=False)
    joblib.dump(scaler, OUTPUT_DIR / "scaler.joblib")
    with open(OUTPUT_DIR / "feature_columns.json", "w") as f:
        json.dump({"columns": list(X.columns), "scaled_columns": scale_cols}, f, indent=2)

    print(f"\n[done] train: {X_train.shape}, test: {X_test.shape}")
    print(f"[done] files saved in: {OUTPUT_DIR}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Preprocess EV dataset")
    parser.add_argument("--input", default=DEFAULT_INPUT, help="CSV file name or full path")
    parser.add_argument("--target", default=DEFAULT_TARGET, help="target column")
    args = parser.parse_args()
    main(args.input, args.target)