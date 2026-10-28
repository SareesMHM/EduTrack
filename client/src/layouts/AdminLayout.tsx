import AppShell from './AppShell';

export default function AdminLayout() {
  return <AppShell title="Administration" home="/admin" nav={[
    { to: '/admin', label: 'Dashboard', end: true }, { to: '/admin/students', label: 'Students' }, { to: '/admin/teachers', label: 'Teachers' },
    { to: '/admin/classes', label: 'Classes' }, { to: '/admin/subjects', label: 'Subjects' }, { to: '/admin/grades', label: 'Grades' },
    { to: '/admin/reports', label: 'Reports' }, { to: '/admin/settings', label: 'System settings' },
  ]} />;
}
