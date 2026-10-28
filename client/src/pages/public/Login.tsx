import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormField from '../../components/forms/FormField';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../types/api';
import { HOME_BY_ROLE } from '../../utils/constants';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const u = await login({ email, password });
      nav(from && from.startsWith(`/${u.role.toLowerCase()}`) ? from : HOME_BY_ROLE[u.role], { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in');
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <h1>Sign in</h1>
      {error && <p role="alert" className="rounded-md bg-bad-light px-3 py-2 text-sm text-bad">{error}</p>}
      <FormField label="Email" htmlFor="email"><input id="email" type="email" autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required /></FormField>
      <FormField label="Password" htmlFor="password"><input id="password" type="password" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required /></FormField>
      <button className="btn-primary w-full" disabled={busy || !email || !password}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <p className="flex justify-between text-sm"><Link to="/forgot-password" className="text-brand">Forgot password?</Link><Link to="/register" className="text-brand">Create student account</Link></p>
    </form>
  );
}
