import { Link } from 'react-router-dom';
import { teacherDashboard } from '../../api/dashboard.api';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/formatDate';

export default function Dashboard() {
  const { data, isLoading, error } = useApi(['dash', 'teacher'], teacherDashboard);
  if (isLoading) return <Spinner />;
  if (error || !data) return <p className="text-bad">{error?.message ?? 'Could not load your dashboard'}</p>;
  return (
    <div className="space-y-6">
      <h1>Today</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="My classes" value={data.classes.length} />
        <StatCard label="Registers not taken today" value={data.pendingAttendance.length} tone={data.pendingAttendance.length ? 'warn' : undefined} />
        <StatCard label="Exams waiting for marks" value={data.examsToGrade.length} tone={data.examsToGrade.length ? 'warn' : undefined} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card"><h2 className="mb-3">Take attendance</h2>
          {!data.pendingAttendance.length ? <p className="text-sm text-ink-soft">All your registers are done for today.</p> :
            <ul className="divide-y divide-paper-line">{data.pendingAttendance.map((c: any) => (<li key={c.id} className="flex items-center justify-between py-2"><span className="font-medium">{c.name}</span><Link className="btn-primary py-1" to={`/teacher/attendance/${c.id}`}>Mark register</Link></li>))}</ul>}</section>
        <section className="card"><h2 className="mb-3">Marks to enter</h2>
          {!data.examsToGrade.length ? <p className="text-sm text-ink-soft">Nothing outstanding.</p> :
            <ul className="divide-y divide-paper-line">{data.examsToGrade.map((e: any) => (<li key={e.id} className="flex items-center justify-between gap-2 py-2 text-sm"><span><span className="font-medium">{e.title}</span><br /><span className="text-ink-soft">{e.class.name} · {formatDate(e.date)}</span></span>
              <span className="flex items-center gap-2"><Badge tone="warn">{e._count.marks} entered</Badge><Link className="btn-ghost py-1" to={`/teacher/exams/${e.id}/marks`}>Enter</Link></span></li>))}</ul>}</section>
      </div>
    </div>
  );
}
