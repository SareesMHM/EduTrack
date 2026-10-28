import { Role } from '../types/user';
import { useAuth } from './useAuth';

export function useRole() {
  const { user } = useAuth();
  return { role: user?.role, is: (...r: Role[]) => !!user && r.includes(user.role) };
}
