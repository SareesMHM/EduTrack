import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { badRequest, forbidden, notFound } from '../utils/httpError';
import { marksToGrade } from '../utils/grades';
import { assertStaffClassAccess, assertStudentAccess } from './access.service';
import { audit } from './audit.service';

export async function bulkEnter(user: AuthUser, examId: string, marks: { studentId: string; score: number }[]) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw notFound('Exam not found');
  await assertStaffClassAccess(user, exam.classId);

  const over = marks.filter((m) => m.score > exam.maxMarks);
  if (over.length) throw badRequest(`Scores cannot exceed ${exam.maxMarks}`, { studentIds: over.map((o) => o.studentId) });

  const roster = await prisma.user.findMany({ where: { classId: exam.classId, role: 'STUDENT' }, select: { id: true } });
  const allowed = new Set(roster.map((r) => r.id));
  const stray = marks.filter((m) => !allowed.has(m.studentId));
  if (stray.length) throw badRequest('Some students are not in this exam’s class', { studentIds: stray.map((s) => s.studentId) });

  await prisma.$transaction(
    marks.map((m) => {
      const grade = marksToGrade(m.score, exam.maxMarks);
      return prisma.mark.upsert({
        where: { examId_studentId: { examId, studentId: m.studentId } },
        create: { examId, studentId: m.studentId, score: m.score, grade },
        update: { score: m.score, grade },
      });
    }),
  );
  await audit(user.id, 'ENTER_MARKS', 'Exam', examId, { count: marks.length });
  return { saved: marks.length };
}

async function loadMark(user: AuthUser, id: string) {
  const m = await prisma.mark.findUnique({ where: { id }, include: { exam: true } });
  if (!m) throw notFound('Mark not found');
  await assertStaffClassAccess(user, m.exam.classId);
  return m;
}

export async function updateMark(user: AuthUser, id: string, score: number) {
  const m = await loadMark(user, id);
  if (score > m.exam.maxMarks) throw badRequest(`Score cannot exceed ${m.exam.maxMarks}`);
  return prisma.mark.update({ where: { id }, data: { score, grade: marksToGrade(score, m.exam.maxMarks) } });
}

export async function deleteMark(user: AuthUser, id: string) {
  await loadMark(user, id);
  await prisma.mark.delete({ where: { id } });
}

export async function byExam(user: AuthUser, examId: string) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw notFound('Exam not found');
  if (user.role === 'STUDENT') throw forbidden();
  await assertStaffClassAccess(user, exam.classId);
  const students = await prisma.user.findMany({
    where: { classId: exam.classId, role: 'STUDENT', isActive: true },
    select: { id: true, fullName: true, marks: { where: { examId }, select: { id: true, score: true, grade: true } } },
    orderBy: { fullName: 'asc' },
  });
  return {
    exam,
    rows: students.map((s) => ({ studentId: s.id, fullName: s.fullName, markId: s.marks[0]?.id ?? null, score: s.marks[0]?.score ?? null, grade: s.marks[0]?.grade ?? null })),
  };
}

export async function byStudent(user: AuthUser, studentId: string) {
  await assertStudentAccess(user, studentId);
  return prisma.mark.findMany({
    where: { studentId, ...(user.role === 'STUDENT' ? { exam: { published: true } } : {}) },
    include: { exam: { include: { subject: true } } },
    orderBy: { exam: { date: 'desc' } },
  });
}
