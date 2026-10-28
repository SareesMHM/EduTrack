export interface ToastItem { id: string; type: 'success' | 'error'; message: string }

export default function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const tone = item.type === 'success' ? 'border-good bg-good-light text-good' : 'border-bad bg-bad-light text-bad';
  return (
    <div className={`flex items-start justify-between gap-3 rounded-md border-l-4 px-4 py-3 text-sm shadow ${tone}`}>
      <span>{item.message}</span>
      <button onClick={onClose} aria-label="Dismiss" className="font-bold leading-none">×</button>
    </div>
  );
}
