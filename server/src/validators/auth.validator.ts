import { z } from 'zod';

export const password = z
  .string()
  .min(8, 'At least 8 characters')
  .max(72, 'At most 72 characters')
  .regex(/[A-Za-z]/, 'Include a letter')
  .regex(/\d/, 'Include a number');

export const addressSchema = z.object({
  number: z.string().max(20).optional(),
  street: z.string().max(120).optional(),
  city: z.string().max(80).optional(),
  district: z.string().max(80).optional(),
  postalCode: z.string().max(12).optional(),
});

export const profileFields = {
  phone: z.string().max(20).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.coerce.date().optional(),
  parentName: z.string().max(120).optional(),
  parentPhone: z.string().max(20).optional(),
  parentNic: z.string().max(20).optional(),
  address: addressSchema.optional(),
};

export const registerBody = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password,
  gradeId: z.string().optional(),
  ...profileFields,
});

export const loginBody = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const refreshBody = z.object({ refreshToken: z.string().min(1) });
export const forgotBody = z.object({ email: z.string().trim().toLowerCase().email() });
export const resetBody = z.object({ password });
export const resetParams = z.object({ token: z.string().min(20) });
export const changePasswordBody = z.object({ currentPassword: z.string().min(1), newPassword: password });

export const updateMeBody = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: profileFields.phone,
  address: addressSchema.optional(),
});
