import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { changePassword } from '../../api/auth.api';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import FormField from '../../components/forms/FormField';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../types/api';
import { fieldErrors, passwordRule } from '../../utils/validators';

const schema = z.object({ currentPassword: z.string().min(1, 'Enter your current password'), newPassword: passwordRule, confirm: z.string() })
  .refine((v) => v.newPassword === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

export default function ChangePassword() {
  const toast = useToast();
  const [v, setV] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof v, label: string, auto: string) => (
    <FormField label={label} htmlFor={k} error={errors[k]}><input id={k} type="password" autoComplete={auto} className="input" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></FormField>
  );
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = fieldErrors(schema, v); setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try { await changePassword(v.currentPassword, v.newPassword); toast.success('Password changed'); setV({ currentPassword: '', newPassword: '', confirm: '' }); }
    catch (x) { toast.error(x instanceof ApiError ? x.message : 'Could not change password'); } finally { setBusy(false); }
  };
  return (
    <div className="max-w-md">
      <Breadcrumbs items={[{ label: 'Settings', to: '/settings' }, { label: 'Password' }]} />
      <form onSubmit={submit} className="card space-y-4" noValidate>
        <h1>Change password</h1>
        {field('currentPassword', 'Current password', 'current-password')}
        {field('newPassword', 'New password', 'new-password')}
        {field('confirm', 'Confirm new password', 'new-password')}
        <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
      </form>
    </div>
  );
}
