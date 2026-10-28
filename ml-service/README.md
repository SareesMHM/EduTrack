# EduTrack ML service

FastAPI service that estimates whether a student may need extra support.
The Express API computes the five features from real attendance and marks, then calls this service.

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt pytest httpx
uvicorn app.main:app --reload --port 8000    # trains on first start
pytest -q
```

| Endpoint | Purpose |
|---|---|
| `GET /health` | liveness + whether a model is loaded |
| `POST /predict`, `POST /predict/batch` | AT_RISK / ON_TRACK with probability and confidence |
| `POST /explain` | per-feature contribution (occlusion vs. training mean) |
| `POST /train` | retrain from `data/sample_training.csv` (blocked when `ENV=production`) |
| `GET /evaluate` | accuracy, precision, recall, confusion matrix on a held-out 25% |

## Limitations (read before relying on it)
- The bundled model learns from **synthetic** data, so its metrics describe the generator, not your school.
- Five coarse features only; it cannot see home circumstances, health, or teaching quality.
- Predictions can be wrong in both directions. They are **advisory**: a teacher reviews every flag, and nothing happens automatically.
- Before real use: retrain on approved historical data, compare error rates across gender and class groups, and re-evaluate each term.
