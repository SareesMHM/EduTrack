import { AttendanceStatus } from '../../types/attendance';
import { RosterStudent } from '../../types/class';

const OPTIONS: { value: AttendanceStatus; label: string; on: string }[] = [
  { value: 'PRESENT', label: 'Present', on: 'bg-good text-white' },
  { value: 'LATE', label: 'Late', on: 'bg-warn text-white' },
  { value: 'ABSENT', label: 'Absent', on: 'bg-bad text-white' },
  { value: 'EXCUSED', label: 'Excused', on: 'bg-ink-soft text-white' },
];

export default function AttendanceSheet({ students, value, onChange }: {
  students: RosterStudent[]; value: Record<string, AttendanceStatus>; onChange: (v: Record<string, AttendanceStatus>) => void;
}) {
  const setAll = (s: AttendanceStatus) => onChange(Object.fromEntries(students.map((x) => [x.id, s])));
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-paper-line px-4 py-3 text-sm">
        <span className="text-ink-soft">Mark everyone:</span>
        <button type="button" className="btn-ghost py-1" onClick={() => setAll('PRESENT')}>Present</button>
        <button type="button" className="btn-ghost py-1" onClick={() => setAll('ABSENT')}>Absent</button>
      </div>
      <ul className="divide-y divide-paper-line">
        {students.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
            <span className="font-medium">{s.fullName}</span>
            <div role="radiogroup" aria-label={`Attendance for ${s.fullName}`} className="flex gap-1">
              {OPTIONS.map((o) => {
                const on = value[s.id] === o.value;
                return (
                  <button key={o.value} type="button" role="radio" aria-checked={on}
                    onClick={() => onChange({ ...value, [s.id]: o.value })}
                    className={`rounded-md border px-3 py-1 text-sm ${on ? `${o.on} border-transparent` : 'border-paper-line bg-paper-raised text-ink-soft hover:bg-paper'}`}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
