import { ReactNode, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { listNotifications } from '../api/notifications.api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

export interface NavItem { to: string; label: string; end?: boolean }

export default function AppShell({ nav, home, title }: { nav: NavItem[]; home: string; title: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const notices = useApi(['notifications'], listNotifications, { staleTime: 30000 });
  const unread = notices.data?.filter((n) => !n.read).length ?? 0;

  const link = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`;

  const sidebar: ReactNode = (
    <nav aria-label={`${title} navigation`} className="flex h-full flex-col gap-1 p-4">
      <Link to={home} className="mb-4 flex items-center gap-2 px-2 text-lg font-bold text-white">
        <img src="/favicon.svg" alt="" className="h-7 w-7" /> EduTrack
      </Link>
      {nav.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={link} onClick={() => setOpen(false)}>{n.label}</NavLink>)}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden bg-shelf lg:block">{sidebar}</aside>
      {open && <div className="fixed inset-0 z-30 bg-shelf/60 lg:hidden" onClick={() => setOpen(false)}><aside className="h-full w-60 bg-shelf" onClick={(e) => e.stopPropagation()}>{sidebar}</aside></div>}
      <div className="flex min-w-0 flex-col">
        <header className="no-print flex items-center justify-between border-b border-paper-line bg-paper-raised px-4 py-3">
          <button className="btn-ghost lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">Menu</button>
          <p className="hidden text-sm text-ink-soft lg:block">{title}</p>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative btn-ghost py-1.5" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}>
              Notices{unread > 0 && <span className="ml-1 rounded-full bg-bad px-1.5 text-xs font-bold text-white">{unread}</span>}
            </Link>
            <Link to="/settings" className="flex items-center gap-2 text-sm font-medium">
              {user?.profileImage ? <img src={user.profileImage} alt="" className="h-8 w-8 rounded-full object-cover" /> :
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light font-bold text-brand-dark">{user?.fullName[0]}</span>}
              <span className="hidden sm:inline">{user?.fullName}</span>
            </Link>
            <button className="btn-ghost py-1.5" onClick={async () => { await logout(); navigate('/login'); }}>Sign out</button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
