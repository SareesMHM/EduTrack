import { Link } from 'react-router-dom';
import { adminDashboard, atRisk } from '../../api/dashboard.api';
import AttendanceChart from '../../components/charts/AttendanceChart';
import ResultsChart from '../../components/charts/ResultsChart';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/formatDate';

export default function Dashboard() {
  const { data, isLoading, error } = useApi(['dash', 'admin'], adminDashboard);
  const risk = useApi(['dash', 'at-risk'], atRisk);
  if (isLoading) return <Spinner />;
  if (error || !data) return <p className="text-bad">{error?.message ?? 'Could not load the dashboard'}</p>;
  const k = data.kpis;
  return (
    <div className="space-y-6">
      <h1>Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active students" value={k.students} />
        <StatCard label="Teachers" value={k.teachers} />
        <StatCard label="Classes" value={k.classes} hint={`${k.subjects} subjects`} />
        <StatCard label="Attendance today" value={k.todayAttendance === null ? '—' : `${k.todayAttendance}%`} hint={k.todayAttendance === null ? 'No register taken yet' : undefined} tone={k.todayAttendance !== null && k.todayAttendance < 75 ? 'bad' : undefined} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card"><h2 className="mb-3">Attendance, last 7 days</h2><AttendanceChart data={data.attendanceTrend} /></section>
        <section className="card"><h2 className="mb-3">Grades across all results</h2><ResultsChart distribution={data.gradeDistribution} /></section>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-3">Students who may need support</h2>
          {!risk.data?.length ? <p className="text-sm text-ink-soft">No students are below the attendance or marks thresholds.</p> : (
            <ul className="divide-y divide-paper-line">
              {risk.data.slice(0, 6).map((s: any) => (
                <li key={s.studentId} className="py-2 text-sm"><Link to={`/admin/students/${s.studentId}`} className="font-medium text-brand">{s.fullName}</Link>
                  <span className="text-ink-soft"> · {s.class?.name ?? 'No class'}</span><div className="mt-1 flex flex-wrap gap-1">{s.reasons.map((r: string) => <Badge key={r} tone="warn">{r}</Badge>)}</div></li>
              ))}
            </ul>
          )}
        </section>
        <section className="card"><h2 className="mb-3">Newest accounts</h2>
          <ul className="divide-y divide-paper-line">{data.recentUsers.map((u: any) => (
            <li key={u.id} className="flex justify-between py-2 text-sm"><span>{u.fullName} <Badge tone="brand">{u.role.toLowerCase()}</Badge></span><span className="text-ink-faint">{formatDate(u.createdAt)}</span></li>))}</ul>
        </section>
      </div>
    </div>
  );
}
