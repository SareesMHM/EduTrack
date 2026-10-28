import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { listClasses } from '../../../api/classes.api';
import { listSubjects } from '../../../api/subjects.api';
import { assignClasses, assignSubjects, getTeacher, updateTeacher } from '../../../api/teachers.api';
import { createUser } from '../../../api/users.api';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Spinner from '../../../components/common/Spinner';
import FormField from '../../../components/forms/FormField';
import MultiSelect from '../../../components/forms/MultiSelect';
import { useAction, useApi } from '../../../hooks/useApi';
import { clean, fieldErrors, passwordRule } from '../../../utils/validators';

const createSchema = z.object({ fullName: z.string().trim().min(2, 'Enter the full name'), email: z.string().trim().email('Enter a valid email'), password: passwordRule });
const editSchema = z.object({ fullName: z.string().trim().min(2, 'Enter the full name') });

export default function TeacherForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const classes = useApi(['classes'], () => listClasses());
  const subjects = useApi(['subjects'], listSubjects);
  const existing = useApi(['teacher', id], () => getTeacher(id), { enabled: mode === 'edit' });
  const [v, setV] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [classIds, setClassIds] = useState<string[]>([]);
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const t = existing.data;
    if (!t) return;
    setV({ fullName: t.fullName, email: t.email, password: '', phone: t.phone ?? '' });
    setClassIds(t.classes.map((c) => c.id)); setSubjectIds(t.subjects.map((s) => s.id));
  }, [existing.data]);

  const save = useAction(async () => {
    let teacherId = id;
    if (mode === 'create') teacherId = (await createUser({ ...clean(v), role: 'TEACHER' })).id;
    else await updateTeacher(id, { fullName: v.fullName, phone: v.phone || undefined });
    await assignClasses(teacherId, classIds);
    await assignSubjects(teacherId, subjectIds);
  }, { success: 'Teacher saved', invalidate: [['teachers'], ['teacher', id], ['classes']], onSuccess: () => nav('/admin/teachers') });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = fieldErrors(mode === 'create' ? createSchema : editSchema, v); setErrors(errs);
    if (!Object.keys(errs).length) save.mutate();
  };
  if (mode === 'edit' && existing.isLoading) return <Spinner />;
  return (
    <div className="max-w-2xl">
      <Breadcrumbs items={[{ label: 'Teachers', to: '/admin/teachers' }, { label: mode === 'create' ? 'Add teacher' : 'Edit teacher' }]} />
      <form onSubmit={submit} className="card space-y-4" noValidate>
        <h1>{mode === 'create' ? 'Add a teacher' : `Edit ${existing.data?.fullName ?? 'teacher'}`}</h1>
        {save.error && <p role="alert" className="rounded-md bg-bad-light px-3 py-2 text-sm text-bad">{save.error.message}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="fn" error={errors.fullName}><input id="fn" className="input" value={v.fullName} onChange={(e) => setV({ ...v, fullName: e.target.value })} /></FormField>
          <FormField label="Phone" htmlFor="ph"><input id="ph" className="input" value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /></FormField>
          <FormField label="Email" htmlFor="em" error={errors.email}><input id="em" type="email" className="input" disabled={mode === 'edit'} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /></FormField>
          {mode === 'create' && <FormField label="Temporary password" htmlFor="pw" error={errors.password}><input id="pw" type="password" className="input" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} /></FormField>}
        </div>
        <MultiSelect label="Classes they teach" value={classIds} onChange={setClassIds} options={(classes.data ?? []).map((c) => ({ value: c.id, label: `${c.grade.name} · ${c.name}` }))} />
        <MultiSelect label="Subjects" value={subjectIds} onChange={setSubjectIds} options={(subjects.data ?? []).map((s) => ({ value: s.id, label: s.name }))} />
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => nav(-1)}>Cancel</button><button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save teacher'}</button></div>
      </form>
    </div>
  );
}
