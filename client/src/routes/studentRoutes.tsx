import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import StudentLayout from '../layouts/StudentLayout';
import Attendance from '../pages/student/Attendance';
import Classes from '../pages/student/Classes';
import Dashboard from '../pages/student/Dashboard';
import Profile from '../pages/student/Profile';
import ResultDetail from '../pages/student/ResultDetail';
import Results from '../pages/student/Results';

export const studentRoutes = (
  <Route element={<ProtectedRoute roles={['STUDENT']} />}>
    <Route path="/student" element={<StudentLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="results" element={<Results />} />
      <Route path="results/:examId" element={<ResultDetail />} />
      <Route path="classes" element={<Classes />} />
    </Route>
  </Route>
);
