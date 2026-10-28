import pytest
from fastapi.testclient import TestClient
from app.main import app

GOOD = {"attendancePct": 96, "avgScorePct": 82, "examsTaken": 4, "scoreTrend": 5, "lateRate": 0.02}
POOR = {"attendancePct": 52, "avgScorePct": 25, "examsTaken": 4, "scoreTrend": -20, "lateRate": 0.2}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:  # runs lifespan -> trains if needed
        yield c


def test_health(client):
    assert client.get("/health").json()["status"] == "ok"


def test_predict_separates_strong_and_weak(client):
    good = client.post("/predict", json={"studentId": "a", "features": GOOD}).json()
    poor = client.post("/predict", json={"studentId": "b", "features": POOR}).json()
    assert good["prediction"] == "ON_TRACK"
    assert poor["prediction"] == "AT_RISK"
    assert 0 <= poor["probability"] <= 1 and "Advisory" in poor["disclaimer"]


def test_validation_rejects_bad_input(client):
    bad = {**GOOD, "attendancePct": 140}
    assert client.post("/predict", json={"studentId": "a", "features": bad}).status_code == 422


def test_batch_and_explain(client):
    items = [{"studentId": "a", "features": GOOD}, {"studentId": "b", "features": POOR}]
    res = client.post("/predict/batch", json={"items": items}).json()["results"]
    assert [r["studentId"] for r in res] == ["a", "b"]
    ex = client.post("/explain", json=items[1]).json()
    assert set(ex["contributions"]) == set(GOOD)


def test_evaluate_reports_metrics(client):
    m = client.get("/evaluate").json()
    assert {"accuracy", "precision", "recall", "confusionMatrix"} <= set(m)
