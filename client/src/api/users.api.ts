import { Paginated } from '../types/api';
import { User } from '../types/user';
import { del, get, getPage, patch, post } from './client';

export const listUsers = (p: object) => getPage<User>('/admin/users', p) as Promise<Paginated<User>>;
export const getUser = (id: string) => get<User>(`/admin/users/${id}`);
export const createUser = (b: object) => post<User>('/admin/users', b);
export const updateUser = (id: string, b: object) => patch<User>(`/admin/users/${id}`, b);
export const setUserStatus = (id: string, isActive: boolean) => patch<User>(`/admin/users/${id}/status`, { isActive });
export const resetUserPassword = (id: string, newPassword: string) => post(`/admin/users/${id}/reset-password`, { newPassword });
export const deleteUser = (id: string) => del(`/admin/users/${id}`);
export const bulkImport = (users: object[]) => post('/admin/users/bulk-import', { users });
