import { listNotifications, markAllRead, markRead } from '../../api/notifications.api';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import { useAction, useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/formatDate';

export default function Notifications() {
  const { data, isLoading } = useApi(['notifications'], listNotifications);
  const read = useAction((id: string) => markRead(id), { invalidate: [['notifications']] });
  const all = useAction(() => markAllRead(), { invalidate: [['notifications']], success: 'All notices marked as read' });
  if (isLoading) return <Spinner />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1>Notices</h1>
        <button className="btn-ghost" disabled={!data?.some((n) => !n.read)} onClick={() => all.mutate()}>Mark all as read</button></div>
      <div className="card p-0">
        {!data?.length ? <EmptyState title="No notices yet" hint="You’ll see new published results here." /> : (
          <ul className="divide-y divide-paper-line">
            {data.map((n) => (
              <li key={n.id} className={`flex items-start justify-between gap-4 px-5 py-4 ${n.read ? '' : 'bg-brand-light/40'}`}>
                <div><p className="font-semibold">{n.title}</p><p className="text-sm text-ink-soft">{n.body}</p><p className="mt-1 text-xs text-ink-faint">{formatDate(n.createdAt)}</p></div>
                {!n.read && <button className="btn-ghost shrink-0 py-1" onClick={() => read.mutate(n.id)}>Mark read</button>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
