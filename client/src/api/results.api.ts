import { ResultRow } from '../types/student';
import { ExamSummary } from '../types/marks';
import { get, post } from './client';

export const examSummary = (examId: string) => get<ExamSummary>(`/results/exam/${examId}/summary`);
export const ranking = (examId: string) => get<{ rank: number; studentId: string; fullName: string; score: number; maxMarks: number; grade: string }[]>(`/results/exam/${examId}/ranking`);
export const publishResults = (examId: string) => post(`/results/exam/${examId}/publish`);
export const published = () => get<ResultRow[]>('/results/published');
export const reportCard = (studentId: string) => get<any>(`/results/report-card/${studentId}`);
export const resultDetail = (studentId: string, examId: string) => get<ResultRow & { classAverage: number | null; classSize: number }>(`/results/student/${studentId}/exam/${examId}`);
