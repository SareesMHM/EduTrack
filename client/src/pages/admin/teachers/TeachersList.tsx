import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listTeachers } from '../../../api/teachers.api';
import { setUserStatus } from '../../../api/users.api';
import Badge from '../../../components/common/Badge';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import SearchBar from '../../../components/common/SearchBar';
import { useAction, useApi } from '../../../hooks/useApi';
import { usePagination } from '../../../hooks/usePagination';

export default function TeachersList() {
  const pg = usePagination();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const params = { page: pg.page, limit: pg.limit, q: q || undefined };
  const { data, isLoading } = useApi(['teachers', params], () => listTeachers(params));
  const toggle = useAction((v: { id: string; active: boolean }) => setUserStatus(v.id, v.active), { invalidate: [['teachers']], success: 'Status updated' });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1>Teachers</h1><Link to="/admin/teachers/new" className="btn-primary">Add teacher</Link></div>
      <SearchBar onSearch={(v) => { setQ(v); pg.reset(); }} placeholder="Search teachers" />
      <div className="card p-0">
        <DataTable rows={data?.data} loading={isLoading} rowKey={(t) => t.id} empty={{ title: 'No teachers found', hint: 'Add a teacher, then assign classes and subjects.' }}
          columns={[
            { key: 'fullName', header: 'Name', sortValue: (t) => t.fullName, render: (t) => <span className="font-medium">{t.fullName}</span> },
            { key: 'email', header: 'Email' }, { key: 'phone', header: 'Phone' },
            { key: 'status', header: 'Status', render: (t) => <Badge tone={t.isActive ? 'good' : 'warn'}>{t.isActive ? 'Active' : 'Archived'}</Badge> },
            { key: 'actions', header: '', render: (t) => (<div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <button className="btn-ghost py-1" onClick={() => nav(`/admin/teachers/${t.id}/edit`)}>Edit</button>
              <button className="btn-ghost py-1" onClick={() => toggle.mutate({ id: t.id, active: !t.isActive })}>{t.isActive ? 'Archive' : 'Restore'}</button></div>) },
          ]} />
        <Pagination meta={data?.meta} onPage={pg.setPage} />
      </div>
    </div>
  );
}
