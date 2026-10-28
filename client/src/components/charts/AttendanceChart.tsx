import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function AttendanceChart({ data }: { data: { date: string; percentage: number | null }[] }) {
  const rows = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  return (
    <div className="h-64" role="img" aria-label="Attendance over the last seven days">
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ left: -16, right: 8, top: 8 }}>
          <CartesianGrid stroke="#DCE3E4" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <Tooltip formatter={(v: number) => [`${v}%`, 'Attendance']} />
          <Line type="monotone" dataKey="percentage" stroke="#12706B" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
