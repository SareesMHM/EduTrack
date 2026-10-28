import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { conflict, notFound } from '../utils/httpError';
import { attendancePercentage, summarise } from '../utils/attendance';
import { marksToGrade } from '../utils/grades';
import { assertStudentAccess, manageableClassIds } from './access.service';
import { audit } from './audit.service';
import { getUser, listUsers, updateUser } from './user.service';

export async function listStudents(user: AuthUser, q: any) {
  const ids = await manageableClassIds(user);
  return listUsers(q, {
    role: 'STUDENT',
    ...(ids ? { classId: { in: ids } } : {}),
    ...(q.classId ? { classId: q.classId } : {}),
    ...(q.gradeId ? { gradeId: q.gradeId } : {}),
  });
}

export async function getStudent(user: AuthUser, id: string) {
  await assertStudentAccess(user, id);
  const s = await getUser(id);
  if (s.role !== 'STUDENT') throw notFound('Student not found');
  return s;
}

export async function updateStudent(actor: AuthUser, id: string, input: any) {
  await assertStudentAccess(actor, id);
  return updateUser(actor.id, id, input);
}

export async function transferClass(actorId: string, studentId: string, classId: string) {
  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls) throw notFound('Class not found');
  const s = await prisma.user.findFirst({ where: { id: studentId, role: 'STUDENT' } });
  if (!s) throw notFound('Student not found');
  if (s.classId === classId) throw conflict('Student is already in this class');
  await prisma.user.update({ where: { id: studentId }, data: { classId, gradeId: cls.gradeId } });
  await audit(actorId, 'TRANSFER', 'User', studentId, { from: s.classId, to: classId });
  return getUser(studentId);
}

export async function attendanceSummary(user: AuthUser, studentId: string) {
  await assertStudentAccess(user, studentId);
  const records = await prisma.attendance.findMany({ where: { studentId }, select: { status: true } });
  return summarise(records);
}

export async function resultsSummary(user: AuthUser, studentId: string) {
  await assertStudentAccess(user, studentId);
  const marks = await prisma.mark.findMany({
    where: { studentId, ...(user.role === 'STUDENT' ? { exam: { published: true } } : {}) },
    include: { exam: { include: { subject: true } } },
    orderBy: { exam: { date: 'desc' } },
  });
  const rows = marks.map((m) => ({
    examId: m.examId,
    title: m.exam.title,
    subject: m.exam.subject.name,
    date: m.exam.date,
    score: m.score,
    maxMarks: m.exam.maxMarks,
    percentage: Math.round((m.score / m.exam.maxMarks) * 1000) / 10,
    grade: m.grade ?? marksToGrade(m.score, m.exam.maxMarks),
  }));
  const average = rows.length ? Math.round((rows.reduce((a, r) => a + r.percentage, 0) / rows.length) * 10) / 10 : null;
  return { average, count: rows.length, results: rows };
}

export const percentageFor = async (studentId: string) =>
  attendancePercentage(await prisma.attendance.findMany({ where: { studentId }, select: { status: true } }));
