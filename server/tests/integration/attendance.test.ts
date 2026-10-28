import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { PASSWORD, resetDb } from '../setup';

const run = process.env.DATABASE_URL ? describe : describe.skip;

run('attendance & marks', () => {
  let app: any; let ctx: Awaited<ReturnType<typeof resetDb>>; let teacher: string; let other: string; let student: string;
  const auth = (t: string) => ({ Authorization: `Bearer ${t}` });
  const login = async (email: string) => (await request(app).post('/api/auth/login').send({ email, password: PASSWORD })).body.data.accessToken as string;

  beforeAll(async () => {
    ctx = await resetDb();
    app = (await import('../../src/app')).app;
    [teacher, other, student] = await Promise.all([login('teacher@t.io'), login('other@t.io'), login('s1@t.io')]);
  });

  it('bulk-marks attendance and computes a percentage', async () => {
    const res = await request(app).post('/api/attendance/bulk').set(auth(teacher)).send({
      classId: ctx.cls.id, date: '2024-03-04',
      records: [{ studentId: ctx.s1.id, status: 'PRESENT' }, { studentId: ctx.s2.id, status: 'ABSENT' }],
    });
    expect(res.status).toBe(201);
    const pct = await request(app).get(`/api/attendance/percentage/${ctx.s1.id}`).set(auth(student));
    expect(pct.body.data.percentage).toBe(100);
  });

  it('prevents a teacher marking another teacher’s class', async () => {
    const res = await request(app).post('/api/attendance/bulk').set(auth(other)).send({
      classId: ctx.cls.id, date: '2024-03-05', records: [{ studentId: ctx.s1.id, status: 'PRESENT' }],
    });
    expect(res.status).toBe(403);
  });

  it('rejects marks above the exam maximum and grades valid ones', async () => {
    const exam = await request(app).post('/api/exams').set(auth(teacher)).send({
      title: 'Quiz 1', subjectId: ctx.subject.id, classId: ctx.cls.id, date: '2024-03-10', maxMarks: 50,
    });
    expect(exam.status).toBe(201);
    const bad = await request(app).post('/api/marks/bulk').set(auth(teacher)).send({ examId: exam.body.data.id, marks: [{ studentId: ctx.s1.id, score: 51 }] });
    expect(bad.status).toBe(400);
    const good = await request(app).post('/api/marks/bulk').set(auth(teacher)).send({ examId: exam.body.data.id, marks: [{ studentId: ctx.s1.id, score: 45 }] });
    expect(good.status).toBe(201);
    const hidden = await request(app).get(`/api/marks/student/${ctx.s1.id}`).set(auth(student));
    expect(hidden.body.data).toHaveLength(0); // unpublished results stay hidden from students
    await request(app).post(`/api/exams/${exam.body.data.id}/publish`).set(auth(teacher)).expect(200);
    const shown = await request(app).get(`/api/marks/student/${ctx.s1.id}`).set(auth(student));
    expect(shown.body.data[0].grade).toBe('A');
  });
});
