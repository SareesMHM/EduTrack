import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { forbidden } from '../utils/httpError';
import { toCsv } from '../utils/csv';
import { toDateOnly } from '../validators/query.validator';
import { manageableClassIds } from './access.service';
import { bulkFeatures } from './analytics.service';

export async function globalSearch(user: AuthUser, q: string) {
  if (user.role === 'STUDENT') throw forbidden();
  const ids = await manageableClassIds(user);
  const contains = { contains: q, mode: 'insensitive' as const };
  const [students, teachers, classes, subjects] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'STUDENT', fullName: contains, ...(ids ? { classId: { in: ids } } : {}) },
      select: { id: true, fullName: true, class: { select: { name: true } } },
      take: 8,
    }),
    user.role === 'ADMIN'
      ? prisma.user.findMany({ where: { role: 'TEACHER', fullName: contains }, select: { id: true, fullName: true }, take: 8 })
      : [],
    prisma.class.findMany({ where: { name: contains, ...(ids ? { id: { in: ids } } : {}) }, select: { id: true, name: true }, take: 8 }),
    prisma.subject.findMany({ where: { OR: [{ name: contains }, { code: contains }] }, select: { id: true, name: true, code: true }, take: 8 }),
  ]);
  return { students, teachers, classes, subjects };
}

export async function exportStudentsCsv(user: AuthUser) {
  const ids = await manageableClassIds(user);
  if (user.role === 'STUDENT') throw forbidden();
  const rows = await prisma.user.findMany({
    where: { role: 'STUDENT', ...(ids ? { classId: { in: ids } } : {}) },
    select: { fullName: true, email: true, gender: true, phone: true, isActive: true, class: { select: { name: true } }, grade: { select: { name: true } } },
    orderBy: { fullName: 'asc' },
  });
  return toCsv(
    rows.map((r) => ({ fullName: r.fullName, email: r.email, grade: r.grade?.name, class: r.class?.name, gender: r.gender, phone: r.phone, active: r.isActive })),
    ['fullName', 'email', 'grade', 'class', 'gender', 'phone', 'active'],
  );
}

export async function termReport(user: AuthUser, q: { classId?: string; from?: string; to?: string }) {
  if (user.role === 'STUDENT') throw forbidden();
  const ids = await manageableClassIds(user);
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT', isActive: true, ...(ids ? { classId: { in: ids } } : {}), ...(q.classId ? { classId: q.classId } : {}) },
    select: { id: true, fullName: true, class: { select: { name: true } } },
    orderBy: { fullName: 'asc' },
  });
  const feats = await bulkFeatures(students.map((s) => s.id));
  void toDateOnly; // range filters reserved for term-bound features
  return students.map((s) => ({ studentId: s.id, fullName: s.fullName, class: s.class?.name, ...feats.get(s.id)! }));
}

export async function termReportCsv(user: AuthUser, q: any) {
  const rows = await termReport(user, q);
  return toCsv(rows as any, ['fullName', 'class', 'attendancePct', 'avgScorePct', 'examsTaken', 'scoreTrend']);
}
