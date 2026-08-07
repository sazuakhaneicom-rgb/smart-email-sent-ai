import { z } from 'zod';
import { SUBJECT_MAX_CHARS, TEMPLATE_NAME_MAX_CHARS, TAG_MAX_CHARS } from './constants';

// ============================================
// Auth Validators
// ============================================

export const emailSchema = z
  .string()
  .min(1, 'ইমেইল আবশ্যক')
  .email('সঠিক ইমেইল ঠিকানা দিন');

export const passwordSchema = z
  .string()
  .min(8, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে')
  .regex(/[A-Z]/, 'পাসওয়ার্ডে কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে')
  .regex(/[0-9]/, 'পাসওয়ার্ডে কমপক্ষে একটি সংখ্যা থাকতে হবে');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'পাসওয়ার্ড আবশ্যক'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে').max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'শর্তাবলী মেনে নেওয়া আবশ্যক' }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'পাসওয়ার্ড মেলেনি',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'বর্তমান পাসওয়ার্ড আবশ্যক'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'নতুন পাসওয়ার্ড মেলেনি',
    path: ['confirmPassword'],
  });

// ============================================
// Onboarding Validators
// ============================================

export const workspaceSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর').max(50, 'নাম সর্বোচ্চ ৫০ অক্ষর'),
  businessType: z.enum(['ecommerce', 'education', 'agency', 'brand', 'other']),
});

// ============================================
// Contact Validators
// ============================================

export const contactSchema = z.object({
  name: z.string().min(1, 'নাম আবশ্যক').max(200),
  email: emailSchema,
  phone: z.string().optional(),
  company: z.string().optional(),
  tags: z
    .array(z.string().max(TAG_MAX_CHARS))
    .max(50, 'সর্বোচ্চ ৫০টি ট্যাগ'),
});

// ============================================
// Campaign Validators
// ============================================

export const campaignStep1Schema = z.object({
  name: z.string().min(1, 'Campaign নাম আবশ্যক').max(200),
  subject: z.string().min(1, 'Subject আবশ্যক').max(SUBJECT_MAX_CHARS, `Subject সর্বোচ্চ ${SUBJECT_MAX_CHARS} অক্ষর`),
  fromName: z.string().min(1, 'প্রেরকের নাম আবশ্যক'),
  fromEmail: emailSchema,
  replyTo: emailSchema.optional().or(z.literal('')),
});

export const campaignStep3Schema = z.object({
  listIds: z.array(z.string()).min(1, 'কমপক্ষে একটি List নির্বাচন করুন'),
});

export const testSendSchema = z.object({
  testEmail: emailSchema,
});

export const scheduleSchema = z.object({
  scheduledAt: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Schedule সময় অবশ্যই ভবিষ্যতে হতে হবে',
  }),
});

// ============================================
// Template Validators
// ============================================

export const templateNameSchema = z.object({
  name: z.string().min(1, 'নাম আবশ্যক').max(TEMPLATE_NAME_MAX_CHARS),
});

// ============================================
// Domain Validators
// ============================================

export const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'ডোমেইন আবশ্যক')
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/,
      'সঠিক ডোমেইন নাম দিন (যেমন: example.com)'
    ),
});

// ============================================
// Type exports
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type WorkspaceInput = z.infer<typeof workspaceSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CampaignStep1Input = z.infer<typeof campaignStep1Schema>;
export type DomainInput = z.infer<typeof domainSchema>;
