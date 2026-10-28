import { get, put } from './client';

export const getSettings = () => get<Record<string, string>>('/settings');
export const updateSettings = (b: Record<string, string>) => put<Record<string, string>>('/settings', b);
