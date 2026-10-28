import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { createClass, getClass, updateClass } from '../../../api/classes.api';
import { listGrades } from '../../../api/grades.api';
import { listSubjects } from '../../../api/subjects.api';
import { listUsers } from '../../../api/users.api';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Spinner from '../../../components/common/Spinner';
import FormField from '../../../components/forms/FormField';
import MultiSelect from '../../../components/forms/MultiSelect';
import Select from '../../../components/forms/Select';
import { useAction, useApi } from '../../../hooks/useApi';
import { fieldErrors } from '../../../utils/validators';

const schema = z.object({ name: z.string().trim().min(1, 'Enter a class name, e.g. 10-A'), gradeId: z.string().min(1, 'Choose a grade') });

export default function ClassForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const grades = useApi(['grades'], listGrades);
  const subjects = useApi(['subjects'], listSubjects);
  const teachers = useApi(['teacher-options'], () => listUsers({ role: 'TEACHER', active: 'true', limit: 100 }));
  const existing = useApi(['class', id], () => getClass(id), { enabled: mode === 'edit' });
  const [v, setV] = useState({ name: '', gradeId: '', teacherId: '' });
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const c = existing.data;
    if (c) { setV({ name: c.name, gradeId: c.gradeId, teacherId: c.teacherId ?? '' }); setSubjectIds(c.subjects.map((s) => s.subject.id)); }
  }, [existing.data]);

  const save = useAction(() => {
    const body = { name: v.name.trim(), gradeId: v.gradeId, teacherId: v.teacherId || null, subjectIds };
    return mode === 'create' ? createClass(body) : updateClass(id, body);
  }, { success: 'Class saved', invalidate: [['classes'], ['class', id]], onSuccess: () => nav('/admin/classes') });

  const submit = (e: FormEvent) => { e.preventDefault(); const errs = fieldErrors(schema, v); setErrors(errs); if (!Object.keys(errs).length) save.mutate(); };
  if (mode === 'edit' && existing.isLoading) return <Spinner />;
  return (
    <div className="max-w-2xl">
      <Breadcrumbs items={[{ label: 'Classes', to: '/admin/classes' }, { label: mode === 'create' ? 'Add class' : 'Edit class' }]} />
      <form onSubmit={submit} className="card space-y-4" noValidate>
        <h1>{mode === 'create' ? 'Add a class' : 'Edit class'}</h1>
        {save.error && <p role="alert" className="rounded-md bg-bad-light px-3 py-2 text-sm text-bad">{save.error.message}</p>}
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Class name" htmlFor="name" error={errors.name}><input id="name" className="input" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></FormField>
          <FormField label="Grade" error={errors.gradeId}><Select value={v.gradeId} onChange={(x) => setV({ ...v, gradeId: x })} options={(grades.data ?? []).map((g) => ({ value: g.id, label: g.name }))} /></FormField>
          <FormField label="Class teacher"><Select value={v.teacherId} onChange={(x) => setV({ ...v, teacherId: x })} placeholder="None yet" options={(teachers.data?.data ?? []).map((t) => ({ value: t.id, label: t.fullName }))} /></FormField>
        </div>
        <MultiSelect label="Subjects taught in this class" value={subjectIds} onChange={setSubjectIds} options={(subjects.data ?? []).map((s) => ({ value: s.id, label: s.name }))} />
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => nav(-1)}>Cancel</button><button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save class'}</button></div>
      </form>
    </div>
  );
}
