import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth.api';
import FormField from '../../components/forms/FormField';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../types/api';
import { fieldErrors, passwordRule } from '../../utils/validators';
import { z } from 'zod';

const schema = z.object({ password: passwordRule, confirm: z.string() }).refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

export default function ResetPassword() {
  const { token = '' } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [v, setV] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formErr, setFormErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = fieldErrors(schema, v); setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true); setFormErr('');
    try { await resetPassword(token, v.password); toast.success('Password updated. Sign in with your new password.'); nav('/login'); }
    catch (x) { setFormErr(x instanceof ApiError ? x.message : 'Try again'); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <h1>Choose a new password</h1>
      {formErr && <p role="alert" className="rounded-md bg-bad-light px-3 py-2 text-sm text-bad">{formErr} <Link to="/forgot-password" className="font-medium underline">Request a new link</Link></p>}
      <FormField label="New password" htmlFor="password" error={errors.password}><input id="password" type="password" autoComplete="new-password" className="input" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} /></FormField>
      <FormField label="Confirm new password" htmlFor="confirm" error={errors.confirm}><input id="confirm" type="password" autoComplete="new-password" className="input" value={v.confirm} onChange={(e) => setV({ ...v, confirm: e.target.value })} /></FormField>
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Saving…' : 'Save password'}</button>
    </form>
  );
}
