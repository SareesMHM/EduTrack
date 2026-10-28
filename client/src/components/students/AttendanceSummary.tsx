import { AttendanceSummaryData } from '../../types/student';
import GaugeChart from '../charts/GaugeChart';

export default function AttendanceSummary({ data }: { data: AttendanceSummaryData }) {
  const items: [string, number][] = [['Present', data.present], ['Late', data.late], ['Absent', data.absent], ['Excused', data.excused]];
  return (
    <div className="flex flex-wrap items-center gap-6">
      <GaugeChart value={data.percentage} />
      <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
        {items.map(([k, v]) => (<div key={k} className="flex justify-between gap-4"><dt className="text-ink-soft">{k}</dt><dd className="font-semibold tabular-nums">{v}</dd></div>))}
        <div className="col-span-2 mt-1 text-xs text-ink-faint">Excused days are not counted against attendance.</div>
      </dl>
    </div>
  );
}
