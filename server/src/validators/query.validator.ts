import { z } from 'zod';

export const idParam = z.object({ id: z.string().min(1) });
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
export const toDateOnly = (s: string) => new Date(`${s}T00:00:00.000Z`);

export const pageQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().trim().max(100).optional(),
});
