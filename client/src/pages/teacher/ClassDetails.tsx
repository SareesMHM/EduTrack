import { Link, useParams } from 'react-router-dom';
import { classStudents, getClass } from '../../api/classes.api';
import { listExams } from '../../api/exams.api';
import Badge from '../../components/common/Badge';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Spinner from '../../components/common/Spinner';
import ExamCard from '../../components/exams/ExamCard';
import { useApi } from '../../hooks/useApi';

export default function ClassDetails() {
  const { id = '' } = useParams();
  const cls = useApi(['class', id], () => getClass(id));
  const roster = useApi(['roster', id], () => classStudents(id));
  const exams = useApi(['exams', { classId: id }], () => listExams({ classId: id }));
  if (cls.isLoading) return <Spinner />;
  if (!cls.data) return <p className="text-bad">{cls.error?.message ?? 'Class not found'}</p>;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'My classes', to: '/teacher/classes' }, { label: cls.data.name }]} />
      <div className="flex flex-wrap items-center justify-between gap-2"><h1>{cls.data.grade.name} · {cls.data.name}</h1>
        <div className="flex gap-2"><Link to={`/teacher/attendance/${id}`} className="btn-primary">Take attendance</Link><Link to="/teacher/exams" className="btn-ghost">Exams</Link></div></div>
      <section className="card p-0"><h2 className="border-b border-paper-line p-4">Roster ({roster.data?.length ?? 0})</h2>
        {roster.isLoading ? <Spinner /> : <ul className="divide-y divide-paper-line">{roster.data?.map((s) => <li key={s.id} className="flex items-center justify-between px-4 py-2.5 text-sm"><span className="font-medium">{s.fullName}</span><span className="text-ink-soft">{s.email}</span></li>)}
          {!roster.data?.length && <li className="p-4 text-sm text-ink-soft">No students in this class yet.</li>}</ul>}</section>
      <section><h2 className="mb-3">Exams {exams.data?.length ? <Badge tone="brand">{exams.data.length}</Badge> : null}</h2>
        <div className="grid gap-4 sm:grid-cols-2">{exams.data?.map((e) => <ExamCard key={e.id} exam={e} to={`/teacher/exams/${e.id}/marks`} />)}</div></section>
    </div>
  );
}
