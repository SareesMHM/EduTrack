import { get, patch } from './client';

export interface Notice { id: string; title: string; body: string; read: boolean; createdAt: string }
export const listNotifications = () => get<Notice[]>('/notifications');
export const markRead = (id: string) => patch(`/notifications/${id}/read`);
export const markAllRead = () => patch('/notifications/read-all');
