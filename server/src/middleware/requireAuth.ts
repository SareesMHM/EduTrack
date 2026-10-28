import { RequestHandler } from 'express';
import { prisma } from '../config/db';
import { unauthorized } from '../utils/httpError';
import { verifyAccessToken } from '../utils/jwt';

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw unauthorized();
    let payload;
    try {
      payload = verifyAccessToken(header.slice(7));
    } catch {
      throw unauthorized('Invalid or expired token');
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) throw unauthorized('Account not found or disabled');
    req.user = { id: user.id, role: user.role };
    next();
  } catch (e) {
    next(e);
  }
};
