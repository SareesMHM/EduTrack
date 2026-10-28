import { MarkRow } from '../../types/marks';
import { formatGrade } from '../../utils/formatGrade';
import { GRADE_STYLE } from '../../utils/constants';

export default function MarksGrid({ rows, max, values, onChange, readOnly }: {
  rows: MarkRow[]; max: number; values: Record<string, string>; onChange: (studentId: string, v: string) => void; readOnly?: boolean;
}) {
  return (
    <table className="w-full">
      <thead className="border-b border-paper-line bg-paper"><tr><th className="th">Student</th><th className="th w-40">Score / {max}</th><th className="th w-24">Grade</th></tr></thead>
      <tbody className="divide-y divide-paper-line">
        {rows.map((r) => {
          const raw = values[r.studentId] ?? '';
          const n = raw === '' ? NaN : Number(raw);
          const invalid = raw !== '' && (Number.isNaN(n) || n < 0 || n > max);
          const g = raw === '' || invalid ? '' : formatGrade(n, max);
          return (
            <tr key={r.studentId}>
              <td className="td font-medium">{r.fullName}</td>
              <td className="td">
                <input type="number" inputMode="decimal" min={0} max={max} step="0.5" className={`input w-28 ${invalid ? 'border-bad' : ''}`}
                  aria-label={`Score for ${r.fullName}`} aria-invalid={invalid} value={raw} disabled={readOnly}
                  onChange={(e) => onChange(r.studentId, e.target.value)} />
              </td>
              <td className="td">{g && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${GRADE_STYLE[g]}`}>{g}</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
