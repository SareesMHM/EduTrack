import { useParams } from 'react-router-dom';
import { resultDetail } from '../../api/results.api';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Spinner from '../../components/common/Spinner';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { GRADE_STYLE } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function ResultDetail() {
  const { examId = '' } = useParams();
  const { user } = useAuth();
  const { data: r, isLoading, error } = useApi(['result', examId], () => resultDetail(user!.id, examId));
  if (isLoading) return <Spinner />;
  if (!r) return <p className="text-bad">{error?.message ?? 'Result not found'}</p>;
  return (
    <div className="max-w-xl space-y-4">
      <div className="no-print"><Breadcrumbs items={[{ label: 'Results', to: '/student/results' }, { label: r.title }]} /></div>
      <article className="card space-y-4"><header><h1>{r.title}</h1><p className="text-ink-soft">{r.subject} · {formatDate(r.date)}</p><p className="text-sm text-ink-soft">{user?.fullName}</p></header>
        <div className="flex items-center gap-6"><p className="text-5xl font-bold tabular-nums">{r.score}<span className="text-2xl text-ink-faint">/{r.maxMarks}</span></p><span className={`rounded-full px-4 py-1 text-xl font-bold ${GRADE_STYLE[r.grade]}`}>{r.grade}</span></div>
        <dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="text-ink-soft">Percentage</dt><dd className="font-semibold">{r.percentage}%</dd></div><div><dt className="text-ink-soft">Class average</dt><dd className="font-semibold">{r.classAverage ?? '—'} <span className="font-normal text-ink-faint">({r.classSize} students)</span></dd></div></dl>
      </article>
      <button className="btn-ghost no-print" onClick={() => window.print()}>Print result</button>
    </div>
  );
}
