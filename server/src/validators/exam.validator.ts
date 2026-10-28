import { z } from 'zod';

export const examBody = z.object({
  title: z.string().trim().min(2).max(120),
  subjectId: z.string().min(1),
  classId: z.string().min(1),
  date: z.coerce.date(),
  maxMarks: z.coerce.number().int().min(1).max(1000).default(100),
});
export const examUpdateBody = examBody.partial();
export const examListQuery = z.object({
  classId: z.string().optional(),
  subjectId: z.string().optional(),
  published: z.enum(['true', 'false']).optional(),
  upcoming: z.enum(['true']).optional(),
});
