import { useAuth } from '../../hooks/useAuth';
import { byStudent, percentage } from '../../api/attendance.api';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import Spinner from '../../components/common/Spinner';
import AttendanceSummary from '../../components/students/AttendanceSummary';
import { useApi } from '../../hooks/useApi';

export default function Attendance() {
  const id = useAuth().user!.id;
  const pct = useApi(['att-pct', id], () => percentage(id));
  const recs = useApi(['att-student', id], () => byStudent(id));
  if (pct.isLoading || recs.isLoading) return <Spinner />;
  return (
    <div className="space-y-4"><h1>My attendance</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card"><h2 className="mb-3">Summary</h2>{pct.data && pct.data.total ? <AttendanceSummary data={pct.data} /> : <p className="text-sm text-ink-soft">No attendance has been recorded for you yet.</p>}</section>
        <section className="card"><AttendanceCalendar records={recs.data ?? []} /></section></div>
    </div>
  );
}
