import { z } from 'zod';

export const classBody = z.object({
  name: z.string().trim().min(1).max(40),
  gradeId: z.string().min(1),
  teacherId: z.string().nullable().optional(),
  subjectIds: z.array(z.string()).optional(),
});
export const classUpdateBody = classBody.partial();
export const classSubjectsBody = z.object({ subjectIds: z.array(z.string()) });
export const classListQuery = z.object({ gradeId: z.string().optional(), q: z.string().optional() });
