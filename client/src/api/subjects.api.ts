import { Subject } from '../types/subject';
import { del, get, patch, post } from './client';

export const listSubjects = () => get<Subject[]>('/subjects');
export const getSubject = (id: string) => get<Subject>(`/subjects/${id}`);
export const createSubject = (b: object) => post<Subject>('/subjects', b);
export const updateSubject = (id: string, b: object) => patch<Subject>(`/subjects/${id}`, b);
export const deleteSubject = (id: string) => del(`/subjects/${id}`);
