import json
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from app.config import FEATURES, LABEL, METRICS_PATH, MODEL_PATH, RANDOM_STATE
from app.models.evaluate_model import compute_metrics
from app.services.data_loader import load_training_data


def train(csv_path=None) -> dict:
    df = load_training_data(csv_path) if csv_path else load_training_data()
    X, y = df[FEATURES], df[LABEL].astype(int)
    X_tr, X_te, y_tr, y_te = train_test_split(
        X, y, test_size=0.25, stratify=y, random_state=RANDOM_STATE
    )
    model = RandomForestClassifier(
        n_estimators=200, max_depth=6, min_samples_leaf=3,
        class_weight="balanced", random_state=RANDOM_STATE,
    ).fit(X_tr, y_tr)

    metrics = compute_metrics(y_te, model.predict(X_te))
    metrics.update(
        {
            "trainRows": int(len(X_tr)),
            "testRows": int(len(X_te)),
            "positiveRate": round(float(y.mean()), 3),
            "dataSource": "synthetic sample data" if csv_path is None else str(csv_path),
        }
    )
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "means": X_tr.mean().to_dict()}, MODEL_PATH)
    METRICS_PATH.write_text(json.dumps(metrics, indent=2))
    return metrics
