import { Role } from '../types/user';

export const ROLES: Role[] = ['ADMIN', 'TEACHER', 'STUDENT'];
export const GRADE_LETTERS = ['A', 'B', 'C', 'D', 'F'] as const;
export const HOME_BY_ROLE: Record<Role, string> = { ADMIN: '/admin', TEACHER: '/teacher', STUDENT: '/student' };
export const LOW_ATTENDANCE = 75;
export const TOKEN_KEY = 'edutrack.accessToken';
export const REFRESH_KEY = 'edutrack.refreshToken';
export const GRADE_STYLE: Record<string, string> = {
  A: 'bg-good-light text-good', B: 'bg-brand-light text-brand-dark', C: 'bg-warn-light text-warn', D: 'bg-warn-light text-warn', F: 'bg-bad-light text-bad',
};
