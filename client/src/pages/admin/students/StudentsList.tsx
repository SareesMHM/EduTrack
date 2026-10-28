import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listClasses } from '../../../api/classes.api';
import { listGrades } from '../../../api/grades.api';
import { exportStudents } from '../../../api/reports.api';
import { listStudents } from '../../../api/students.api';
import FilterPanel from '../../../components/common/FilterPanel';
import Pagination from '../../../components/common/Pagination';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/forms/Select';
import StudentTable from '../../../components/students/StudentTable';
import { useApi } from '../../../hooks/useApi';
import { usePagination } from '../../../hooks/usePagination';

export default function StudentsList() {
  const pg = usePagination();
  const [q, setQ] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [classId, setClassId] = useState('');
  const [active, setActive] = useState('');
  const grades = useApi(['grades'], listGrades);
  const classes = useApi(['classes'], () => listClasses());
  const params = { page: pg.page, limit: pg.limit, q: q || undefined, gradeId: gradeId || undefined, classId: classId || undefined, active: active || undefined };
  const { data, isLoading } = useApi(['students', params], () => listStudents(params));
  const reset = <T,>(set: (v: T) => void) => (v: T) => { set(v); pg.reset(); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1>Students</h1>
        <div className="flex gap-2"><button className="btn-ghost" onClick={() => exportStudents()}>Export CSV</button><Link to="/admin/students/new" className="btn-primary">Add student</Link></div>
      </div>
      <div className="flex flex-wrap items-start gap-3">
        <SearchBar onSearch={reset(setQ)} placeholder="Search by name or email" />
        <FilterPanel activeCount={[gradeId, classId, active].filter(Boolean).length}>
          <Select value={gradeId} onChange={reset(setGradeId)} placeholder="Any grade" options={(grades.data ?? []).map((g) => ({ value: g.id, label: g.name }))} aria-label="Grade" />
          <Select value={classId} onChange={reset(setClassId)} placeholder="Any class" options={(classes.data ?? []).map((c) => ({ value: c.id, label: `${c.grade.name} · ${c.name}` }))} aria-label="Class" />
          <Select value={active} onChange={reset(setActive)} placeholder="Active and archived" options={[{ value: 'true', label: 'Active only' }, { value: 'false', label: 'Archived only' }]} aria-label="Status" />
        </FilterPanel>
      </div>
      <div className="card p-0"><StudentTable rows={data?.data} loading={isLoading} basePath="/admin/students" /><Pagination meta={data?.meta} onPage={pg.setPage} /></div>
    </div>
  );
}
