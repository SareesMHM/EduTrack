import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { notFound } from '../utils/httpError';
import { assertClassAccess, manageableClassIds } from './access.service';

const include = {
  grade: { select: { id: true, name: true } },
  teacher: { select: { id: true, fullName: true } },
  subjects: { include: { subject: true } },
  _count: { select: { students: true } },
} as const;

export async function listClasses(user: AuthUser, q: { gradeId?: string; q?: string }) {
  const ids = await manageableClassIds(user);
  return prisma.class.findMany({
    where: {
      ...(ids ? { id: { in: ids } } : {}),
      ...(q.gradeId ? { gradeId: q.gradeId } : {}),
      ...(q.q ? { name: { contains: q.q, mode: 'insensitive' } } : {}),
    },
    include,
    orderBy: [{ grade: { name: 'asc' } }, { name: 'asc' }],
  });
}

export async function getClass(user: AuthUser, id: string) {
  await assertClassAccess(user, id);
  const c = await prisma.class.findUnique({ where: { id }, include });
  if (!c) throw notFound('Class not found');
  return c;
}

export async function createClass(input: any) {
  const { subjectIds, ...data } = input;
  return prisma.class.create({
    data: { ...data, subjects: subjectIds ? { create: subjectIds.map((subjectId: string) => ({ subjectId })) } : undefined },
    include,
  });
}

export async function updateClass(id: string, input: any) {
  const { subjectIds, ...data } = input;
  return prisma.$transaction(async (tx) => {
    if (subjectIds) {
      await tx.classSubject.deleteMany({ where: { classId: id } });
      await tx.classSubject.createMany({ data: subjectIds.map((subjectId: string) => ({ classId: id, subjectId })) });
    }
    return tx.class.update({ where: { id }, data, include });
  });
}

export const deleteClass = (id: string) => prisma.class.delete({ where: { id } });

export async function setClassSubjects(id: string, subjectIds: string[]) {
  return updateClass(id, { subjectIds });
}

export async function classStudents(user: AuthUser, id: string) {
  if (user.role === 'STUDENT') throw notFound();
  await assertClassAccess(user, id);
  return prisma.user.findMany({
    where: { classId: id, role: 'STUDENT', isActive: true },
    select: { id: true, fullName: true, email: true, profileImage: true, gender: true },
    orderBy: { fullName: 'asc' },
  });
}
