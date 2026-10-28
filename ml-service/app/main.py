import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import MODEL_PATH
from app.models.train_model import train
from app.routes import evaluate, health, predict, train as train_routes


@asynccontextmanager
async def lifespan(_: FastAPI):
    if not MODEL_PATH.exists():  # first boot: build a model from the bundled sample data
        train()
    yield


app = FastAPI(title="EduTrack ML Service", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5000").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
for r in (health.router, predict.router, train_routes.router, evaluate.router):
    app.include_router(r)
