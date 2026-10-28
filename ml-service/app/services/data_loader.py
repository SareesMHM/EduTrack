import pandas as pd
from app.config import FEATURES, LABEL, TRAINING_CSV


def load_training_data(path=TRAINING_CSV) -> pd.DataFrame:
    df = pd.read_csv(path)
    missing = [c for c in FEATURES + [LABEL] if c not in df.columns]
    if missing:
        raise ValueError(f"Training CSV is missing columns: {missing}")
    return df.dropna(subset=FEATURES + [LABEL])
