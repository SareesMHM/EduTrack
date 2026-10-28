import { ExamMarks } from '../types/marks';
import { del, get, patch, post } from './client';

export const enterMarks = (examId: string, marks: { studentId: string; score: number }[]) => post<{ saved: number }>('/marks/bulk', { examId, marks });
export const updateMark = (id: string, score: number) => patch(`/marks/${id}`, { score });
export const deleteMark = (id: string) => del(`/marks/${id}`);
export const marksByExam = (examId: string) => get<ExamMarks>(`/marks/exam/${examId}`);
export const marksByStudent = (studentId: string) => get<any[]>(`/marks/student/${studentId}`);
