import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { createSubject, getSubject, updateSubject } from '../../../api/subjects.api';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import FormField from '../../../components/forms/FormField';
import { useAction, useApi } from '../../../hooks/useApi';
import { fieldErrors } from '../../../utils/validators';

const schema = z.object({ name: z.string().trim().min(2, 'Enter the subject name'), code: z.string().trim().regex(/^[A-Za-z0-9-]{2,12}$/, 'Use 2–12 letters, numbers or dashes') });

export default function SubjectForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const existing = useApi(['subject', id], () => getSubject(id), { enabled: mode === 'edit' });
  const [v, setV] = useState({ name: '', code: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => { if (existing.data) setV({ name: existing.data.name, code: existing.data.code }); }, [existing.data]);
  const save = useAction(() => (mode === 'create' ? createSubject(v) : updateSubject(id, v)), { success: 'Subject saved', invalidate: [['subjects']], onSuccess: () => nav('/admin/subjects') });
  const submit = (e: FormEvent) => { e.preventDefault(); const errs = fieldErrors(schema, v); setErrors(errs); if (!Object.keys(errs).length) save.mutate(); };
  return (
    <div className="max-w-md">
      <Breadcrumbs items={[{ label: 'Subjects', to: '/admin/subjects' }, { label: mode === 'create' ? 'Add subject' : 'Edit subject' }]} />
      <form onSubmit={submit} className="card space-y-4" noValidate>
        <h1>{mode === 'create' ? 'Add a subject' : 'Edit subject'}</h1>
        {save.error && <p role="alert" className="rounded-md bg-bad-light px-3 py-2 text-sm text-bad">{save.error.message}</p>}
        <FormField label="Name" htmlFor="name" error={errors.name}><input id="name" className="input" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></FormField>
        <FormField label="Code" htmlFor="code" error={errors.code} hint="Short and unique, e.g. MATH"><input id="code" className="input" value={v.code} onChange={(e) => setV({ ...v, code: e.target.value.toUpperCase() })} /></FormField>
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => nav(-1)}>Cancel</button><button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save subject'}</button></div>
      </form>
    </div>
  );
}
