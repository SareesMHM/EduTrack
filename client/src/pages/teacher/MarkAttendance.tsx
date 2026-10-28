import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { byClass, markBulk } from '../../api/attendance.api';
import { classStudents, getClass } from '../../api/classes.api';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Spinner from '../../components/common/Spinner';
import DatePicker from '../../components/forms/DatePicker';
import AttendanceSheet from '../../components/attendance/AttendanceSheet';
import { useAction, useApi } from '../../hooks/useApi';
import { AttendanceStatus } from '../../types/attendance';
import { todayInput } from '../../utils/formatDate';

export default function MarkAttendance() {
  const { classId = '' } = useParams();
  const [date, setDate] = useState(todayInput());
  const [values, setValues] = useState<Record<string, AttendanceStatus>>({});
  const cls = useApi(['class', classId], () => getClass(classId));
  const roster = useApi(['roster', classId], () => classStudents(classId));
  const existing = useApi(['attendance', classId, date], () => byClass(classId, { date }));

  useEffect(() => {
    if (!roster.data || !existing.data) return;
    const saved = Object.fromEntries(existing.data.map((r) => [r.studentId, r.status]));
    setValues(Object.fromEntries(roster.data.map((s) => [s.id, saved[s.id] ?? 'PRESENT'])));
  }, [roster.data, existing.data]);

  const save = useAction(() => markBulk({ classId, date, records: Object.entries(values).map(([studentId, status]) => ({ studentId, status })) }),
    { success: 'Attendance saved', invalidate: [['attendance'], ['dash', 'teacher']] });

  if (roster.isLoading || existing.isLoading) return <Spinner />;
  const hasRecords = (existing.data?.length ?? 0) > 0;
  return (
    <div className="max-w-3xl space-y-4">
      <Breadcrumbs items={[{ label: 'Attendance', to: '/teacher/attendance' }, { label: cls.data?.name ?? 'Class' }]} />
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1>Register · {cls.data?.name}</h1>
        {hasRecords && <p className="text-sm text-warn">A register already exists for this date. Saving will update it.</p>}</div>
        <div><label className="label" htmlFor="d">Date</label><DatePicker id="d" value={date} max={todayInput()} onChange={setDate} /></div></div>
      <div className="card p-0">
        {!roster.data?.length ? <p className="p-6 text-sm text-ink-soft">This class has no students. <Link className="text-brand" to="/teacher/classes">Back to classes</Link></p> : <AttendanceSheet students={roster.data} value={values} onChange={setValues} />}</div>
      <div className="flex justify-end"><button className="btn-primary" disabled={save.isPending || !roster.data?.length} onClick={() => save.mutate()}>{save.isPending ? 'Saving…' : 'Save register'}</button></div>
    </div>
  );
}
