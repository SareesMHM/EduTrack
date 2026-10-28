import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.api';
import FormField from '../../components/forms/FormField';
import { ApiError } from '../../types/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await forgotPassword(email); setSent(true); } catch (x) { setErr(x instanceof ApiError ? x.message : 'Try again'); } finally { setBusy(false); }
  };

  if (sent) return (
    <div className="space-y-3"><h1>Check your email</h1>
      <p className="text-sm text-ink-soft">If <strong>{email}</strong> is registered, we’ve sent a link that’s valid for 30 minutes.</p>
      <Link to="/login" className="btn-ghost w-full">Back to sign in</Link></div>
  );
  return (
    <form onSubmit={submit} className="space-y-4">
      <h1>Reset your password</h1>
      <p className="text-sm text-ink-soft">Enter your account email and we’ll send a reset link.</p>
      {err && <p role="alert" className="text-sm text-bad">{err}</p>}
      <FormField label="Email" htmlFor="email"><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required /></FormField>
      <button className="btn-primary w-full" disabled={busy || !email}>{busy ? 'Sending…' : 'Send reset link'}</button>
      <Link to="/login" className="block text-center text-sm text-brand">Back to sign in</Link>
    </form>
  );
}
