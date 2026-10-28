from fastapi import APIRouter, HTTPException
from app.models.evaluate_model import load_metrics

router = APIRouter()


@router.get("/evaluate")
def evaluate():
    try:
        return load_metrics()
    except FileNotFoundError as e:
        raise HTTPException(404, str(e))
