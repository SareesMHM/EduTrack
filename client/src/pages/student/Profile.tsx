import { FormEvent, useEffect, useState } from 'react';
import { myProfile, updateMyContact } from '../../api/students.api';
import { uploadAvatar } from '../../api/auth.api';
import Spinner from '../../components/common/Spinner';
import FileUpload from '../../components/forms/FileUpload';
import FormField from '../../components/forms/FormField';
import { useAction, useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import { clean } from '../../utils/validators';

export default function Profile() {
  const { setUser } = useAuth();
  const { data: s, isLoading } = useApi(['me', 'profile'], myProfile);
  const [v, setV] = useState({ phone: '', number: '', street: '', city: '', district: '', postalCode: '' });
  useEffect(() => { if (s) setV({ phone: s.phone ?? '', number: s.address?.number ?? '', street: s.address?.street ?? '', city: s.address?.city ?? '', district: s.address?.district ?? '', postalCode: s.address?.postalCode ?? '' }); }, [s]);
  const save = useAction(() => { const { phone, ...addr } = v; return updateMyContact({ phone: phone || undefined, address: clean(addr) }); }, { success: 'Contact details saved', invalidate: [['me', 'profile']], onSuccess: (u) => setUser(u) });
  const photo = useAction((f: File) => uploadAvatar(f), { success: 'Photo updated', invalidate: [['me', 'profile']], onSuccess: (u) => setUser(u) });
  if (isLoading || !s) return <Spinner />;
  const t = (k: keyof typeof v, label: string) => <FormField label={label} htmlFor={k}><input id={k} className="input" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></FormField>;
  const submit = (e: FormEvent) => { e.preventDefault(); save.mutate(); };
  return (
    <div className="max-w-2xl space-y-4"><h1>My profile</h1>
      <section className="card space-y-3"><FileUpload current={s.profileImage} onSelect={(f) => photo.mutate(f)} busy={photo.isPending} />
        <dl className="grid gap-2 text-sm sm:grid-cols-2">{([['Name', s.fullName], ['Email', s.email], ['Class', s.class ? `${s.class.grade.name} · ${s.class.name}` : '—'], ['Date of birth', formatDate(s.dateOfBirth)], ['Guardian', s.parentName ?? '—']] as const).map(([k, x]) => <div key={k}><dt className="text-ink-soft">{k}</dt><dd className="font-medium">{x}</dd></div>)}</dl>
        <p className="text-xs text-ink-faint">To correct your name, email, class or guardian details, ask the school office.</p></section>
      <form onSubmit={submit} className="card space-y-4"><h2>Contact details</h2>
        <div className="grid gap-4 sm:grid-cols-2">{t('phone', 'Phone')}{t('number', 'House number')}{t('street', 'Street')}{t('city', 'City')}{t('district', 'District')}{t('postalCode', 'Postal code')}</div>
        <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save contact details'}</button></form>
    </div>
  );
}
