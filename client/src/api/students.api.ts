import { AttendanceSummaryData, ResultsSummary, Student } from '../types/student';
import { get, getPage, patch, post } from './client';

export const listStudents = (p: object) => getPage<Student>('/students', p);
export const getStudent = (id: string) => get<Student>(`/students/${id}`);
export const updateStudent = (id: string, b: object) => patch<Student>(`/students/${id}`, b);
export const transferStudent = (id: string, classId: string) => post<Student>(`/students/${id}/transfer`, { classId });
export const attendanceSummary = (id: string) => get<AttendanceSummaryData>(`/students/${id}/attendance-summary`);
export const resultsSummary = (id: string) => get<ResultsSummary>(`/students/${id}/results-summary`);
export const myProfile = () => get<Student>('/students/me/profile');
export const updateMyContact = (b: object) => patch<Student>('/students/me/profile', b);
