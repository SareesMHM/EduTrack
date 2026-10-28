import { z } from 'zod';
import { password, profileFields } from './auth.validator';

export const createUserBody = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password,
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
  gradeId: z.string().optional(),
  classId: z.string().optional(),
  ...profileFields,
});

export const updateUserBody = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
    gradeId: z.string().nullable(),
    classId: z.string().nullable(),
    ...profileFields,
  })
  .partial();

export const statusBody = z.object({ isActive: z.boolean() });
export const adminResetBody = z.object({ newPassword: password });
export const bulkImportBody = z.object({ users: z.array(createUserBody).min(1).max(500) });

export const userListQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().trim().max(100).optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
  active: z.enum(['true', 'false']).optional(),
});
