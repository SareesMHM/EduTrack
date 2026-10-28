import { useState } from 'react';
import * as ml from '../../api/ml.api';
import { useApi } from '../../hooks/useApi';
import Badge from '../common/Badge';

export default function PredictionCard({ studentId, name }: { studentId: string; name: string }) {
  const [showWhy, setShowWhy] = useState(false);
  const pred = useApi(['predict', studentId], () => ml.predict(studentId));
  const why = useApi(['explain', studentId], () => ml.explain(studentId), { enabled: showWhy });
  const p = pred.data;
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold">{name}</p>
        {p && <Badge tone={p.prediction === 'AT_RISK' ? 'bad' : 'good'}>{p.prediction === 'AT_RISK' ? 'May need support' : 'On track'}</Badge>}
      </div>
      {pred.isLoading && <p className="mt-2 text-sm text-ink-soft">Estimating…</p>}
      {pred.error && <p className="mt-2 text-sm text-bad">{pred.error.message}</p>}
      {p && (
        <>
          <p className="mt-2 text-sm text-ink-soft">Estimated chance of needing support: <strong className="text-ink">{Math.round(p.probability * 100)}%</strong> (model confidence {Math.round(p.confidence * 100)}%)</p>
          <button className="mt-2 text-sm font-medium text-brand" onClick={() => setShowWhy(!showWhy)}>{showWhy ? 'Hide' : 'Why this estimate?'}</button>
          {showWhy && why.data && (
            <ul className="mt-2 space-y-1 text-sm">
              {Object.entries(why.data.contributions).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).map(([k, v]) => (
                <li key={k} className="flex justify-between"><span className="text-ink-soft">{k}</span><span className={v > 0 ? 'text-bad' : v < 0 ? 'text-good' : ''}>{v > 0 ? '+' : ''}{Math.round(v * 100)} pts</span></li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
