import { ReactNode } from 'react';

export default function StatCard({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: 'warn' | 'bad' }) {
  const color = tone === 'bad' ? 'text-bad' : tone === 'warn' ? 'text-warn' : 'text-ink';
  return (
    <div className="card">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
