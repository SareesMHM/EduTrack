import { PageMeta } from '../../types/api';

export default function Pagination({ meta, onPage }: { meta?: PageMeta; onPage: (p: number) => void }) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-paper-line px-4 py-3 text-sm">
      <span className="text-ink-soft">Page {meta.page} of {meta.totalPages} · {meta.total} records</span>
      <div className="flex gap-2">
        <button className="btn-ghost" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>Previous</button>
        <button className="btn-ghost" disabled={meta.page >= meta.totalPages} onClick={() => onPage(meta.page + 1)}>Next</button>
      </div>
    </div>
  );
}
