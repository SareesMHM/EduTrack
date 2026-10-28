import { Grade } from '../types/subject';
import { del, get, patch, post } from './client';

export const listGrades = () => get<Grade[]>('/grades');
export const createGrade = (name: string) => post<Grade>('/grades', { name });
export const updateGrade = (id: string, name: string) => patch<Grade>(`/grades/${id}`, { name });
export const deleteGrade = (id: string) => del(`/grades/${id}`);
