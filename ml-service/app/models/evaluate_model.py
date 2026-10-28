import json
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score
from app.config import METRICS_PATH


def compute_metrics(y_true, y_pred) -> dict:
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 3),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 3),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 3),
        "confusionMatrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
    }


def load_metrics() -> dict:
    if not METRICS_PATH.exists():
        raise FileNotFoundError("No metrics yet. Train the model first.")
    return json.loads(METRICS_PATH.read_text())
