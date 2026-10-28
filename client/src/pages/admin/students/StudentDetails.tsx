import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listClasses } from '../../../api/classes.api';
import { attendanceSummary, getStudent, resultsSummary, transferStudent } from '../../../api/students.api';
import { setUserStatus } from '../../../api/users.api';
import Badge from '../../../components/common/Badge';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import DataTable from '../../../components/common/DataTable';
import Modal from '../../../components/common/Modal';
import Spinner from '../../../components/common/Spinner';
import Select from '../../../components/forms/Select';
import AttendanceSummary from '../../../components/students/AttendanceSummary';
import { useAction, useApi } from '../../../hooks/useApi';
import { GRADE_STYLE } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatDate';

export default function StudentDetails() {
  const { id = '' } = useParams();
  const student = useApi(['student', id], () => getStudent(id));
  const att = useApi(['student', id, 'att'], () => attendanceSummary(id));
  const res = useApi(['student', id, 'res'], () => resultsSummary(id));
  const classes = useApi(['classes'], () => listClasses());
  const [confirm, setConfirm] = useState(false);
  const [move, setMove] = useState(false);
  const [target, setTarget] = useState('');
  const toggle = useAction((active: boolean) => setUserStatus(id, active), { invalidate: [['student', id], ['students']], success: 'Status updated', onSuccess: () => setConfirm(false) });
  const transfer = useAction(() => transferStudent(id, target), { invalidate: [['student', id], ['students']], success: 'Student moved', onSuccess: () => setMove(false) });
  const s = student.data;
  if (student.isLoading) return <Spinner />;
  if (!s) return <p className="text-bad">{student.error?.message ?? 'Student not found'}</p>;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Students', to: '/admin/students' }, { label: s.fullName }]} />
      <section className="card flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1>{s.fullName} {!s.isActive && <Badge tone="warn">Archived</Badge>}</h1>
          <p className="text-ink-soft">{s.email}{s.phone ? ` · ${s.phone}` : ''}</p>
          <p className="text-sm text-ink-soft">{s.class ? `${s.class.grade.name} · ${s.class.name}` : 'Not in a class'} · Born {formatDate(s.dateOfBirth)}</p>
          <p className="text-sm text-ink-soft">Guardian: {s.parentName ?? '—'}{s.parentPhone ? ` (${s.parentPhone})` : ''}</p>
          <p className="text-sm text-ink-soft">{[s.address?.number, s.address?.street, s.address?.city, s.address?.district].filter(Boolean).join(', ') || 'No address on file'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/admin/students/${id}/edit`} className="btn-ghost">Edit</Link>
          <button className="btn-ghost" onClick={() => setMove(true)}>Change class</button>
          <button className={s.isActive ? 'btn-danger' : 'btn-primary'} onClick={() => (s.isActive ? setConfirm(true) : toggle.mutate(true))}>{s.isActive ? 'Archive' : 'Restore'}</button>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card"><h2 className="mb-3">Attendance</h2>{att.data ? (att.data.total ? <AttendanceSummary data={att.data} /> : <p className="text-sm text-ink-soft">No attendance recorded yet.</p>) : <Spinner />}</section>
        <section className="card"><h2 className="mb-1">Results</h2><p className="mb-3 text-sm text-ink-soft">{res.data?.average != null ? `Average ${res.data.average}% across ${res.data.count} exams` : 'No marks yet'}</p>
          <DataTable rows={res.data?.results.slice(0, 6)} rowKey={(r) => r.examId} loading={res.isLoading} empty={{ title: 'No results yet' }}
            columns={[{ key: 'title', header: 'Exam' }, { key: 'subject', header: 'Subject' }, { key: 'pct', header: 'Score', render: (r) => `${r.score}/${r.maxMarks}` },
              { key: 'grade', header: 'Grade', render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${GRADE_STYLE[r.grade]}`}>{r.grade}</span> }]} /></section>
      </div>
      <ConfirmDialog open={confirm} title="Archive this student?" message="They won’t be able to sign in and will be hidden from class rosters. Their records are kept and you can restore them later." confirmLabel="Archive" busy={toggle.isPending} onConfirm={() => toggle.mutate(false)} onCancel={() => setConfirm(false)} />
      <Modal open={move} title="Change class" onClose={() => setMove(false)}>
        <Select value={target} onChange={setTarget} placeholder="Choose a class" options={(classes.data ?? []).filter((c) => c.id !== s.classId).map((c) => ({ value: c.id, label: `${c.grade.name} · ${c.name}` }))} aria-label="New class" />
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setMove(false)}>Cancel</button><button className="btn-primary" disabled={!target || transfer.isPending} onClick={() => transfer.mutate()}>Move student</button></div>
      </Modal>
    </div>
  );
}
