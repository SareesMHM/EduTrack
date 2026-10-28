import joblib
from app.config import MODEL_PATH, THRESHOLD
from app.services.preprocessing import to_frame

MODEL_VERSION = "model_v1"
_bundle = None


def reset_cache() -> None:
    global _bundle
    _bundle = None


def bundle() -> dict:
    global _bundle
    if _bundle is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError("Model not trained yet")
        _bundle = joblib.load(MODEL_PATH)
    return _bundle


def predict_proba(rows) -> list:
    return [float(p) for p in bundle()["model"].predict_proba(to_frame(rows))[:, 1]]


def label_for(p: float) -> dict:
    flagged = p >= THRESHOLD
    return {
        "prediction": "AT_RISK" if flagged else "ON_TRACK",
        "probability": round(p, 3),
        "confidence": round(p if flagged else 1 - p, 3),
    }
