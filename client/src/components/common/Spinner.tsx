export default function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-8 text-ink-soft" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper-line border-t-brand" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
