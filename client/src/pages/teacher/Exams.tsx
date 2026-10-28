import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { createExam, deleteExam, listExams } from '../../api/exams.api';
import { myClasses } from '../../api/teachers.api';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/forms/FormField';
import Select from '../../components/forms/Select';
import { useAction, useApi } from '../../hooks/useApi';
import { Exam } from '../../types/exam';
import { formatDate, todayInput } from '../../utils/formatDate';
import { fieldErrors } from '../../utils/validators';

const schema = z.object({ title: z.string().trim().min(2, 'Enter a title'), classId: z.string().min(1, 'Choose a class'), subjectId: z.string().min(1, 'Choose a subject'), date: z.string().min(1, 'Pick a date'), maxMarks: z.coerce.number().int().min(1, 'At least 1').max(1000) });

export default function Exams() {
  const exams = useApi(['exams', 'mine'], () => listExams());
  const classes = useApi(['my-classes'], myClasses);
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ title: '', classId: '', subjectId: '', date: todayInput(), maxMarks: '100' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removing, setRemoving] = useState<Exam | null>(null);
  const subjects = classes.data?.find((c) => c.id === v.classId)?.subjects.map((s) => s.subject) ?? [];
  const create = useAction(() => createExam({ ...v, maxMarks: Number(v.maxMarks) }), { success: 'Exam created', invalidate: [['exams']], onSuccess: () => { setOpen(false); setV({ ...v, title: '' }); } });
  const remove = useAction(() => deleteExam(removing!.id), { success: 'Exam deleted', invalidate: [['exams']], onSuccess: () => setRemoving(null) });
  const submit = (e: FormEvent) => { e.preventDefault(); const errs = fieldErrors(schema, v); setErrors(errs); if (!Object.keys(errs).length) create.mutate(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1>Exams & marks</h1><button className="btn-primary" onClick={() => setOpen(true)}>Create exam</button></div>
      <div className="card p-0">
        <DataTable rows={exams.data} loading={exams.isLoading} rowKey={(e) => e.id} empty={{ title: 'No exams yet', hint: 'Create an exam to start entering marks.' }}
          columns={[{ key: 'title', header: 'Exam', sortValue: (e) => e.title, render: (e) => <span className="font-medium">{e.title}</span> }, { key: 'subject', header: 'Subject', render: (e) => e.subject.name }, { key: 'class', header: 'Class', render: (e) => e.class.name },
            { key: 'date', header: 'Date', sortValue: (e) => e.date, render: (e) => formatDate(e.date) }, { key: 'marks', header: 'Marks entered', render: (e) => e._count.marks },
            { key: 'published', header: 'Status', render: (e) => <Badge tone={e.published ? 'good' : 'neutral'}>{e.published ? 'Published' : 'Draft'}</Badge> },
            { key: 'actions', header: '', render: (e) => <div className="flex justify-end gap-2"><Link to={`/teacher/exams/${e.id}/marks`} className="btn-ghost py-1">Marks</Link><button className="btn-ghost py-1 text-bad" onClick={() => setRemoving(e)}>Delete</button></div> }]} />
      </div>
      <Modal open={open} title="Create exam" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {create.error && <p role="alert" className="text-sm text-bad">{create.error.message}</p>}
          <FormField label="Title" htmlFor="title" error={errors.title}><input id="title" className="input" value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Class" error={errors.classId}><Select value={v.classId} onChange={(x) => setV({ ...v, classId: x, subjectId: '' })} options={(classes.data ?? []).map((c) => ({ value: c.id, label: c.name }))} /></FormField>
            <FormField label="Subject" error={errors.subjectId} hint={v.classId && !subjects.length ? 'This class has no subjects yet' : undefined}><Select value={v.subjectId} onChange={(x) => setV({ ...v, subjectId: x })} options={subjects.map((s) => ({ value: s.id, label: s.name }))} disabled={!v.classId} /></FormField>
            <FormField label="Date" htmlFor="date" error={errors.date}><input id="date" type="date" className="input" value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} /></FormField>
            <FormField label="Maximum marks" htmlFor="max" error={errors.maxMarks}><input id="max" type="number" min={1} className="input" value={v.maxMarks} onChange={(e) => setV({ ...v, maxMarks: e.target.value })} /></FormField></div>
          <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" disabled={create.isPending}>{create.isPending ? 'Creating…' : 'Create exam'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={!!removing} title={`Delete ${removing?.title}?`} message="All marks entered for this exam are deleted too." confirmLabel="Delete exam" busy={remove.isPending} onConfirm={() => remove.mutate()} onCancel={() => setRemoving(null)} />
    </div>
  );
}
