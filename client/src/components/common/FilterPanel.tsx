import { ReactNode, useState } from 'react';

export default function FilterPanel({ children, activeCount = 0 }: { children: ReactNode; activeCount?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="btn-ghost" aria-expanded={open} onClick={() => setOpen(!open)}>
        Filters{activeCount ? ` (${activeCount})` : ''}
      </button>
      {open && <div className="mt-3 grid gap-3 rounded-md border border-paper-line bg-paper-raised p-4 sm:grid-cols-3">{children}</div>}
    </div>
  );
}
