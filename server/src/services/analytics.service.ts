import { prisma } from '../config/db';
import { attendancePercentage } from '../utils/attendance';

export interface StudentFeatures {
  attendancePct: number;
  avgScorePct: number;
  examsTaken: number;
  scoreTrend: number; // last exam % minus first exam %
  lateRate: number;   // 0..1
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export async function bulkFeatures(studentIds: string[]): Promise<Map<string, StudentFeatures>> {
  if (!studentIds.length) return new Map();
  const [att, marks] = await Promise.all([
    prisma.attendance.findMany({ where: { studentId: { in: studentIds } }, select: { studentId: true, status: true } }),
    prisma.mark.findMany({
      where: { studentId: { in: studentIds } },
      select: { studentId: true, score: true, exam: { select: { maxMarks: true, date: true } } },
    }),
  ]);
  const out = new Map<string, StudentFeatures>();
  for (const id of studentIds) {
    const a = att.filter((x) => x.studentId === id);
    const m = marks
      .filter((x) => x.studentId === id)
      .map((x) => ({ pct: (x.score / x.exam.maxMarks) * 100, date: x.exam.date.getTime() }))
      .sort((p, q) => p.date - q.date);
    out.set(id, {
      attendancePct: attendancePercentage(a),
      avgScorePct: m.length ? r1(m.reduce((s, x) => s + x.pct, 0) / m.length) : 0,
      examsTaken: m.length,
      scoreTrend: m.length > 1 ? r1(m[m.length - 1].pct - m[0].pct) : 0,
      lateRate: a.length ? r1(a.filter((x) => x.status === 'LATE').length / a.length) : 0,
    });
  }
  return out;
}

/** Transparent rule-based flag. The ML model is a second, advisory opinion. */
export function riskReasons(f: StudentFeatures): string[] {
  const reasons: string[] = [];
  if (f.attendancePct < 75) reasons.push(`Attendance ${f.attendancePct}% (below 75%)`);
  if (f.examsTaken > 0 && f.avgScorePct < 40) reasons.push(`Average score ${f.avgScorePct}% (below 40%)`);
  if (f.examsTaken > 1 && f.scoreTrend <= -15) reasons.push(`Scores dropped ${Math.abs(f.scoreTrend)} points`);
  return reasons;
}

export async function atRiskStudents(classIds: string[] | null) {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT', isActive: true, ...(classIds ? { classId: { in: classIds } } : {}) },
    select: { id: true, fullName: true, class: { select: { id: true, name: true } } },
  });
  const feats = await bulkFeatures(students.map((s) => s.id));
  return students
    .map((s) => ({ studentId: s.id, fullName: s.fullName, class: s.class, features: feats.get(s.id)!, reasons: riskReasons(feats.get(s.id)!) }))
    .filter((s) => s.reasons.length > 0)
    .sort((a, b) => b.reasons.length - a.reasons.length || a.features.attendancePct - b.features.attendancePct);
}
