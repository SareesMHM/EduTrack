import { ReactNode } from 'react';
import { useRole } from '../../hooks/useRole';
import { Role } from '../../types/user';

export default function RoleGuard({ roles, children, fallback = null }: { roles: Role[]; children: ReactNode; fallback?: ReactNode }) {
  const { is } = useRole();
  return <>{is(...roles) ? children : fallback}</>;
}
