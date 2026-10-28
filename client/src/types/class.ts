import { Subject } from './subject';
export interface ClassItem {
  id: string; name: string; gradeId: string; teacherId?: string | null;
  grade: { id: string; name: string };
  teacher?: { id: string; fullName: string } | null;
  subjects: { subject: Subject }[];
  _count: { students: number };
}
export interface RosterStudent { id: string; fullName: string; email: string; profileImage?: string | null; gender?: string | null }
