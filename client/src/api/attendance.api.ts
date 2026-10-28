import { AttendanceRecord, AttendanceStatus, LowAttendanceRow } from '../types/attendance';
import { AttendanceSummaryData } from '../types/student';
import { download, get, patch, post } from './client';

export interface BulkInput { classId: string; date: string; records: { studentId: string; status: AttendanceStatus; note?: string }[] }
export const markBulk = (b: BulkInput) => post<{ saved: number }>('/attendance/bulk', b);
export const updateRecord = (id: string, b: object) => patch<AttendanceRecord>(`/attendance/${id}`, b);
export const byClass = (classId: string, p?: object) => get<AttendanceRecord[]>(`/attendance/class/${classId}`, p);
export const byStudent = (studentId: string, p?: object) => get<AttendanceRecord[]>(`/attendance/student/${studentId}`, p);
export const history = (p?: object) => get<AttendanceRecord[]>('/attendance/history', p);
export const percentage = (studentId: string) => get<AttendanceSummaryData & { studentId: string }>(`/attendance/percentage/${studentId}`);
export const classSummary = (classId: string, p?: object) => get<{ overall: AttendanceSummaryData; students: any[] }>(`/attendance/summary/class/${classId}`, p);
export const lowAttendance = (p?: object) => get<LowAttendanceRow[]>('/attendance/low', p);
export const exportAttendance = (p?: object) => download('/attendance/export', 'attendance.csv', p);
