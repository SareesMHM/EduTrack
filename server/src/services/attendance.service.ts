import { Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { AuthUser } from '../types';
import { badRequest, forbidden, notFound } from '../utils/httpError';
import { attendancePercentage, summarise } from '../utils/attendance';
import { toCsv } from '../utils/csv';
import { toDateOnly } from '../validators/query.validator';
import { assertClassAccess, assertStaffClassAccess, assertStudentAccess, manageableClassIds } from './access.service';

const dateRange = (q: { from?: string; to?: string; date?: string }) =>
  q.date
    ? { equals: toDateOnly(q.date) }
    : q.from || q.to
      ? { ...(q.from ? { gte: toDateOnly(q.from) } : {}), ...(q.to ? { lte: toDateOnly(q.to) } : {}) }
      : undefined;

export async function bulkMark(user: AuthUser, input: { classId: string; date: string; records: any[] }) {
  await assertStaffClassAccess(user, input.classId);
  const date = toDateOnly(input.date);
  if (date.getTime() > Date.now() + 24 * 3600 * 1000) throw badRequest('Cannot record attendance for a future date');

  const roster = await prisma.user.findMany({ where: { classId: input.classId, role: 'STUDENT' }, select: { id: true } });
  const allowed = new Set(roster.map((r) => r.id));
  const stray = input.records.filter((r) => !allowed.has(r.studentId));
  if (stray.length) throw badRequest('Some students are not in this class', { studentIds: stray.map((s) => s.studentId) });

  await prisma.$transaction(
    input.records.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_classId_date: { studentId: r.studentId, classId: input.classId, date } },
        create: { studentId: r.studentId, classId: input.classId, date, status: r.status, note: r.note },
        update: { status: r.status, note: r.note ?? null },
      }),
    ),
  );
  return { saved: input.records.length };
}

export async function updateRecord(user: AuthUser, id: string, data: { status?: any; note?: string | null }) {
  const rec = await prisma.attendance.findUnique({ where: { id } });
  if (!rec) throw notFound('Attendance record not found');
  await assertStaffClassAccess(user, rec.classId);
  return prisma.attendance.update({ where: { id }, data });
}

export async function byClass(user: AuthUser, classId: string, q: any) {
  await assertStaffClassAccess(user, classId);
  const date = dateRange(q) ?? { equals: toDateOnly(new Date().toISOString().slice(0, 10)) };
  return prisma.attendance.findMany({
    where: { classId, date },
    include: { student: { select: { id: true, fullName: true } } },
    orderBy: [{ date: 'desc' }, { student: { fullName: 'asc' } }],
  });
}

export async function byStudent(user: AuthUser, studentId: string, q: any) {
  await assertStudentAccess(user, studentId);
  return prisma.attendance.findMany({ where: { studentId, date: dateRange(q) }, orderBy: { date: 'desc' } });
}

export async function history(user: AuthUser, q: any) {
  const ids = await manageableClassIds(user);
  if (user.role === 'STUDENT') throw forbidden();
  return prisma.attendance.findMany({
    where: { ...(ids ? { classId: { in: ids } } : {}), ...(q.classId ? { classId: q.classId } : {}), date: dateRange(q) },
    include: { student: { select: { id: true, fullName: true } }, class: { select: { id: true, name: true } } },
    orderBy: { date: 'desc' },
    take: 500,
  });
}

export async function classSummary(user: AuthUser, classId: string, q: any) {
  await assertClassAccess(user, classId);
  const rows = await prisma.attendance.findMany({
    where: { classId, date: dateRange(q) },
    include: { student: { select: { id: true, fullName: true } } },
  });
  const byStudentId = new Map<string, { name: string; records: { status: any }[] }>();
  rows.forEach((r) => {
    const e = byStudentId.get(r.studentId) ?? { name: r.student.fullName, records: [] };
    e.records.push({ status: r.status });
    byStudentId.set(r.studentId, e);
  });
  return {
    overall: summarise(rows),
    students: [...byStudentId.entries()].map(([studentId, e]) => ({ studentId, fullName: e.name, ...summarise(e.records) })),
  };
}

export async function percentage(user: AuthUser, studentId: string) {
  await assertStudentAccess(user, studentId);
  const recs = await prisma.attendance.findMany({ where: { studentId }, select: { status: true } });
  return { studentId, percentage: attendancePercentage(recs), ...summarise(recs) };
}

export async function lowAttendance(user: AuthUser, threshold = 75, classId?: string) {
  if (user.role === 'STUDENT') throw forbidden();
  const ids = await manageableClassIds(user);
  const where: Prisma.AttendanceWhereInput = {
    ...(ids ? { classId: { in: ids } } : {}),
    ...(classId ? { classId } : {}),
  };
  const rows = await prisma.attendance.findMany({
    where,
    select: { studentId: true, status: true, student: { select: { fullName: true, class: { select: { name: true } } } } },
  });
  const map = new Map<string, { fullName: string; className?: string; records: { status: any }[] }>();
  rows.forEach((r) => {
    const e = map.get(r.studentId) ?? { fullName: r.student.fullName, className: r.student.class?.name, records: [] };
    e.records.push({ status: r.status });
    map.set(r.studentId, e);
  });
  return [...map.entries()]
    .map(([studentId, e]) => ({ studentId, fullName: e.fullName, className: e.className, ...summarise(e.records) }))
    .filter((s) => s.percentage < threshold)
    .sort((a, b) => a.percentage - b.percentage);
}

export async function exportCsv(user: AuthUser, q: any) {
  const rows = await history(user, q);
  return toCsv(
    rows.map((r) => ({
      date: r.date.toISOString().slice(0, 10),
      class: r.class.name,
      student: r.student.fullName,
      status: r.status,
      note: r.note ?? '',
    })),
    ['date', 'class', 'student', 'status', 'note'],
  );
}
