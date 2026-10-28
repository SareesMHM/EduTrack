import AppShell from './AppShell';

export default function TeacherLayout() {
  return <AppShell title="Teacher" home="/teacher" nav={[
    { to: '/teacher', label: 'Dashboard', end: true }, { to: '/teacher/classes', label: 'My classes' },
    { to: '/teacher/attendance', label: 'Attendance' }, { to: '/teacher/exams', label: 'Exams & marks' }, { to: '/teacher/insights', label: 'Insights' },
  ]} />;
}
