import { Exam } from '../types/exam';
import { del, get, patch, post } from './client';

export const listExams = (p?: object) => get<Exam[]>('/exams', p);
export const getExam = (id: string) => get<Exam>(`/exams/${id}`);
export const createExam = (b: object) => post<Exam>('/exams', b);
export const updateExam = (id: string, b: object) => patch<Exam>(`/exams/${id}`, b);
export const deleteExam = (id: string) => del(`/exams/${id}`);
export const publishExam = (id: string) => post<Exam>(`/exams/${id}/publish`);
export const unpublishExam = (id: string) => post<Exam>(`/exams/${id}/unpublish`);
