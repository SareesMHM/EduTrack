import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { forbidden, notFound } from '../utils/httpError';
import { isPass, marksToGrade } from '../utils/grades';
import { assertStaffClassAccess, assertStudentAccess } from './access.service';
import { percentageFor } from './student.service';

const r1 = (n: number) => Math.round(n * 10) / 10;

async function loadExam(user: AuthUser, examId: string) {
  const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { subject: true, class: true } });
  if (!exam) throw notFound('Exam not found');
  if (user.role === 'STUDENT') throw forbidden();
  await assertStaffClassAccess(user, exam.classId);
  return exam;
}

export async function examSummary(user: AuthUser, examId: string) {
  const exam = await loadExam(user, examId);
  const marks = await prisma.mark.findMany({ where: { examId } });
  const scores = marks.map((m) => m.score);
  const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  scores.forEach((s) => distribution[marksToGrade(s, exam.maxMarks)]++);
  return {
    exam: { id: exam.id, title: exam.title, subject: exam.subject.name, class: exam.class.name, maxMarks: exam.maxMarks, published: exam.published },
    count: scores.length,
    average: scores.length ? r1(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    highest: scores.length ? Math.max(...scores) : null,
    lowest: scores.length ? Math.min(...scores) : null,
    passRate: scores.length ? r1((scores.filter((s) => isPass(s, exam.maxMarks)).length / scores.length) * 100) : null,
    distribution,
  };
}

export async function ranking(user: AuthUser, examId: string) {
  const exam = await loadExam(user, examId);
  const marks = await prisma.mark.findMany({
    where: { examId },
    include: { student: { select: { id: true, fullName: true } } },
    orderBy: { score: 'desc' },
  });
  let rank = 0;
  let prev: number | null = null;
  return marks.map((m, i) => {
    if (m.score !== prev) rank = i + 1; // ties share a rank
    prev = m.score;
    return { rank, studentId: m.student.id, fullName: m.student.fullName, score: m.score, maxMarks: exam.maxMarks, grade: m.grade };
  });
}

export async function publishedFor(user: AuthUser, studentId: string) {
  await assertStudentAccess(user, studentId);
  const marks = await prisma.mark.findMany({
    where: { studentId, exam: { published: true } },
    include: { exam: { include: { subject: true } } },
    orderBy: { exam: { date: 'desc' } },
  });
  return marks.map((m) => ({
    examId: m.examId,
    title: m.exam.title,
    subject: m.exam.subject.name,
    date: m.exam.date,
    score: m.score,
    maxMarks: m.exam.maxMarks,
    percentage: r1((m.score / m.exam.maxMarks) * 100),
    grade: m.grade ?? marksToGrade(m.score, m.exam.maxMarks),
  }));
}

export async function reportCard(user: AuthUser, studentId: string) {
  await assertStudentAccess(user, studentId);
  const student = await prisma.user.findFirst({
    where: { id: studentId, role: 'STUDENT' },
    select: { id: true, fullName: true, class: { select: { name: true, grade: { select: { name: true } } } } },
  });
  if (!student) throw notFound('Student not found');
  const results = await publishedFor({ id: studentId, role: 'STUDENT' }, studentId);
  const avg = results.length ? r1(results.reduce((a, r) => a + r.percentage, 0) / results.length) : null;
  return {
    student,
    attendancePercentage: await percentageFor(studentId),
    averagePercentage: avg,
    overallGrade: avg === null ? null : marksToGrade(avg, 100),
    results,
  };
}

export async function examResultDetail(user: AuthUser, studentId: string, examId: string) {
  const all = await publishedFor(user, studentId);
  const r = all.find((x) => x.examId === examId);
  if (!r) throw notFound('Result not found or not published yet');
  const peers = await prisma.mark.findMany({ where: { examId }, select: { score: true } });
  const avg = peers.length ? r1(peers.reduce((a, b) => a + b.score, 0) / peers.length) : null;
  return { ...r, classAverage: avg, classSize: peers.length };
}
