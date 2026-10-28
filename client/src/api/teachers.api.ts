import { ClassItem } from '../types/class';
import { TeacherDetail } from '../types/teacher';
import { User } from '../types/user';
import { get, getPage, patch, put } from './client';

export const listTeachers = (p: object) => getPage<User>('/teachers', p);
export const getTeacher = (id: string) => get<TeacherDetail>(`/teachers/${id}`);
export const updateTeacher = (id: string, b: object) => patch<TeacherDetail>(`/teachers/${id}`, b);
export const assignClasses = (id: string, classIds: string[]) => put<TeacherDetail>(`/teachers/${id}/classes`, { classIds });
export const assignSubjects = (id: string, subjectIds: string[]) => put<TeacherDetail>(`/teachers/${id}/subjects`, { subjectIds });
export const myClasses = () => get<ClassItem[]>('/teachers/me/classes');
