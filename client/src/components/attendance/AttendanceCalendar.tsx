import { useState } from 'react';
import { AttendanceRecord } from '../../types/attendance';

const DOT: Record<string, string> = { PRESENT: 'bg-good text-white', LATE: 'bg-warn text-white', ABSENT: 'bg-bad text-white', EXCUSED: 'bg-ink-faint text-white' };

export default function AttendanceCalendar({ records }: { records: AttendanceRecord[] }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)); });
  const byDay = new Map(records.map((r) => [r.date.slice(0, 10), r.status]));
  const y = cursor.getUTCFullYear(), m = cursor.getUTCMonth();
  const lead = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const shift = (n: number) => setCursor(new Date(Date.UTC(y, m + n, 1)));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button className="btn-ghost py-1" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
        <h2>{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(cursor)}</h2>
        <button className="btn-ghost py-1" onClick={() => shift(1)} aria-label="Next month">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-soft">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: lead }).map((_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const key = new Date(Date.UTC(y, m, i + 1)).toISOString().slice(0, 10);
          const st = byDay.get(key);
          return (
            <div key={key} title={st ?? 'No record'} className={`flex aspect-square items-center justify-center rounded-md text-sm ${st ? DOT[st] : 'bg-paper text-ink-faint'}`}>{i + 1}</div>
          );
        })}
      </div>
      <ul className="mt-3 flex flex-wrap gap-3 text-xs text-ink-soft">
        {Object.keys(DOT).map((k) => <li key={k} className="flex items-center gap-1"><span className={`h-3 w-3 rounded ${DOT[k].split(' ')[0]}`} />{k[0] + k.slice(1).toLowerCase()}</li>)}
      </ul>
    </div>
  );
}
