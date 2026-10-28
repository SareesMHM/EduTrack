import { Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { conflict, notFound } from '../utils/httpError';
import { hashPassword } from '../utils/password';
import { pageMeta, paginate } from '../utils/pagination';
import { audit } from './audit.service';

export const userSelect = {
  id: true, fullName: true, email: true, role: true, isActive: true, phone: true, profileImage: true,
  gender: true, dateOfBirth: true, parentName: true, parentPhone: true, parentNic: true,
  gradeId: true, classId: true, createdAt: true, updatedAt: true,
  grade: { select: { id: true, name: true } },
  class: { select: { id: true, name: true, grade: { select: { name: true } } } },
  address: true,
} satisfies Prisma.UserSelect;

type Addr = { number?: string; street?: string; city?: string; district?: string; postalCode?: string };
const addressWrite = (a?: Addr) => (a ? { upsert: { create: a, update: a } } : undefined);

export async function listUsers(q: any, extraWhere: Prisma.UserWhereInput = {}) {
  const { page, limit, skip, take } = paginate(q);
  const where: Prisma.UserWhereInput = {
    ...extraWhere,
    ...(q.role ? { role: q.role } : {}),
    ...(q.active ? { isActive: q.active === 'true' } : {}),
    ...(q.q
      ? { OR: [{ fullName: { contains: q.q, mode: 'insensitive' } }, { email: { contains: q.q, mode: 'insensitive' } }] }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, orderBy: { fullName: 'asc' }, skip, take }),
    prisma.user.count({ where }),
  ]);
  return { items, meta: pageMeta(total, page, limit) };
}

export async function getUser(id: string) {
  const u = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!u) throw notFound('User not found');
  return u;
}

export async function createUser(actorId: string | undefined, input: any) {
  const { password, address, gradeId, classId, ...rest } = input;
  const exists = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
  if (exists) throw conflict('Email is already registered');
  const user = await prisma.user.create({
    data: {
      ...rest,
      gradeId: gradeId || undefined,
      classId: classId || undefined,
      password: await hashPassword(password),
      address: address ? { create: address } : undefined,
    },
    select: userSelect,
  });
  await audit(actorId, 'CREATE', 'User', user.id, { role: user.role });
  return user;
}

export async function updateUser(actorId: string | undefined, id: string, input: any) {
  const { address, ...rest } = input;
  const user = await prisma.user.update({
    where: { id },
    data: { ...rest, address: addressWrite(address) },
    select: userSelect,
  });
  await audit(actorId, 'UPDATE', 'User', id);
  return user;
}

export async function setStatus(actorId: string, id: string, isActive: boolean) {
  if (actorId === id && !isActive) throw conflict('You cannot disable your own account');
  const u = await prisma.user.update({ where: { id }, data: { isActive }, select: userSelect });
  await audit(actorId, isActive ? 'ACTIVATE' : 'ARCHIVE', 'User', id);
  return u;
}

export async function adminResetPassword(actorId: string, id: string, newPassword: string) {
  await prisma.user.update({ where: { id }, data: { password: await hashPassword(newPassword), resetTokenHash: null, resetTokenExpires: null } });
  await audit(actorId, 'RESET_PASSWORD', 'User', id);
}

export async function deleteUser(actorId: string, id: string) {
  if (actorId === id) throw conflict('You cannot delete your own account');
  await prisma.user.delete({ where: { id } });
  await audit(actorId, 'DELETE', 'User', id);
}

export async function bulkImport(actorId: string, users: any[]) {
  const results: { email: string; ok: boolean; error?: string }[] = [];
  for (const u of users) {
    try {
      await createUser(actorId, u);
      results.push({ email: u.email, ok: true });
    } catch (e: any) {
      results.push({ email: u.email, ok: false, error: e.message });
    }
  }
  return { created: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results };
}
