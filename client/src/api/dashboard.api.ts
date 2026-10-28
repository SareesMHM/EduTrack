import { get } from './client';

export const adminDashboard = () => get<any>('/dashboard/admin');
export const teacherDashboard = () => get<any>('/dashboard/teacher');
export const studentDashboard = () => get<any>('/dashboard/student');
export const stats = () => get<{ subjectAverages: { subject: string; average: number; count: number }[] }>('/dashboard/stats');
export const topPerformers = () => get<any[]>('/dashboard/top-performers');
export const atRisk = () => get<any[]>('/dashboard/at-risk');
