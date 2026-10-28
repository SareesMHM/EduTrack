import { useState } from 'react';
import { Link } from 'react-router-dom';
import { exportAttendance, history, lowAttendance } from '../../api/attendance.api';
import { myClasses } from '../../api/teachers.api';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/common/DataTable';
import DatePicker from '../../components/forms/DatePicker';
import Select from '../../components/forms/Select';
import { useApi } from '../../hooks/useApi';
import { AttendanceStatus } from '../../types/attendance';
import { LOW_ATTENDANCE } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const TONE: Record<AttendanceStatus, 'good' | 'warn' | 'bad' | 'neutral'> = { PRESENT: 'good', LATE: 'warn', ABSENT: 'bad', EXCUSED: 'neutral' };

export default function AttendanceHistory() {
  const classes = useApi(['my-classes'], myClasses);
  const [classId, setClassId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const params = { classId: classId || undefined, from: from || undefined, to: to || undefined };
  const rows = useApi(['att-history', params], () => history(params));
  const low = useApi(['att-low', classId], () => lowAttendance({ classId: classId || undefined, threshold: LOW_ATTENDANCE }));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1>Attendance</h1><button className="btn-ghost" onClick={() => exportAttendance(params)}>Export CSV</button></div>
      <section className="card"><h2 className="mb-3">Take today’s register</h2>
        <div className="flex flex-wrap gap-2">{classes.data?.map((c) => <Link key={c.id} to={`/teacher/attendance/${c.id}`} className="btn-ghost">{c.grade.name} · {c.name}</Link>)}{!classes.data?.length && <p className="text-sm text-ink-soft">No classes assigned.</p>}</div></section>
      {!!low.data?.length && <section className="card border-warn"><h2 className="mb-2">Below {LOW_ATTENDANCE}% attendance</h2>
        <ul className="flex flex-wrap gap-2">{low.data.map((s) => <li key={s.studentId}><Badge tone="bad">{s.fullName} · {s.percentage}%</Badge></li>)}</ul></section>}
      <section className="card p-0">
        <div className="grid gap-3 border-b border-paper-line p-4 sm:grid-cols-3">
          <Select value={classId} onChange={setClassId} placeholder="All my classes" options={(classes.data ?? []).map((c) => ({ value: c.id, label: c.name }))} aria-label="Class" />
          <div><label className="sr-only" htmlFor="f">From</label><DatePicker id="f" value={from} onChange={setFrom} /></div>
          <div><label className="sr-only" htmlFor="t">To</label><DatePicker id="t" value={to} onChange={setTo} /></div></div>
        <DataTable rows={rows.data} loading={rows.isLoading} rowKey={(r) => r.id} empty={{ title: 'No attendance records', hint: 'Records appear here once a register is saved.' }}
          columns={[{ key: 'date', header: 'Date', sortValue: (r) => r.date, render: (r) => formatDate(r.date) }, { key: 'class', header: 'Class', render: (r) => r.class?.name }, { key: 'student', header: 'Student', render: (r) => r.student?.fullName },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={TONE[r.status]}>{r.status[0] + r.status.slice(1).toLowerCase()}</Badge> }, { key: 'note', header: 'Note' }]} />
      </section>
    </div>
  );
}
