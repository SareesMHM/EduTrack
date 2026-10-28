import { Link } from 'react-router-dom';
import { myClasses } from '../../api/teachers.api';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import { useApi } from '../../hooks/useApi';

export default function Classes() {
  const { data, isLoading } = useApi(['my-classes'], myClasses);
  if (isLoading) return <Spinner />;
  return (
    <div className="space-y-4"><h1>My classes</h1>
      {!data?.length ? <div className="card"><EmptyState title="No classes assigned" hint="Ask an administrator to assign you as a class teacher." /></div> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.map((c) => (
          <Link key={c.id} to={`/teacher/classes/${c.id}`} className="card block hover:border-brand"><p className="text-lg font-semibold">{c.grade.name} · {c.name}</p>
            <p className="text-sm text-ink-soft">{c._count.students} students</p><p className="mt-2 text-sm text-ink-soft">{c.subjects.map((s) => s.subject.name).join(', ') || 'No subjects yet'}</p></Link>))}</div>)}
    </div>
  );
}
