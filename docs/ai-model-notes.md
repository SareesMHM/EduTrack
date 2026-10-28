# AI model notes
- Purpose: highlight students who may benefit from a conversation. Advisory only; nothing is automated.
- Inputs: attendance %, average score %, exams taken, score trend, late rate. Output: AT_RISK / ON_TRACK with probability.
- The bundled model is trained on **synthetic** data (`ml-service/data/sample_training.csv`); its reported accuracy says nothing about real students. Retrain on approved, anonymised history before relying on it.
- Explanations use occlusion against the training mean, not SHAP.
- Before real use: compare error rates by gender and class, review false negatives with teachers, re-evaluate each term, and keep the rule-based list (`/dashboard/at-risk`) as a transparent baseline.
