import { download, get } from './client';

export const search = (q: string) => get<any>('/reports/search', { q });
export const termReport = (p?: object) => get<any[]>('/reports/term', p);
export const exportStudents = () => download('/reports/export/students', 'students.csv');
export const exportTerm = (p?: object) => download('/reports/export/term', 'term-report.csv', p);
