import { z } from 'zod';

export const bulkMarksBody = z.object({
  examId: z.string().min(1),
  marks: z.array(z.object({ studentId: z.string().min(1), score: z.coerce.number().min(0) })).min(1).max(200),
});
export const updateMarkBody = z.object({ score: z.coerce.number().min(0) });
