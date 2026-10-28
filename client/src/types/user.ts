export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Address { number?: string | null; street?: string | null; city?: string | null; district?: string | null; postalCode?: string | null }

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  phone?: string | null;
  profileImage?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
  parentNic?: string | null;
  gradeId?: string | null;
  classId?: string | null;
  grade?: { id: string; name: string } | null;
  class?: { id: string; name: string; grade: { name: string } } | null;
  address?: Address | null;
  createdAt: string;
}
