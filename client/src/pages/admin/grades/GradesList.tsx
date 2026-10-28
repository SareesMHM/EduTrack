import { FormEvent, useState } from 'react';
import { createGrade, deleteGrade, listGrades, updateGrade } from '../../../api/grades.api';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import DataTable from '../../../components/common/DataTable';
import { useAction, useApi } from '../../../hooks/useApi';
import { Grade } from '../../../types/subject';

export default function GradesList() {
  const { data, isLoading } = useApi(['grades'], listGrades);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [removing, setRemoving] = useState<Grade | null>(null);
  const add = useAction(() => createGrade(name.trim()), { success: 'Grade added', invalidate: [['grades']], onSuccess: () => setName('') });
  const rename = useAction(() => updateGrade(editing!.id, editing!.name.trim()), { success: 'Grade renamed', invalidate: [['grades']], onSuccess: () => setEditing(null) });
  const remove = useAction(() => deleteGrade(removing!.id), { success: 'Grade deleted', invalidate: [['grades']], onSuccess: () => setRemoving(null) });
  const submit = (e: FormEvent) => { e.preventDefault(); if (name.trim()) add.mutate(); };
  return (
    <div className="max-w-3xl space-y-4">
      <h1>Grades</h1>
      <form onSubmit={submit} className="card flex gap-2"><label className="sr-only" htmlFor="g">New grade name</label>
        <input id="g" className="input" placeholder="New grade, e.g. Grade 12" value={name} onChange={(e) => setName(e.target.value)} /><button className="btn-primary shrink-0" disabled={!name.trim() || add.isPending}>Add grade</button></form>
      <div className="card p-0">
        <DataTable rows={data} loading={isLoading} rowKey={(g) => g.id} empty={{ title: 'No grades yet', hint: 'Add the grades your school teaches.' }}
          columns={[
            { key: 'name', header: 'Grade', sortValue: (g) => g.name, render: (g) => editing?.id === g.id
              ? <input className="input max-w-xs" autoFocus aria-label="Grade name" value={editing.name} onChange={(e) => setEditing({ id: g.id, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && rename.mutate()} />
              : <span className="font-medium">{g.name}</span> },
            { key: 'students', header: 'Students', render: (g) => g._count?.students ?? 0 },
            { key: 'classes', header: 'Classes', render: (g) => g._count?.classes ?? 0 },
            { key: 'actions', header: '', render: (g) => (<div className="flex justify-end gap-2">
              {editing?.id === g.id ? (<><button className="btn-primary py-1" onClick={() => rename.mutate()} disabled={!editing.name.trim()}>Save</button><button className="btn-ghost py-1" onClick={() => setEditing(null)}>Cancel</button></>)
                : (<><button className="btn-ghost py-1" onClick={() => setEditing({ id: g.id, name: g.name })}>Rename</button><button className="btn-ghost py-1 text-bad" onClick={() => setRemoving(g)}>Delete</button></>)}</div>) },
          ]} />
      </div>
      <ConfirmDialog open={!!removing} title={`Delete ${removing?.name}?`} message="A grade that still has classes can’t be deleted. Move or delete those classes first." confirmLabel="Delete grade" busy={remove.isPending} onConfirm={() => remove.mutate()} onCancel={() => setRemoving(null)} />
    </div>
  );
}
