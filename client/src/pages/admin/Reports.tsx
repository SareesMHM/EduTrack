import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { exportAttendance } from '../../api/attendance.api';
import { listClasses } from '../../api/classes.api';
import { exportStudents, exportTerm, termReport } from '../../api/reports.api';
import { stats } from '../../api/dashboard.api';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/common/DataTable';
import Select from '../../components/forms/Select';
import { useApi } from '../../hooks/useApi';
import { LOW_ATTENDANCE } from '../../utils/constants';

export default function Reports() {
  const [classId, setClassId] = useState('');
  const classes = useApi(['classes'], () => listClasses());
  const params = { classId: classId || undefined };
  const term = useApi(['term', params], () => termReport(params));
  const subj = useApi(['subject-stats'], stats);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1>Reports</h1>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => exportStudents()}>Students CSV</button>
          <button className="btn-ghost" onClick={() => exportAttendance(params)}>Attendance CSV</button>
          <button className="btn-primary" onClick={() => exportTerm(params)}>Term report CSV</button></div></div>
      <section className="card"><h2 className="mb-3">Average score by subject</h2>
        {!subj.data?.subjectAverages.length ? <p className="text-sm text-ink-soft">No marks recorded yet.</p> : (
          <div className="h-64"><ResponsiveContainer><BarChart data={subj.data.subjectAverages} margin={{ left: -16 }}><CartesianGrid stroke="#DCE3E4" vertical={false} /><XAxis dataKey="subject" tick={{ fontSize: 12 }} /><YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} /><Tooltip formatter={(v: number) => [`${v}%`, 'Average']} /><Bar dataKey="average" fill="#12706B" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>)}</section>
      <section className="card p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-line p-4"><h2>Term overview</h2>
          <div className="w-56"><Select value={classId} onChange={setClassId} placeholder="All classes" options={(classes.data ?? []).map((c) => ({ value: c.id, label: `${c.grade.name} · ${c.name}` }))} aria-label="Class" /></div></div>
        <DataTable rows={term.data} loading={term.isLoading} rowKey={(r) => r.studentId} empty={{ title: 'No students to report on' }}
          columns={[
            { key: 'fullName', header: 'Student', sortValue: (r) => r.fullName }, { key: 'class', header: 'Class' },
            { key: 'attendancePct', header: 'Attendance', sortValue: (r) => r.attendancePct, render: (r) => <Badge tone={r.attendancePct < LOW_ATTENDANCE ? 'bad' : 'good'}>{r.attendancePct}%</Badge> },
            { key: 'avgScorePct', header: 'Average score', sortValue: (r) => r.avgScorePct, render: (r) => (r.examsTaken ? `${r.avgScorePct}%` : '—') },
            { key: 'examsTaken', header: 'Exams' },
            { key: 'scoreTrend', header: 'Trend', render: (r) => (r.examsTaken > 1 ? `${r.scoreTrend > 0 ? '+' : ''}${r.scoreTrend}` : '—') },
          ]} />
      </section>
    </div>
  );
}
