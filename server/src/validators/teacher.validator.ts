import { z } from 'zod';
export const assignClassesBody = z.object({ classIds: z.array(z.string()).max(50) });
export const assignSubjectsBody = z.object({ subjectIds: z.array(z.string()).max(50) });
