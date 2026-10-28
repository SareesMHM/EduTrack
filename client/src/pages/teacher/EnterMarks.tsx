import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publishExam, unpublishExam } from '../../api/exams.api';
import { enterMarks, marksByExam } from '../../api/marks.api';
import { examSummary } from '../../api/results.api';
import Badge from '../../components/common/Badge';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Spinner from '../../components/common/Spinner';
import MarksGrid from '../../components/exams/MarksGrid';
import { useAction, useApi } from '../../hooks/useApi';

export default function EnterMarks() {
  const { id = '' } = useParams();
  const data = useApi(['marks', id], () => marksByExam(id));
  const summary = useApi(['exam-summary', id], () => examSummary(id));
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => { if (data.data) setValues(Object.fromEntries(data.data.rows.map((r) => [r.studentId, r.score === null ? '' : String(r.score)]))); }, [data.data]);

  const max = data.data?.exam.maxMarks ?? 100;
  const entries = Object.entries(values).filter(([, v]) => v !== '');
  const invalid = entries.some(([, v]) => Number.isNaN(Number(v)) || Number(v) < 0 || Number(v) > max);
  const refresh = [['marks', id], ['exam-summary', id], ['exams']];
  const save = useAction(() => enterMarks(id, entries.map(([studentId, v]) => ({ studentId, score: Number(v) }))), { success: 'Marks saved', invalidate: refresh });
  const publish = useAction(() => (data.data!.exam.published ? unpublishExam(id) : publishExam(id)), { success: 'Visibility updated', invalidate: refresh });

  if (data.isLoading) return <Spinner />;
  if (!data.data) return <p className="text-bad">{data.error?.message ?? 'Exam not found'}</p>;
  const { exam, rows } = data.data; const s = summary.data;
  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Exams', to: '/teacher/exams' }, { label: exam.title }]} />
      <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-3"><h1>{exam.title}</h1><Badge tone={exam.published ? 'good' : 'neutral'}>{exam.published ? 'Published to students' : 'Draft'}</Badge></div>
        <button className="btn-ghost" disabled={publish.isPending} onClick={() => publish.mutate()}>{exam.published ? 'Unpublish results' : 'Publish results'}</button></div>
      {s && s.count > 0 && <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">{[['Average', s.average], ['Highest', s.highest], ['Lowest', s.lowest], ['Pass rate', `${s.passRate}%`]].map(([k, v]) => <div key={String(k)} className="card py-3"><dt className="text-ink-soft">{k}</dt><dd className="text-xl font-bold tabular-nums">{v}</dd></div>)}</dl>}
      <div className="card p-0"><MarksGrid rows={rows} max={max} values={values} onChange={(sid, v) => setValues({ ...values, [sid]: v })} />{!rows.length && <p className="p-6 text-sm text-ink-soft">No students in this class.</p>}</div>
      <div className="flex items-center justify-end gap-3">{invalid && <p role="alert" className="text-sm text-bad">Scores must be between 0 and {max}.</p>}
        <button className="btn-primary" disabled={save.isPending || invalid || !entries.length} onClick={() => save.mutate()}>{save.isPending ? 'Saving…' : 'Save marks'}</button></div>
    </div>
  );
}
