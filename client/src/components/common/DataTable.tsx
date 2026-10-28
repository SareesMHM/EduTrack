import { ReactNode, useMemo, useState } from 'react';
import EmptyState from './EmptyState';
import Spinner from './Spinner';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string;
  loading?: boolean;
  empty?: { title: string; hint?: string; action?: ReactNode };
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({ columns, rows, rowKey, loading, empty, onRowClick }: Props<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const sorted = useMemo(() => {
    if (!rows || !sort) return rows ?? [];
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => (col.sortValue!(a) > col.sortValue!(b) ? 1 : -1) * sort.dir);
  }, [rows, sort, columns]);

  if (loading) return <Spinner />;
  if (!sorted.length) return <EmptyState title={empty?.title ?? 'Nothing here yet'} hint={empty?.hint} action={empty?.action} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b border-paper-line bg-paper">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`th ${c.className ?? ''}`} aria-sort={sort?.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}>
                {c.sortValue ? (
                  <button onClick={() => setSort({ key: c.key, dir: sort?.key === c.key && sort.dir === 1 ? -1 : 1 })}>
                    {c.header}{sort?.key === c.key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}
                  </button>
                ) : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-line">
          {sorted.map((row) => (
            <tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'cursor-pointer hover:bg-paper' : undefined}>
              {columns.map((c) => <td key={c.key} className={`td ${c.className ?? ''}`}>{c.render ? c.render(row) : String((row as any)[c.key] ?? '—')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
