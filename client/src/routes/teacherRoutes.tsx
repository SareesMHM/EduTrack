import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import TeacherLayout from '../layouts/TeacherLayout';
import AttendanceHistory from '../pages/teacher/AttendanceHistory';
import ClassDetails from '../pages/teacher/ClassDetails';
import Classes from '../pages/teacher/Classes';
import Dashboard from '../pages/teacher/Dashboard';
import EnterMarks from '../pages/teacher/EnterMarks';
import Exams from '../pages/teacher/Exams';
import Insights from '../pages/teacher/Insights';
import MarkAttendance from '../pages/teacher/MarkAttendance';

export const teacherRoutes = (
  <Route element={<ProtectedRoute roles={['TEACHER']} />}>
    <Route path="/teacher" element={<TeacherLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="classes" element={<Classes />} />
      <Route path="classes/:id" element={<ClassDetails />} />
      <Route path="attendance" element={<AttendanceHistory />} />
      <Route path="attendance/:classId" element={<MarkAttendance />} />
      <Route path="exams" element={<Exams />} />
      <Route path="exams/:id/marks" element={<EnterMarks />} />
      <Route path="insights" element={<Insights />} />
    </Route>
  </Route>
);
