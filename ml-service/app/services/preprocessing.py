import pandas as pd
from app.config import FEATURES


def to_frame(rows) -> pd.DataFrame:
    """Rows are dicts or pydantic models with the FEATURES keys. Column order is fixed."""
    data = [r if isinstance(r, dict) else r.model_dump() for r in rows]
    return pd.DataFrame(data)[FEATURES].astype(float)
