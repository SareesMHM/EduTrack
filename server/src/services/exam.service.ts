import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { badRequest, notFound } from '../utils/httpError';
import { assertClassAccess, assertStaffClassAccess, manageableClassIds } from './access.service';
import { audit } from './audit.service';
import { notifyMany } from './notification.service';

const include = {
  subject: { select: { id: true, name: true, code: true } },
  class: { select: { id: true, name: true, grade: { select: { name: true } } } },
  _count: { select: { marks: true } },
} as const;

export async function listExams(user: AuthUser, q: any) {
  const ids = await manageableClassIds(user);
  return prisma.exam.findMany({
    where: {
      ...(ids ? { classId: { in: ids } } : {}),
      ...(q.classId ? { classId: q.classId } : {}),
      ...(q.subjectId ? { subjectId: q.subjectId } : {}),
      ...(user.role === 'STUDENT' ? { published: true } : q.published ? { published: q.published === 'true' } : {}),
      ...(q.upcoming ? { date: { gte: new Date() } } : {}),
    },
    include,
    orderBy: { date: q.upcoming ? 'asc' : 'desc' },
  });
}

export async function getExam(user: AuthUser, id: string) {
  const e = await prisma.exam.findUnique({ where: { id }, include });
  if (!e) throw notFound('Exam not found');
  await assertClassAccess(user, e.classId);
  if (user.role === 'STUDENT' && !e.published) throw notFound('Exam not found');
  return e;
}

export async function createExam(user: AuthUser, input: any) {
  await assertStaffClassAccess(user, input.classId);
  const link = await prisma.classSubject.findUnique({
    where: { classId_subjectId: { classId: input.classId, subjectId: input.subjectId } },
  });
  if (!link) throw badRequest('This subject is not taught in the selected class');
  const e = await prisma.exam.create({ data: input, include });
  await audit(user.id, 'CREATE', 'Exam', e.id);
  return e;
}

export async function updateExam(user: AuthUser, id: string, input: any) {
  const e = await getExam(user, id);
  if (input.maxMarks !== undefined && input.maxMarks < e.maxMarks) {
    const over = await prisma.mark.count({ where: { examId: id, score: { gt: input.maxMarks } } });
    if (over) throw badRequest('Some recorded marks exceed the new maximum');
  }
  if (input.classId && input.classId !== e.classId) await assertStaffClassAccess(user, input.classId);
  return prisma.exam.update({ where: { id }, data: input, include });
}

export async function deleteExam(user: AuthUser, id: string) {
  await getExam(user, id);
  await prisma.exam.delete({ where: { id } });
  await audit(user.id, 'DELETE', 'Exam', id);
}

export async function setPublished(user: AuthUser, id: string, published: boolean) {
  const e = await getExam(user, id);
  if (published) {
    const count = await prisma.mark.count({ where: { examId: id } });
    if (count === 0) throw badRequest('Enter marks before publishing results');
  }
  const updated = await prisma.exam.update({ where: { id }, data: { published }, include });
  if (published && !e.published) {
    const students = await prisma.user.findMany({ where: { classId: e.classId, role: 'STUDENT', isActive: true }, select: { id: true } });
    await notifyMany(students.map((s) => s.id), 'New results published', `${e.title} (${e.subject.name}) results are available.`);
  }
  await audit(user.id, published ? 'PUBLISH' : 'UNPUBLISH', 'Exam', id);
  return updated;
}
