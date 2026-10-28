import { Link } from 'react-router-dom';
import { studentDashboard } from '../../api/dashboard.api';
import GaugeChart from '../../components/charts/GaugeChart';
import Spinner from '../../components/common/Spinner';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { GRADE_STYLE } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useApi(['dash', 'student'], studentDashboard);
  if (isLoading) return <Spinner />;
  if (error || !data) return <p className="text-bad">{error?.message ?? 'Could not load your dashboard'}</p>;
  return (
    <div className="space-y-6">
      <h1>Hello, {user?.fullName.split(' ')[0]}</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card flex flex-col items-center"><h2 className="self-start">Attendance</h2><GaugeChart value={data.attendancePercentage} /><Link to="/student/attendance" className="text-sm text-brand">See calendar</Link></section>
        <section className="card lg:col-span-2"><div className="mb-3 flex items-center justify-between"><h2>Latest results</h2><Link to="/student/results" className="text-sm text-brand">All results</Link></div>
          {!data.latestResults.length ? <p className="text-sm text-ink-soft">No results have been published yet.</p> : <ul className="divide-y divide-paper-line">{data.latestResults.map((r: any) => (
            <li key={r.examId} className="flex items-center justify-between py-2 text-sm"><Link to={`/student/results/${r.examId}`} className="font-medium text-brand">{r.title}</Link><span className="flex items-center gap-3"><span className="tabular-nums">{r.score}/{r.maxMarks}</span><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${GRADE_STYLE[r.grade]}`}>{r.grade}</span></span></li>))}</ul>}</section>
      </div>
      <section className="card"><h2 className="mb-3">Upcoming exams</h2>
        {!data.upcomingExams.length ? <p className="text-sm text-ink-soft">Nothing scheduled.</p> : <ul className="divide-y divide-paper-line">{data.upcomingExams.map((e: any) => <li key={e.id} className="flex justify-between py-2 text-sm"><span className="font-medium">{e.title} <span className="font-normal text-ink-soft">· {e.subject.name}</span></span><span className="text-ink-soft">{formatDate(e.date)}</span></li>)}</ul>}</section>
    </div>
  );
}
