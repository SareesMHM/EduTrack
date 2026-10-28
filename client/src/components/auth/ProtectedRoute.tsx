import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/user';

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Spinner label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
