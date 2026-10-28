import AppShell from './AppShell';

export default function StudentLayout() {
  return <AppShell title="Student" home="/student" nav={[
    { to: '/student', label: 'Dashboard', end: true }, { to: '/student/attendance', label: 'Attendance' }, { to: '/student/results', label: 'Results' },
    { to: '/student/classes', label: 'My class' }, { to: '/student/profile', label: 'Profile' },
  ]} />;
}
