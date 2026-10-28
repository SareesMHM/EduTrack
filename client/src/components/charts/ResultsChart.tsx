import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS: Record<string, string> = { A: '#1F7A45', B: '#12706B', C: '#B7791F', D: '#C98A2B', F: '#B4381F' };

export default function ResultsChart({ distribution }: { distribution: Record<string, number> }) {
  const rows = ['A', 'B', 'C', 'D', 'F'].map((g) => ({ grade: g, count: distribution[g] ?? 0 }));
  return (
    <div className="h-64" role="img" aria-label="Grade distribution">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ left: -16, right: 8, top: 8 }}>
          <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [v, 'Results']} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>{rows.map((r) => <Cell key={r.grade} fill={COLORS[r.grade]} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
