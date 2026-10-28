import { RequestHandler } from 'express';
import { forbidden, unauthorized } from '../utils/httpError';

/** Students may only touch resources whose `param` equals their own id. Staff pass through. */
export const requireOwnership =
  (param = 'id'): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (req.user.role === 'STUDENT' && req.params[param] !== req.user.id) return next(forbidden());
    next();
  };
