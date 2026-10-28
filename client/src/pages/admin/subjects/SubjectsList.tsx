import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteSubject, listSubjects } from '../../../api/subjects.api';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import DataTable from '../../../components/common/DataTable';
import { useAction, useApi } from '../../../hooks/useApi';
import { Subject } from '../../../types/subject';

export default function SubjectsList() {
  const nav = useNavigate();
  const { data, isLoading } = useApi(['subjects'], listSubjects);
  const [removing, setRemoving] = useState<Subject | null>(null);
  const remove = useAction(() => deleteSubject(removing!.id), { success: 'Subject deleted', invalidate: [['subjects']], onSuccess: () => setRemoving(null) });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1>Subjects</h1><Link to="/admin/subjects/new" className="btn-primary">Add subject</Link></div>
      <div className="card p-0">
        <DataTable rows={data} loading={isLoading} rowKey={(s) => s.id} empty={{ title: 'No subjects yet', action: <Link to="/admin/subjects/new" className="btn-primary">Add subject</Link> }}
          columns={[
            { key: 'name', header: 'Name', sortValue: (s) => s.name, render: (s) => <span className="font-medium">{s.name}</span> },
            { key: 'code', header: 'Code', sortValue: (s) => s.code },
            { key: 'actions', header: '', render: (s) => (<div className="flex justify-end gap-2"><button className="btn-ghost py-1" onClick={() => nav(`/admin/subjects/${s.id}/edit`)}>Edit</button><button className="btn-ghost py-1 text-bad" onClick={() => setRemoving(s)}>Delete</button></div>) },
          ]} />
      </div>
      <ConfirmDialog open={!!removing} title={`Delete ${removing?.name}?`} message="Subjects already used by exams can’t be deleted. Remove those exams first." confirmLabel="Delete subject" busy={remove.isPending} onConfirm={() => remove.mutate()} onCancel={() => setRemoving(null)} />
    </div>
  );
}
