import { Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import ForgotPassword from '../pages/public/ForgotPassword';
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ResetPassword from '../pages/public/ResetPassword';

export const publicRoutes = (
  <>
    <Route path="/" element={<Landing />} />
    <Route element={<PublicLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Route>
  </>
);
