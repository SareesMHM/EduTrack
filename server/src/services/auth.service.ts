import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { conflict, unauthorized, badRequest } from '../utils/httpError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';
import { logger } from '../utils/logger';
import { audit } from './audit.service';
import { userSelect, getUser } from './user.service';

const tokensFor = (u: { id: string; role: 'ADMIN' | 'TEACHER' | 'STUDENT' }) => ({
  accessToken: signAccessToken({ id: u.id, role: u.role }),
  refreshToken: signRefreshToken({ id: u.id, role: u.role }),
});

// Prevent user enumeration / timing differences on login
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export async function register(input: any) {
  const { password, address, gradeId, ...rest } = input;
  if (await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } })) {
    throw conflict('Email is already registered');
  }
  // Public sign-up always creates STUDENT accounts. Staff accounts are created by an admin.
  const user = await prisma.user.create({
    data: {
      ...rest,
      role: 'STUDENT',
      gradeId: gradeId || undefined,
      password: await hashPassword(password),
      address: address ? { create: address } : undefined,
    },
    select: userSelect,
  });
  await audit(user.id, 'REGISTER', 'User', user.id);
  return { user, ...tokensFor(user) };
}

export async function login(email: string, password: string) {
  const u = await prisma.user.findUnique({ where: { email } });
  const ok = await verifyPassword(password, u?.password ?? DUMMY_HASH);
  if (!u || !ok || !u.isActive) throw unauthorized('Incorrect email or password');
  await audit(u.id, 'LOGIN', 'User', u.id);
  return { user: await getUser(u.id), ...tokensFor(u) };
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw unauthorized('Session expired. Please sign in again.');
  }
  const u = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, role: true, isActive: true } });
  if (!u || !u.isActive) throw unauthorized();
  return tokensFor(u);
}

export async function forgotPassword(email: string) {
  const u = await prisma.user.findUnique({ where: { email }, select: { id: true, isActive: true } });
  if (u?.isActive) {
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: u.id },
      data: {
        resetTokenHash: crypto.createHash('sha256').update(token).digest('hex'),
        resetTokenExpires: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    // TODO: plug in an email provider. In development the link is logged instead.
    if (env.NODE_ENV !== 'production') {
      logger.info('Password reset link', { url: `${env.CLIENT_URL.split(',')[0]}/reset-password/${token}` });
    }
  }
  // Same response either way so the endpoint can't be used to discover accounts.
}

export async function resetPassword(token: string, password: string) {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const u = await prisma.user.findFirst({ where: { resetTokenHash: hash, resetTokenExpires: { gt: new Date() } } });
  if (!u) throw badRequest('This reset link is invalid or has expired');
  await prisma.user.update({
    where: { id: u.id },
    data: { password: await hashPassword(password), resetTokenHash: null, resetTokenExpires: null },
  });
  await audit(u.id, 'RESET_PASSWORD', 'User', u.id);
}

export async function changePassword(userId: string, current: string, next: string) {
  const u = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!(await verifyPassword(current, u.password))) throw badRequest('Current password is incorrect');
  await prisma.user.update({ where: { id: userId }, data: { password: await hashPassword(next) } });
  await audit(userId, 'CHANGE_PASSWORD', 'User', userId);
}

export async function updateMe(userId: string, input: any) {
  const { address, ...rest } = input;
  return prisma.user.update({
    where: { id: userId },
    data: { ...rest, address: address ? { upsert: { create: address, update: address } } : undefined },
    select: userSelect,
  });
}

export const setAvatar = (userId: string, filename: string) =>
  prisma.user.update({ where: { id: userId }, data: { profileImage: `/uploads/${filename}` }, select: userSelect });
