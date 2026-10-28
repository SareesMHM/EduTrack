import { prisma } from '../config/db';
import { notFound } from '../utils/httpError';
import { audit } from './audit.service';
import { getUser, listUsers } from './user.service';

export const listTeachers = (q: any) => listUsers(q, { role: 'TEACHER' });

export async function getTeacher(id: string) {
  const t = await getUser(id);
  if (t.role !== 'TEACHER') throw notFound('Teacher not found');
  const [classes, subjects] = await Promise.all([
    prisma.class.findMany({ where: { teacherId: id }, include: { grade: true, _count: { select: { students: true } } } }),
    prisma.teacherSubject.findMany({ where: { teacherId: id }, include: { subject: true } }),
  ]);
  return { ...t, classes, subjects: subjects.map((s) => s.subject) };
}

export async function assignClasses(actorId: string, teacherId: string, classIds: string[]) {
  await getTeacher(teacherId);
  await prisma.$transaction([
    prisma.class.updateMany({ where: { teacherId, id: { notIn: classIds } }, data: { teacherId: null } }),
    prisma.class.updateMany({ where: { id: { in: classIds } }, data: { teacherId } }),
  ]);
  await audit(actorId, 'ASSIGN_CLASSES', 'User', teacherId, { classIds });
  return getTeacher(teacherId);
}

export async function assignSubjects(actorId: string, teacherId: string, subjectIds: string[]) {
  await getTeacher(teacherId);
  await prisma.$transaction([
    prisma.teacherSubject.deleteMany({ where: { teacherId } }),
    prisma.teacherSubject.createMany({ data: subjectIds.map((subjectId) => ({ teacherId, subjectId })) }),
  ]);
  await audit(actorId, 'ASSIGN_SUBJECTS', 'User', teacherId, { subjectIds });
  return getTeacher(teacherId);
}

export const myClasses = (teacherId: string) =>
  prisma.class.findMany({
    where: { teacherId },
    include: { grade: true, subjects: { include: { subject: true } }, _count: { select: { students: true } } },
    orderBy: { name: 'asc' },
  });
