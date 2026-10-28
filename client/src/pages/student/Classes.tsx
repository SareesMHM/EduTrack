import { getClass } from '../../api/classes.api';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';

export default function Classes() {
  const { user } = useAuth();
  const classId = user?.classId ?? '';
  const cls = useApi(['class', classId], () => getClass(classId), { enabled: !!classId });
  if (!classId) return <div className="card"><EmptyState title="You’re not in a class yet" hint="The school office will assign you to one." /></div>;
  if (cls.isLoading) return <Spinner />;
  const c = cls.data;
  if (!c) return <p className="text-bad">{cls.error?.message ?? 'Could not load your class'}</p>;
  return (
    <div className="max-w-2xl space-y-4"><h1>{c.grade.name} · {c.name}</h1>
      <section className="card"><p className="text-sm text-ink-soft">Class teacher</p><p className="font-semibold">{c.teacher?.fullName ?? 'Not assigned yet'}</p><p className="mt-2 text-sm text-ink-soft">{c._count.students} students</p></section>
      <section className="card"><h2 className="mb-3">Subjects</h2><ul className="flex flex-wrap gap-2">{c.subjects.map((s) => <li key={s.subject.id} className="rounded-full bg-brand-light px-3 py-1 text-sm text-brand-dark">{s.subject.name}</li>)}{!c.subjects.length && <li className="text-sm text-ink-soft">No subjects listed yet.</li>}</ul></section>
    </div>
  );
}
