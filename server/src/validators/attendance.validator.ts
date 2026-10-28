import { z } from 'zod';
import { dateString } from './query.validator';

const status = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

export const bulkAttendanceBody = z.object({
  classId: z.string().min(1),
  date: dateString,
  records: z
    .array(z.object({ studentId: z.string().min(1), status, note: z.string().max(200).optional() }))
    .min(1)
    .max(200),
});
export const updateAttendanceBody = z.object({ status: status.optional(), note: z.string().max(200).nullable().optional() });
export const attendanceQuery = z.object({
  date: dateString.optional(),
  from: dateString.optional(),
  to: dateString.optional(),
  threshold: z.coerce.number().min(0).max(100).optional(),
  classId: z.string().optional(),
});
