import { FormEvent, useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../api/settings.api';
import { listUsers, setUserStatus, updateUser } from '../../api/users.api';
import Badge from '../../components/common/Badge';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import FormField from '../../components/forms/FormField';
import { useAction, useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { usePagination } from '../../hooks/usePagination';
import { Role } from '../../types/user';
import { ROLES } from '../../utils/constants';

export default function Settings() {
  const { user: me } = useAuth();
  const settings = useApi(['settings'], getSettings);
  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => { if (settings.data) setForm(settings.data); }, [settings.data]);
  const save = useAction(() => updateSettings(form), { success: 'Settings saved', invalidate: [['settings']] });

  const pg = usePagination(10);
  const [q, setQ] = useState('');
  const params = { page: pg.page, limit: pg.limit, q: q || undefined };
  const users = useApi(['users', params], () => listUsers(params));
  const setRole = useAction((v: { id: string; role: Role }) => updateUser(v.id, { role: v.role }), { success: 'Role updated', invalidate: [['users']] });
  const setActive = useAction((v: { id: string; active: boolean }) => setUserStatus(v.id, v.active), { success: 'Status updated', invalidate: [['users']] });
  const submit = (e: FormEvent) => { e.preventDefault(); save.mutate(); };
  const f = (k: string, label: string, type = 'text') => <FormField label={label} htmlFor={k}><input id={k} type={type} className="input" value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></FormField>;

  return (
    <div className="space-y-6">
      <h1>System settings</h1>
      <form onSubmit={submit} className="card grid max-w-3xl gap-4 sm:grid-cols-3">
        {f('schoolName', 'School name')}{f('academicYear', 'Academic year')}{f('lowAttendanceThreshold', 'Low attendance below (%)', 'number')}
        <div className="sm:col-span-3"><button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save settings'}</button></div>
      </form>
      <section className="card p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-line p-4"><div><h2>User roles and access</h2><p className="text-sm text-ink-soft">Changing a role takes effect the next time that person signs in.</p></div>
          <SearchBar onSearch={(v) => { setQ(v); pg.reset(); }} placeholder="Find a user" /></div>
        <DataTable rows={users.data?.data} loading={users.isLoading} rowKey={(u) => u.id}
          columns={[
            { key: 'fullName', header: 'Name', render: (u) => <span className="font-medium">{u.fullName}</span> }, { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role', render: (u) => u.id === me?.id ? <Badge tone="brand">{u.role.toLowerCase()} (you)</Badge> :
              <select className="input w-32 py-1" aria-label={`Role for ${u.fullName}`} value={u.role} onChange={(e) => setRole.mutate({ id: u.id, role: e.target.value as Role })}>{ROLES.map((r) => <option key={r} value={r}>{r.toLowerCase()}</option>)}</select> },
            { key: 'active', header: 'Access', render: (u) => u.id === me?.id ? <Badge tone="good">Active</Badge> : <button className="btn-ghost py-1" onClick={() => setActive.mutate({ id: u.id, active: !u.isActive })}>{u.isActive ? 'Disable' : 'Enable'}</button> },
          ]} />
        <Pagination meta={users.data?.meta} onPage={pg.setPage} />
      </section>
    </div>
  );
}
