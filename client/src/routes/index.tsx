import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import Forbidden from '../pages/errors/Forbidden';
import NotFound from '../pages/errors/NotFound';
import ServerError from '../pages/errors/ServerError';
import ChangePassword from '../pages/shared/ChangePassword';
import Notifications from '../pages/shared/Notifications';
import Settings from '../pages/shared/Settings';
import { HOME_BY_ROLE } from '../utils/constants';
import { adminRoutes } from './adminRoutes';
import { publicRoutes } from './publicRoutes';
import { studentRoutes } from './studentRoutes';
import { teacherRoutes } from './teacherRoutes';

/** Shared pages render inside the layout that matches the signed-in role. */
function SharedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const L = { ADMIN: AdminLayout, TEACHER: TeacherLayout, STUDENT: StudentLayout }[user.role];
  return <L />;
}

export const AppRoutes = (
  <>
    {publicRoutes}
    {adminRoutes}
    {teacherRoutes}
    {studentRoutes}
    <Route element={<ProtectedRoute />}>
      <Route element={<SharedLayout />}>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/password" element={<ChangePassword />} />
      </Route>
    </Route>
    <Route path="/403" element={<Forbidden />} />
    <Route path="/500" element={<ServerError />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export const homeFor = (role: keyof typeof HOME_BY_ROLE) => HOME_BY_ROLE[role];
