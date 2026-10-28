import { Link } from 'react-router-dom';
import { atRisk } from '../../api/dashboard.api';
import { atRiskPredictions } from '../../api/ml.api';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/common/DataTable';
import Spinner from '../../components/common/Spinner';
import DisclaimerBanner from '../../components/ml/DisclaimerBanner';
import PredictionCard from '../../components/ml/PredictionCard';
import { useApi } from '../../hooks/useApi';

export default function Insights() {
  const rules = useApi(['dash', 'at-risk'], atRisk);
  const model = useApi(['ml', 'at-risk'], atRiskPredictions);
  return (
    <div className="space-y-6">
      <h1>Insights</h1>
      <DisclaimerBanner />
      <section className="card p-0"><div className="border-b border-paper-line p-4"><h2>Below attendance or marks thresholds</h2><p className="text-sm text-ink-soft">Plain rules you can check yourself: attendance under 75%, average under 40%, or scores falling 15+ points.</p></div>
        <DataTable rows={rules.data} loading={rules.isLoading} rowKey={(r) => r.studentId} empty={{ title: 'No students flagged', hint: 'Everyone in your classes is above the thresholds.' }}
          columns={[{ key: 'fullName', header: 'Student', render: (r) => <span className="font-medium">{r.fullName}</span> }, { key: 'class', header: 'Class', render: (r) => r.class?.name ?? '—' },
            { key: 'reasons', header: 'Why', render: (r) => <div className="flex flex-wrap gap-1">{r.reasons.map((x: string) => <Badge key={x} tone="warn">{x}</Badge>)}</div> }]} /></section>
      <section className="space-y-3"><div><h2>Model estimates</h2><p className="text-sm text-ink-soft">A second opinion from the analytics service. It may disagree with the rules above.</p></div>
        {model.isLoading ? <Spinner label="Asking the analytics service" /> : model.error ? <p className="rounded-md bg-warn-light p-3 text-sm">{model.error.message}. The rule-based list above still works.</p> :
          !model.data?.length ? <p className="card text-sm text-ink-soft">The model doesn’t flag anyone right now.</p> :
            <div className="grid gap-4 md:grid-cols-2">{model.data.map((m) => <PredictionCard key={m.studentId} studentId={m.studentId} name={m.fullName} />)}</div>}
        <p className="text-xs text-ink-faint">Looking for one student? Open them from <Link to="/teacher/classes" className="text-brand">My classes</Link>.</p></section>
    </div>
  );
}
