import { Link } from 'react-router-dom';
import { Student } from '../../types/student';
import Badge from '../common/Badge';

export default function StudentCard({ s, to }: { s: Student; to?: string }) {
  const body = (
    <div className="flex items-center gap-3">
      {s.profileImage ? <img src={s.profileImage} alt="" className="h-12 w-12 rounded-full object-cover" /> :
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light font-bold text-brand-dark">{s.fullName[0]}</div>}
      <div>
        <p className="font-semibold">{s.fullName}</p>
        <p className="text-sm text-ink-soft">{s.class ? `${s.class.grade.name} · ${s.class.name}` : 'No class'}</p>
      </div>
      {!s.isActive && <Badge tone="warn">Archived</Badge>}
    </div>
  );
  return to ? <Link to={to} className="card block hover:border-brand">{body}</Link> : <div className="card">{body}</div>;
}
