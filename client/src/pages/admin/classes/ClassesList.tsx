import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteClass, listClasses, updateClass } from '../../../api/classes.api';
import { listUsers } from '../../../api/users.api';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import DataTable from '../../../components/common/DataTable';
import Modal from '../../../components/common/Modal';
import Select from '../../../components/forms/Select';
import { useAction, useApi } from '../../../hooks/useApi';
import { ClassItem } from '../../../types/class';

export default function ClassesList() {
  const nav = useNavigate();
  const { data, isLoading } = useApi(['classes'], () => listClasses());
  const teachers = useApi(['teacher-options'], () => listUsers({ role: 'TEACHER', active: 'true', limit: 100 }));
  const [assigning, setAssigning] = useState<ClassItem | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const [removing, setRemoving] = useState<ClassItem | null>(null);
  const assign = useAction(() => updateClass(assigning!.id, { teacherId: teacherId || null }), { success: 'Teacher assigned', invalidate: [['classes']], onSuccess: () => setAssigning(null) });
  const remove = useAction(() => deleteClass(removing!.id), { success: 'Class deleted', invalidate: [['classes']], onSuccess: () => setRemoving(null) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1>Classes</h1><Link to="/admin/classes/new" className="btn-primary">Add class</Link></div>
      <div className="card p-0">
        <DataTable rows={data} loading={isLoading} rowKey={(c) => c.id} empty={{ title: 'No classes yet', hint: 'Create a class, then assign a teacher and subjects.' }}
          columns={[
            { key: 'name', header: 'Class', sortValue: (c) => `${c.grade.name} ${c.name}`, render: (c) => <span className="font-medium">{c.grade.name} · {c.name}</span> },
            { key: 'teacher', header: 'Class teacher', render: (c) => c.teacher?.fullName ?? <span className="text-warn">Unassigned</span> },
            { key: 'students', header: 'Students', render: (c) => c._count.students },
            { key: 'subjects', header: 'Subjects', render: (c) => c.subjects.map((s) => s.subject.name).join(', ') || '—' },
            { key: 'actions', header: '', render: (c) => (<div className="flex justify-end gap-2">
              <button className="btn-ghost py-1" onClick={() => { setAssigning(c); setTeacherId(c.teacherId ?? ''); }}>Assign teacher</button>
              <button className="btn-ghost py-1" onClick={() => nav(`/admin/classes/${c.id}/edit`)}>Edit</button>
              <button className="btn-ghost py-1 text-bad" onClick={() => setRemoving(c)}>Delete</button></div>) },
          ]} />
      </div>
      <Modal open={!!assigning} title={`Class teacher for ${assigning?.name ?? ''}`} onClose={() => setAssigning(null)}>
        <Select value={teacherId} onChange={setTeacherId} placeholder="No teacher" options={(teachers.data?.data ?? []).map((t) => ({ value: t.id, label: t.fullName }))} aria-label="Teacher" />
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setAssigning(null)}>Cancel</button><button className="btn-primary" disabled={assign.isPending} onClick={() => assign.mutate()}>Save</button></div>
      </Modal>
      <ConfirmDialog open={!!removing} title="Delete this class?" message="Attendance and exams linked to the class are deleted too, and students become unassigned. This can’t be undone." confirmLabel="Delete class" busy={remove.isPending} onConfirm={() => remove.mutate()} onCancel={() => setRemoving(null)} />
    </div>
  );
}
