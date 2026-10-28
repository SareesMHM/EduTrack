import { AuthResult, LoginInput, RegisterInput, Tokens } from '../types/auth';
import { User } from '../types/user';
import { get, http, patch, post } from './client';

export const login = (b: LoginInput) => post<AuthResult>('/auth/login', b);
export const register = (b: RegisterInput) => post<AuthResult>('/auth/register', b);
export const logout = () => post<{ message: string }>('/auth/logout');
export const me = () => get<User>('/auth/me');
export const updateMe = (b: object) => patch<User>('/auth/me', b);
export const refresh = (refreshToken: string) => post<Tokens>('/auth/refresh', { refreshToken });
export const forgotPassword = (email: string) => post<{ message: string }>('/auth/forgot-password', { email });
export const resetPassword = (token: string, password: string) => post<{ message: string }>(`/auth/reset-password/${token}`, { password });
export const changePassword = (currentPassword: string, newPassword: string) => post('/auth/change-password', { currentPassword, newPassword });
export const uploadAvatar = async (file: File) => {
  const fd = new FormData();
  fd.append('avatar', file);
  return (await http.post('/auth/me/avatar', fd)).data.data as User;
};
