from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "saved_models" / "model_v1.pkl"
METRICS_PATH = BASE_DIR / "saved_models" / "metrics_v1.json"
TRAINING_CSV = BASE_DIR / "data" / "sample_training.csv"

FEATURES = ["attendancePct", "avgScorePct", "examsTaken", "scoreTrend", "lateRate"]
LABEL = "at_risk"
THRESHOLD = 0.5  # probability above which a student is flagged AT_RISK
RANDOM_STATE = 42
