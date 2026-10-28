import { z } from 'zod';
import { profileFields } from './auth.validator';

export const studentListQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().trim().max(100).optional(),
  classId: z.string().optional(),
  gradeId: z.string().optional(),
  active: z.enum(['true', 'false']).optional(),
});
export const transferBody = z.object({ classId: z.string().min(1) });
export const updateStudentBody = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    gradeId: z.string().nullable(),
    ...profileFields,
  })
  .partial();
export const selfContactBody = z.object({
  phone: profileFields.phone,
  address: profileFields.address,
});
