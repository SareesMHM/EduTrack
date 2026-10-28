import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { forbidden } from '../utils/httpError';
import { attendancePercentage } from '../utils/attendance';
import { marksToGrade } from '../utils/grades';
import { atRiskStudents } from './analytics.service';
import { manageableClassIds } from './access.service';
import { publishedFor } from './result.service';
import { percentageFor } from './student.service';

const today = () => new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');
const r1 = (n: number) => Math.round(n * 10) / 10;

export async function adminDashboard() {
  const sevenAgo = new Date(today().getTime() - 6 * 86400000);
  const [students, teachers, classes, subjects, todayAtt, weekAtt, marks, recent] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
    prisma.user.count({ where: { role: 'TEACHER', isActive: true } }),
    prisma.class.count(),
    prisma.subject.count(),
    prisma.attendance.findMany({ where: { date: today() }, select: { status: true } }),
    prisma.attendance.findMany({ where: { date: { gte: sevenAgo } }, select: { date: true, status: true } }),
    prisma.mark.findMany({ select: { score: true, exam: { select: { maxMarks: true } } } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, fullName: true, role: true, createdAt: true } }),
  ]);
  const days = Array.from({ length: 7 }, (_, i) => new Date(sevenAgo.getTime() + i * 86400000).toISOString().slice(0, 10));
  const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  marks.forEach((m) => distribution[marksToGrade(m.score, m.exam.maxMarks)]++);
  return {
    kpis: { students, teachers, classes, subjects, todayAttendance: todayAtt.length ? attendancePercentage(todayAtt) : null },
    attendanceTrend: days.map((d) => {
      const rows = weekAtt.filter((a) => a.date.toISOString().slice(0, 10) === d);
      return { date: d, percentage: rows.length ? attendancePercentage(rows) : null };
    }),
    gradeDistribution: distribution,
    recentUsers: recent,
  };
}

export async function teacherDashboard(user: AuthUser) {
  const classes = await prisma.class.findMany({
    where: { teacherId: user.id },
    include: { grade: true, _count: { select: { students: true } } },
  });
  const ids = classes.map((c) => c.id);
  const marked = await prisma.attendance.groupBy({ by: ['classId'], where: { classId: { in: ids }, date: today() } });
  const markedIds = new Set(marked.map((m) => m.classId));
  const exams = await prisma.exam.findMany({
    where: { classId: { in: ids }, date: { lte: new Date() } },
    include: { subject: true, class: true, _count: { select: { marks: true } } },
    orderBy: { date: 'desc' },
  });
  const sizes = new Map(classes.map((c) => [c.id, c._count.students]));
  return {
    classes,
    pendingAttendance: classes.filter((c) => !markedIds.has(c.id)).map((c) => ({ id: c.id, name: c.name })),
    examsToGrade: exams.filter((e) => e._count.marks < (sizes.get(e.classId) ?? 0)).slice(0, 10),
  };
}

export async function studentDashboard(user: AuthUser) {
  const me = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { classId: true } });
  const [attendance, results, upcoming] = await Promise.all([
    percentageFor(user.id),
    publishedFor(user, user.id),
    me.classId
      ? prisma.exam.findMany({
          where: { classId: me.classId, date: { gte: new Date() } },
          include: { subject: true },
          orderBy: { date: 'asc' },
          take: 5,
        })
      : [],
  ]);
  return { attendancePercentage: attendance, latestResults: results.slice(0, 5), upcomingExams: upcoming };
}

export async function stats(user: AuthUser) {
  if (user.role === 'STUDENT') throw forbidden();
  const ids = await manageableClassIds(user);
  const marks = await prisma.mark.findMany({
    where: ids ? { exam: { classId: { in: ids } } } : {},
    select: { score: true, exam: { select: { maxMarks: true, subject: { select: { name: true } } } } },
  });
  const bySubject = new Map<string, number[]>();
  marks.forEach((m) => {
    const arr = bySubject.get(m.exam.subject.name) ?? [];
    arr.push((m.score / m.exam.maxMarks) * 100);
    bySubject.set(m.exam.subject.name, arr);
  });
  return {
    subjectAverages: [...bySubject.entries()].map(([subject, v]) => ({ subject, average: r1(v.reduce((a, b) => a + b, 0) / v.length), count: v.length })),
  };
}

export async function topPerformers(user: AuthUser, limit = 10) {
  if (user.role === 'STUDENT') throw forbidden();
  const ids = await manageableClassIds(user);
  const marks = await prisma.mark.findMany({
    where: { exam: { published: true, ...(ids ? { classId: { in: ids } } : {}) } },
    select: { score: true, studentId: true, student: { select: { fullName: true, class: { select: { name: true } } } }, exam: { select: { maxMarks: true } } },
  });
  const m = new Map<string, { fullName: string; className?: string; pcts: number[] }>();
  marks.forEach((x) => {
    const e = m.get(x.studentId) ?? { fullName: x.student.fullName, className: x.student.class?.name, pcts: [] };
    e.pcts.push((x.score / x.exam.maxMarks) * 100);
    m.set(x.studentId, e);
  });
  return [...m.entries()]
    .map(([studentId, e]) => ({ studentId, fullName: e.fullName, className: e.className, average: r1(e.pcts.reduce((a, b) => a + b, 0) / e.pcts.length), exams: e.pcts.length }))
    .sort((a, b) => b.average - a.average)
    .slice(0, limit);
}

export async function atRisk(user: AuthUser) {
  if (user.role === 'STUDENT') throw forbidden();
  return atRiskStudents(await manageableClassIds(user));
}
