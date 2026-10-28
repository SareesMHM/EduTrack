import { z } from 'zod';

export const subjectBody = z.object({
  name: z.string().trim().min(2).max(80),
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{2,12}$/, 'Use 2-12 letters, numbers or dashes'),
});
export const subjectUpdateBody = subjectBody.partial();
export const gradeBody = z.object({ name: z.string().trim().min(1).max(40) });
