import { z, ZodTypeAny } from 'zod';

export const passwordRule = z
  .string()
  .min(8, 'Use at least 8 characters')
  .regex(/[A-Za-z]/, 'Include a letter')
  .regex(/\d/, 'Include a number');

/** Returns { field: message } for the first issue of each field, or {} when valid. */
export function fieldErrors(schema: ZodTypeAny, values: unknown): Record<string, string> {
  const r = schema.safeParse(values);
  if (r.success) return {};
  const out: Record<string, string> = {};
  r.error.issues.forEach((i) => { const k = i.path.join('.'); if (!out[k]) out[k] = i.message; });
  return out;
}

/** Drops empty strings so optional server fields are omitted rather than sent as "". */
export function clean<T extends Record<string, any>>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v !== undefined && v !== null)) as Partial<T>;
}
