from app.config import FEATURES
from app.models.predict_model import bundle, predict_proba


def explain(features: dict) -> dict:
    """Occlusion attribution: how much does P(at risk) change if a feature is
    replaced by its training average? Positive = this feature raises the risk.
    Simple and dependency-free; for deeper analysis swap in SHAP."""
    base = predict_proba([features])[0]
    means = bundle()["means"]
    contributions = {}
    for f in FEATURES:
        neutral = {**features, f: means[f]}
        contributions[f] = round(base - predict_proba([neutral])[0], 3)
    return {"probability": round(base, 3), "contributions": contributions, "method": "occlusion vs. training mean"}
