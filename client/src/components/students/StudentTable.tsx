import { useNavigate } from 'react-router-dom';
import { Student } from '../../types/student';
import Badge from '../common/Badge';
import DataTable from '../common/DataTable';

export default function StudentTable({ rows, loading, basePath }: { rows?: Student[]; loading?: boolean; basePath: string }) {
  const nav = useNavigate();
  return (
    <DataTable
      rows={rows} loading={loading} rowKey={(s) => s.id} onRowClick={(s) => nav(`${basePath}/${s.id}`)}
      empty={{ title: 'No students match', hint: 'Try a different search or clear the filters.' }}
      columns={[
        { key: 'fullName', header: 'Name', sortValue: (s) => s.fullName, render: (s) => <span className="font-medium">{s.fullName}</span> },
        { key: 'email', header: 'Email' },
        { key: 'class', header: 'Class', render: (s) => (s.class ? `${s.class.grade.name} · ${s.class.name}` : '—') },
        { key: 'status', header: 'Status', render: (s) => <Badge tone={s.isActive ? 'good' : 'warn'}>{s.isActive ? 'Active' : 'Archived'}</Badge> },
      ]}
    />
  );
}
