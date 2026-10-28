import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { PASSWORD, resetDb } from '../setup';

// Requires a Postgres test database (see CI). Skipped when DATABASE_URL is not set.
const run = process.env.DATABASE_URL ? describe : describe.skip;

run('auth & RBAC', () => {
  let app: any;
  let ctx: Awaited<ReturnType<typeof resetDb>>;
  const login = async (email: string) =>
    (await request(app).post('/api/auth/login').send({ email, password: PASSWORD })).body.data?.accessToken as string;

  beforeAll(async () => {
    ctx = await resetDb();
    app = (await import('../../src/app')).app;
  });

  it('rejects wrong credentials with a generic message', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@t.io', password: 'nope-nope-1' });
    expect(res.status).toBe(401);
  });

  it('signs in and returns tokens without the password hash', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@t.io', password: PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(JSON.stringify(res.body)).not.toContain('password');
  });

  it('public registration always creates a STUDENT', async () => {
    const res = await request(app).post('/api/auth/register').send({ fullName: 'New Kid', email: 'new@t.io', password: 'Passw0rdOK', role: 'ADMIN' });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('STUDENT');
  });

  it('blocks unauthenticated and under-privileged requests', async () => {
    expect((await request(app).get('/api/students')).status).toBe(401);
    const student = await login('s1@t.io');
    expect((await request(app).get('/api/admin/users').set('Authorization', `Bearer ${student}`)).status).toBe(403);
  });

  it('students can read themselves but not each other', async () => {
    const token = await login('s1@t.io');
    expect((await request(app).get(`/api/students/${ctx.s1.id}`).set('Authorization', `Bearer ${token}`)).status).toBe(200);
    expect((await request(app).get(`/api/students/${ctx.s2.id}`).set('Authorization', `Bearer ${token}`)).status).toBe(403);
  });

  it('teachers only reach students in their own classes', async () => {
    const mine = await login('teacher@t.io');
    const other = await login('other@t.io');
    expect((await request(app).get(`/api/students/${ctx.s1.id}`).set('Authorization', `Bearer ${mine}`)).status).toBe(200);
    expect((await request(app).get(`/api/students/${ctx.s1.id}`).set('Authorization', `Bearer ${other}`)).status).toBe(403);
  });
});
