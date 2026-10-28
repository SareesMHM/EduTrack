import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ??= 'test_secret_test_secret_test_secret_123';
process.env.JWT_REFRESH_SECRET ??= 'test_refresh_test_refresh_test_refresh_1';

export const prisma = new PrismaClient();
export const PASSWORD = 'Password123!';

/** Wipes all tables and creates one user per role plus a class. Needs a disposable test DATABASE_URL. */
export async function resetDb() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(), prisma.notification.deleteMany(), prisma.mark.deleteMany(), prisma.exam.deleteMany(),
    prisma.attendance.deleteMany(), prisma.classSubject.deleteMany(), prisma.teacherSubject.deleteMany(),
    prisma.address.deleteMany(), prisma.user.deleteMany(), prisma.class.deleteMany(), prisma.subject.deleteMany(), prisma.grade.deleteMany(),
  ]);
  const password = await bcrypt.hash(PASSWORD, 4);
  const grade = await prisma.grade.create({ data: { name: 'Grade 10' } });
  const subject = await prisma.subject.create({ data: { name: 'Mathematics', code: 'MATH' } });
  const admin = await prisma.user.create({ data: { fullName: 'Admin', email: 'admin@t.io', password, role: 'ADMIN' } });
  const teacher = await prisma.user.create({ data: { fullName: 'Teacher', email: 'teacher@t.io', password, role: 'TEACHER' } });
  const other = await prisma.user.create({ data: { fullName: 'Other Teacher', email: 'other@t.io', password, role: 'TEACHER' } });
  const cls = await prisma.class.create({ data: { name: '10-A', gradeId: grade.id, teacherId: teacher.id } });
  await prisma.classSubject.create({ data: { classId: cls.id, subjectId: subject.id } });
  const s1 = await prisma.user.create({ data: { fullName: 'Student One', email: 's1@t.io', password, role: 'STUDENT', classId: cls.id, gradeId: grade.id } });
  const s2 = await prisma.user.create({ data: { fullName: 'Student Two', email: 's2@t.io', password, role: 'STUDENT', classId: cls.id, gradeId: grade.id } });
  return { grade, subject, admin, teacher, other, cls, s1, s2 };
}
