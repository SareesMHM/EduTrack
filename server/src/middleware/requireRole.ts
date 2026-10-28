import { RequestHandler } from 'express';
import { forbidden, unauthorized } from '../utils/httpError';
import { Role } from '../types';

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    next();
  };
