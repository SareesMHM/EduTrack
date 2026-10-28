import { RequestHandler } from 'express';
import { AnyZodObject, ZodTypeAny } from 'zod';

interface Schemas { body?: ZodTypeAny; query?: AnyZodObject; params?: AnyZodObject }

export const validate =
  (s: Schemas): RequestHandler =>
  (req, _res, next) => {
    try {
      if (s.body) req.body = s.body.parse(req.body);
      if (s.query) Object.assign(req, { validatedQuery: s.query.parse(req.query) });
      if (s.params) req.params = s.params.parse(req.params) as any;
      next();
    } catch (e) {
      next(e);
    }
  };

/** Parsed query (use after validate({ query })). Falls back to raw query. */
export const getQuery = <T = any>(req: any): T => (req.validatedQuery ?? req.query) as T;
