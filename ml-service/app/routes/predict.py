from fastapi import APIRouter, HTTPException
from app.models.explain import explain as explain_fn
from app.models.predict_model import MODEL_VERSION, label_for, predict_proba
from app.schemas.prediction import (
    BatchRequest, BatchResponse, ExplainResponse, PredictRequest, PredictResponse,
)

router = APIRouter()
DISCLAIMER = "Advisory estimate only. A teacher must review before any action is taken."


def _respond(req: PredictRequest, p: float) -> PredictResponse:
    return PredictResponse(
        studentId=req.studentId, modelVersion=MODEL_VERSION, disclaimer=DISCLAIMER, **label_for(p)
    )


@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        return _respond(req, predict_proba([req.features])[0])
    except FileNotFoundError:
        raise HTTPException(503, "Model not trained yet")


@router.post("/predict/batch", response_model=BatchResponse)
def predict_batch(req: BatchRequest):
    if not req.items:
        return BatchResponse(results=[])
    try:
        probs = predict_proba([i.features for i in req.items])
    except FileNotFoundError:
        raise HTTPException(503, "Model not trained yet")
    return BatchResponse(results=[_respond(i, p) for i, p in zip(req.items, probs)])


@router.post("/explain", response_model=ExplainResponse)
def explain(req: PredictRequest):
    try:
        return ExplainResponse(studentId=req.studentId, **explain_fn(req.features.model_dump()))
    except FileNotFoundError:
        raise HTTPException(503, "Model not trained yet")
