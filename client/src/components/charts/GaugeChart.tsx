export default function GaugeChart({ value, label = 'Attendance', threshold = 75 }: { value: number; label?: string; threshold?: number }) {
  const r = 52, c = 2 * Math.PI * r, pct = Math.max(0, Math.min(100, value));
  const color = pct < threshold ? '#B4381F' : pct < 90 ? '#B7791F' : '#1F7A45';
  return (
    <figure className="flex flex-col items-center" aria-label={`${label} ${pct}%`}>
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#DCE3E4" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <figcaption className="-mt-[4.6rem] mb-8 text-center"><span className="text-2xl font-bold tabular-nums">{pct}%</span><br /><span className="text-xs text-ink-soft">{label}</span></figcaption>
    </figure>
  );
}
