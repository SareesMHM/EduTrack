import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { listClasses } from '../../../api/classes.api';
import { listGrades } from '../../../api/grades.api';
import { getStudent, updateStudent } from '../../../api/students.api';
import { createUser } from '../../../api/users.api';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Spinner from '../../../components/common/Spinner';
import FormField from '../../../components/forms/FormField';
import Select from '../../../components/forms/Select';
import { useAction, useApi } from '../../../hooks/useApi';
import { ApiError } from '../../../types/api';
import { toInputDate } from '../../../utils/formatDate';
import { clean, fieldErrors, passwordRule } from '../../../utils/validators';

const base = { fullName: z.string().trim().min(2, 'Enter the full name') };
const createSchema = z.object({ ...base, email: z.string().trim().email('Enter a valid email'), password: passwordRule });
const editSchema = z.object(base);

const blank = { fullName: '', email: '', password: '', phone: '', gender: '', dateOfBirth: '', gradeId: '', classId: '', parentName: '', parentPhone: '', parentNic: '', number: '', street: '', city: '', district: '', postalCode: '' };

export default function StudentForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const grades = useApi(['grades'], listGrades);
  const classes = useApi(['classes'], () => listClasses());
  const existing = useApi(['student', id], () => getStudent(id), { enabled: mode === 'edit' });
  const [v, setV] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const s = existing.data;
    if (!s) return;
    setV({ ...blank, fullName: s.fullName, email: s.email, phone: s.phone ?? '', gender: s.gender ?? '', dateOfBirth: toInputDate(s.dateOfBirth), gradeId: s.gradeId ?? '', classId: s.classId ?? '',
      parentName: s.parentName ?? '', parentPhone: s.parentPhone ?? '', parentNic: s.parentNic ?? '', number: s.address?.number ?? '', street: s.address?.street ?? '', city: s.address?.city ?? '', district: s.address?.district ?? '', postalCode: s.address?.postalCode ?? '' });
  }, [existing.data]);

  const save = useAction(async () => {
    const { number, street, city, district, postalCode, password, email, classId, ...rest } = v;
    const address = clean({ number, street, city, district, postalCode });
    if (mode === 'create') return createUser({ ...clean(rest), email, password, role: 'STUDENT', classId: classId || undefined, address });
    return updateStudent(id, { ...clean({ ...rest, dateOfBirth: rest.dateOfBirth || undefined }), address });
  }, { success: mode === 'create' ? 'Student added' : 'Student saved', invalidate: [['students'], ['student', id]], onSuccess: () => nav('/admin/students') });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = fieldErrors(mode === 'create' ? createSchema : editSchema, v);
    setErrors(errs);
    if (!Object.keys(errs).length) save.mutate();
  };
  const serverErr = save.error instanceof ApiError ? save.error : null;
  const t = (k: keyof typeof blank, type = 'text') => <input id={k} type={type} className="input" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />;
  const sel = (k: 'gender' | 'gradeId' | 'classId', options: { value: string; label: string }[], ph: string) => <Select value={v[k]} onChange={(x) => setV({ ...v, [k]: x })} options={options} placeholder={ph} />;

  if (mode === 'edit' && existing.isLoading) return <Spinner />;
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: 'Students', to: '/admin/students' }, { label: mode === 'create' ? 'Add student' : 'Edit student' }]} />
      <form onSubmit={submit} className="card space-y-6" noValidate>
        <h1>{mode === 'create' ? 'Add a student' : `Edit ${existing.data?.fullName ?? 'student'}`}</h1>
        {serverErr && <p role="alert" className="rounded-md bg-bad-light px-3 py-2 text-sm text-bad">{serverErr.message}</p>}
        <section className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="fullName" error={errors.fullName}>{t('fullName')}</FormField>
          <FormField label="Email" htmlFor="email" error={errors.email} hint={mode === 'edit' ? 'Email can’t be changed here' : undefined}>
            <input id="email" type="email" className="input" value={v.email} disabled={mode === 'edit'} onChange={(e) => setV({ ...v, email: e.target.value })} /></FormField>
          {mode === 'create' && <FormField label="Temporary password" htmlFor="password" error={errors.password} hint="Ask the student to change it after signing in">{t('password', 'password')}</FormField>}
          <FormField label="Phone" htmlFor="phone">{t('phone', 'tel')}</FormField>
          <FormField label="Date of birth" htmlFor="dateOfBirth">{t('dateOfBirth', 'date')}</FormField>
          <FormField label="Gender">{sel('gender', [{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }], 'Not set')}</FormField>
          <FormField label="Grade">{sel('gradeId', (grades.data ?? []).map((g) => ({ value: g.id, label: g.name })), 'Not set')}</FormField>
          {mode === 'create' && <FormField label="Class">{sel('classId', (classes.data ?? []).map((c) => ({ value: c.id, label: `${c.grade.name} · ${c.name}` })), 'Not assigned')}</FormField>}
        </section>
        <fieldset className="space-y-4 rounded-md border border-paper-line p-4"><legend className="px-1 text-sm font-medium text-ink-soft">Parent or guardian</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Name" htmlFor="parentName">{t('parentName')}</FormField>
            <FormField label="Phone" htmlFor="parentPhone">{t('parentPhone', 'tel')}</FormField>
            <FormField label="NIC number" htmlFor="parentNic">{t('parentNic')}</FormField>
          </div></fieldset>
        <fieldset className="space-y-4 rounded-md border border-paper-line p-4"><legend className="px-1 text-sm font-medium text-ink-soft">Address</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Number" htmlFor="number">{t('number')}</FormField>
            <FormField label="Street" htmlFor="street">{t('street')}</FormField>
            <FormField label="City" htmlFor="city">{t('city')}</FormField>
            <FormField label="District" htmlFor="district">{t('district')}</FormField>
            <FormField label="Postal code" htmlFor="postalCode">{t('postalCode')}</FormField>
          </div></fieldset>
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => nav(-1)}>Cancel</button>
          <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : mode === 'create' ? 'Add student' : 'Save changes'}</button></div>
      </form>
    </div>
  );
}
