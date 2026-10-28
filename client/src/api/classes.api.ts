import { ClassItem, RosterStudent } from '../types/class';
import { del, get, patch, post, put } from './client';

export const listClasses = (p?: object) => get<ClassItem[]>('/classes', p);
export const getClass = (id: string) => get<ClassItem>(`/classes/${id}`);
export const createClass = (b: object) => post<ClassItem>('/classes', b);
export const updateClass = (id: string, b: object) => patch<ClassItem>(`/classes/${id}`, b);
export const deleteClass = (id: string) => del(`/classes/${id}`);
export const classStudents = (id: string) => get<RosterStudent[]>(`/classes/${id}/students`);
export const setClassSubjects = (id: string, subjectIds: string[]) => put<ClassItem>(`/classes/${id}/subjects`, { subjectIds });
