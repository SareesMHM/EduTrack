import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import ClassForm from '../pages/admin/classes/ClassForm';
import ClassesList from '../pages/admin/classes/ClassesList';
import Dashboard from '../pages/admin/Dashboard';
import GradesList from '../pages/admin/grades/GradesList';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';
import StudentDetails from '../pages/admin/students/StudentDetails';
import StudentForm from '../pages/admin/students/StudentForm';
import StudentsList from '../pages/admin/students/StudentsList';
import SubjectForm from '../pages/admin/subjects/SubjectForm';
import SubjectsList from '../pages/admin/subjects/SubjectsList';
import TeacherForm from '../pages/admin/teachers/TeacherForm';
import TeachersList from '../pages/admin/teachers/TeachersList';

export const adminRoutes = (
  <Route element={<ProtectedRoute roles={['ADMIN']} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="students" element={<StudentsList />} />
      <Route path="students/new" element={<StudentForm mode="create" />} />
      <Route path="students/:id" element={<StudentDetails />} />
      <Route path="students/:id/edit" element={<StudentForm mode="edit" />} />
      <Route path="teachers" element={<TeachersList />} />
      <Route path="teachers/new" element={<TeacherForm mode="create" />} />
      <Route path="teachers/:id/edit" element={<TeacherForm mode="edit" />} />
      <Route path="classes" element={<ClassesList />} />
      <Route path="classes/new" element={<ClassForm mode="create" />} />
      <Route path="classes/:id/edit" element={<ClassForm mode="edit" />} />
      <Route path="subjects" element={<SubjectsList />} />
      <Route path="subjects/new" element={<SubjectForm mode="create" />} />
      <Route path="subjects/:id/edit" element={<SubjectForm mode="edit" />} />
      <Route path="grades" element={<GradesList />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Route>
);
