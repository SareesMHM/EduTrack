import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { forbidden, notFound } from '../utils/httpError';

/** Admin: any class. Teacher: classes they teach. Student: their own class. */
export async function assertClassAccess(user: AuthUser, classId: string) {
  if (user.role === 'ADMIN') return;
  const cls = await prisma.class.findUnique({ where: { id: classId }, select: { teacherId: true } });
  if (!cls) throw notFound('Class not found');
  if (user.role === 'TEACHER' && cls.teacherId === user.id) return;
  if (user.role === 'STUDENT') {
    const me = await prisma.user.findUnique({ where: { id: user.id }, select: { classId: true } });
    if (me?.classId === classId) return;
  }
  throw forbidden('You are not assigned to this class');
}

export async function assertStaffClassAccess(user: AuthUser, classId: string) {
  if (user.role === 'STUDENT') throw forbidden();
  return assertClassAccess(user, classId);
}

/** Ids of classes this user may manage (null = all). */
export async function manageableClassIds(user: AuthUser): Promise<string[] | null> {
  if (user.role === 'ADMIN') return null;
  if (user.role === 'TEACHER') {
    const rows = await prisma.class.findMany({ where: { teacherId: user.id }, select: { id: true } });
    return rows.map((r) => r.id);
  }
  const me = await prisma.user.findUnique({ where: { id: user.id }, select: { classId: true } });
  return me?.classId ? [me.classId] : [];
}

/** Throws unless the user is allowed to see this student. */
export async function assertStudentAccess(user: AuthUser, studentId: string) {
  if (user.role === 'ADMIN') return;
  if (user.role === 'STUDENT') {
    if (user.id !== studentId) throw forbidden();
    return;
  }
  const s = await prisma.user.findFirst({
    where: { id: studentId, role: 'STUDENT', class: { teacherId: user.id } },
    select: { id: true },
  });
  if (!s) throw forbidden('This student is not in one of your classes');
}
