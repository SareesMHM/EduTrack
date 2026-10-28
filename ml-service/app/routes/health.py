from fastapi import APIRouter
from app.config import MODEL_PATH

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "modelLoaded": MODEL_PATH.exists()}
