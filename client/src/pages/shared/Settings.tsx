import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { updateMe, uploadAvatar } from '../../api/auth.api';
import FileUpload from '../../components/forms/FileUpload';
import FormField from '../../components/forms/FormField';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../types/api';

export default function Settings() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<'profile' | 'security'>('profile');
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  if (!user) return null;

  const save = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { setUser(await updateMe({ fullName, phone: phone || undefined })); toast.success('Profile saved'); }
    catch (x) { toast.error(x instanceof ApiError ? x.message : 'Could not save'); } finally { setBusy(false); }
  };
  const upload = async (f: File) => {
    setUploading(true);
    try { setUser(await uploadAvatar(f)); toast.success('Photo updated'); } catch (x) { toast.error(x instanceof ApiError ? x.message : 'Upload failed'); } finally { setUploading(false); }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1>Account settings</h1>
      <div role="tablist" className="flex gap-1 border-b border-paper-line">
        {(['profile', 'security'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${tab === t ? 'border-brand text-brand' : 'border-transparent text-ink-soft'}`}>{t === 'profile' ? 'Profile' : 'Password'}</button>
        ))}
      </div>
      {tab === 'profile' ? (
        <form onSubmit={save} className="card space-y-4">
          <FileUpload current={user.profileImage} onSelect={upload} busy={uploading} />
          <FormField label="Full name" htmlFor="n"><input id="n" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} /></FormField>
          <FormField label="Email" hint="Ask an administrator to change your email."><input className="input" value={user.email} disabled /></FormField>
          <FormField label="Phone" htmlFor="p"><input id="p" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></FormField>
          <button className="btn-primary" disabled={busy || fullName.trim().length < 2}>{busy ? 'Saving…' : 'Save changes'}</button>
        </form>
      ) : (
        <div className="card space-y-3"><p className="text-sm text-ink-soft">Change your password regularly and never share it.</p><Link to="/settings/password" className="btn-primary">Change password</Link></div>
      )}
    </div>
  );
}
