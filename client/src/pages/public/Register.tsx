import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { listGrades } from '../../api/grades.api';
import FormField from '../../components/forms/FormField';
import Select from '../../components/forms/Select';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../types/api';
import { clean, fieldErrors, passwordRule } from '../../utils/validators';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email'),
  password: passwordRule,
  confirm: z.string(),
  parentPhone: z.string().regex(/^[0-9+\s-]{7,20}$/, 'Enter a valid phone number').optional().or(z.literal('')),
}).refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

const empty = { fullName: '', email: '', password: '', confirm: '', phone: '', gender: '', dateOfBirth: '', gradeId: '', parentName: '', parentPhone: '', parentNic: '', city: '', district: '' };

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const grades = useApi(['grades'], listGrades);
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof empty) => (val: string) => setV((x) => ({ ...x, [k]: val }));
  const text = (k: keyof typeof empty, type = 'text') => <input id={k} type={type} className="input" value={v[k]} onChange={(e) => set(k)(e.target.value)} />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = fieldErrors(schema, v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true); setFormError('');
    try {
      const { confirm, city, district, ...rest } = v; void confirm;
      await register({ ...(clean(rest) as any), address: clean({ city, district }) });
      nav('/student', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setErrors(Object.fromEntries(err.errors.map((i) => [i.path, i.message])));
      }
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <h1>Create a student account</h1>
      <p className="text-sm text-ink-soft">Teacher and admin accounts are created by your school administrator.</p>
      {formError && <p role="alert" className="rounded-md bg-bad-light px-3 py-2 text-sm text-bad">{formError}</p>}
      <FormField label="Full name" htmlFor="fullName" error={errors.fullName}>{text('fullName')}</FormField>
      <FormField label="Email" htmlFor="email" error={errors.email}>{text('email', 'email')}</FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Password" htmlFor="password" error={errors.password} hint="8+ characters with a letter and a number">{text('password', 'password')}</FormField>
        <FormField label="Confirm password" htmlFor="confirm" error={errors.confirm}>{text('confirm', 'password')}</FormField>
        <FormField label="Phone" htmlFor="phone">{text('phone', 'tel')}</FormField>
        <FormField label="Date of birth" htmlFor="dateOfBirth">{text('dateOfBirth', 'date')}</FormField>
        <FormField label="Gender"><Select value={v.gender} onChange={set('gender')} options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]} /></FormField>
        <FormField label="Grade"><Select value={v.gradeId} onChange={set('gradeId')} options={(grades.data ?? []).map((g) => ({ value: g.id, label: g.name }))} /></FormField>
        <FormField label="City" htmlFor="city">{text('city')}</FormField>
        <FormField label="District" htmlFor="district">{text('district')}</FormField>
      </div>
      <fieldset className="space-y-4 rounded-md border border-paper-line p-4">
        <legend className="px-1 text-sm font-medium text-ink-soft">Parent or guardian</legend>
        <FormField label="Name" htmlFor="parentName">{text('parentName')}</FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Phone" htmlFor="parentPhone" error={errors.parentPhone}>{text('parentPhone', 'tel')}</FormField>
          <FormField label="NIC number" htmlFor="parentNic">{text('parentNic')}</FormField>
        </div>
      </fieldset>
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      <p className="text-center text-sm">Already registered? <Link to="/login" className="text-brand">Sign in</Link></p>
    </form>
  );
}
