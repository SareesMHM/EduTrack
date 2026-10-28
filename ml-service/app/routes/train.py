import os
from fastapi import APIRouter, HTTPException
from app.models.predict_model import reset_cache
from app.models.train_model import train as train_fn

router = APIRouter()


@router.post("/train")
def train():
    """Retrains from the CSV in data/. Disabled in production."""
    if os.getenv("ENV", "development") == "production":
        raise HTTPException(403, "Training is disabled in production")
    metrics = train_fn()
    reset_cache()
    return metrics
