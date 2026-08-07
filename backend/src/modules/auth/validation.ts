import { z } from 'zod';

export const syncUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url().optional(),
  language: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).max(128),
});

export const mfaEnrollSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, 'Invalid phone number format'),
});

export const mfaVerifySchema = z.object({
  sessionInfo: z.string().min(1),
  code: z.string().length(6),
});

export type SyncUserDto = z.infer<typeof syncUserSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type MfaEnrollDto = z.infer<typeof mfaEnrollSchema>;
export type MfaVerifyDto = z.infer<typeof mfaVerifySchema>;
