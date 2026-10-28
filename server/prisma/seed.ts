import { PrismaClient, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PASSWORD = 'Password123!';

// deterministic pseudo-random so seeds are reproducible
let seed = 42;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = <T,>(a: T[]) => a[Math.floor(rand() * a.length)];

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 12);

  const grades = await Promise.all(
    ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11'].map((name) =>
      prisma.grade.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  const subjectDefs = [
    ['Mathematics', 'MATH'], ['Science', 'SCI'], ['English', 'ENG'], ['History', 'HIST'], ['ICT', 'ICT'],
  ];
  const subjects = await Promise.all(
    subjectDefs.map(([name, code]) => prisma.subject.upsert({ where: { name }, update: {}, create: { name, code } })),
  );

  await prisma.user.upsert({
    where: { email: 'admin@edutrack.local' }, update: {},
    create: { fullName: 'Ada Admin', email: 'admin@edutrack.local', password: hash, role: 'ADMIN' },
  });
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@edutrack.local' }, update: {},
    create: { fullName: 'Tara Teacher', email: 'teacher@edutrack.local', password: hash, role: 'TEACHER', phone: '0770000001' },
  });
  await prisma.teacherSubject.createMany({
    data: subjects.slice(0, 3).map((s) => ({ teacherId: teacher.id, subjectId: s.id })),
    skipDuplicates: true,
  });

  const grade10 = grades.find((g) => g.name === 'Grade 10')!;
  const cls = await prisma.class.upsert({
    where: { name_gradeId: { name: '10-A', gradeId: grade10.id } },
    update: { teacherId: teacher.id },
    create: { name: '10-A', gradeId: grade10.id, teacherId: teacher.id },
  });
  await prisma.classSubject.createMany({
    data: subjects.map((s) => ({ classId: cls.id, subjectId: s.id })),
    skipDuplicates: true,
  });

  const names = ['Nimal Perera', 'Kamala Silva', 'Sunil Fernando', 'Anusha Jayasinghe', 'Ravi Kumar', 'Dilini Weerasinghe', 'Tharindu Bandara', 'Sanduni Rajapaksa', 'Mohamed Rizwan', 'Priya Selvarajah', 'Kavindu Herath', 'Ishara Gunawardena'];
  const students = [];
  for (const [i, fullName] of names.entries()) {
    const email = `student${i + 1}@edutrack.local`;
    students.push(
      await prisma.user.upsert({
        where: { email }, update: {},
        create: {
          fullName, email, password: hash, role: 'STUDENT', gradeId: grade10.id, classId: cls.id,
          gender: i % 2 ? 'FEMALE' : 'MALE', parentName: `Parent of ${fullName.split(' ')[0]}`, parentPhone: `07710000${String(i).padStart(2, '0')}`,
          address: { create: { city: 'Vavuniya', district: 'Vavuniya' } },
        },
      }),
    );
  }

  // Skip demo history if it already exists
  if ((await prisma.attendance.count({ where: { classId: cls.id } })) > 0) {
    console.log('Seed data already present – skipping demo attendance and marks.');
    return;
  }

  // 20 school days of attendance; each student gets an "engagement" level
  const level = new Map(students.map((s) => [s.id, 0.55 + rand() * 0.45]));
  const days: Date[] = [];
  for (let d = 1; days.length < 20; d++) {
    const dt = new Date(Date.now() - d * 86400000);
    if (dt.getUTCDay() % 6 !== 0) days.push(new Date(dt.toISOString().slice(0, 10) + 'T00:00:00.000Z'));
  }
  const attData = students.flatMap((s) =>
    days.map((date) => {
      const r = rand();
      const p = level.get(s.id)!;
      const status: AttendanceStatus = r < p ? 'PRESENT' : r < p + 0.05 ? 'LATE' : r < p + 0.08 ? 'EXCUSED' : 'ABSENT';
      return { studentId: s.id, classId: cls.id, date, status };
    }),
  );
  await prisma.attendance.createMany({ data: attData, skipDuplicates: true });

  // 3 published exams per subject-set
  const grade = (s: number, m: number) => { const p = (s / m) * 100; return p >= 75 ? 'A' : p >= 65 ? 'B' : p >= 50 ? 'C' : p >= 35 ? 'D' : 'F'; };
  for (const [idx, subject] of subjects.slice(0, 3).entries()) {
    const exam = await prisma.exam.create({
      data: { title: `Term 1 ${subject.name}`, subjectId: subject.id, classId: cls.id, date: new Date(Date.now() - (30 - idx * 7) * 86400000), maxMarks: 100, published: true },
    });
    await prisma.mark.createMany({
      data: students.map((s) => {
        const score = Math.max(5, Math.min(100, Math.round(level.get(s.id)! * 95 - 15 + (rand() - 0.5) * 30)));
        return { examId: exam.id, studentId: s.id, score, grade: grade(score, 100) };
      }),
    });
  }
  await prisma.exam.create({
    data: { title: 'Term 2 Mathematics', subjectId: pick(subjects).id, classId: cls.id, date: new Date(Date.now() + 14 * 86400000), maxMarks: 100 },
  });

  console.log(`Seeded. Sign in with admin@edutrack.local / teacher@edutrack.local / student1@edutrack.local — password: ${PASSWORD}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
