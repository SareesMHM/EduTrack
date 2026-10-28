import { User } from './user';
export type Student = User;
export interface AttendanceSummaryData { total: number; present: number; absent: number; late: number; excused: number; percentage: number }
export interface ResultRow {
  examId: string; title: string; subject: string; date: string; score: number; maxMarks: number; percentage: number; grade: string;
}
export interface ResultsSummary { average: number | null; count: number; results: ResultRow[] }
