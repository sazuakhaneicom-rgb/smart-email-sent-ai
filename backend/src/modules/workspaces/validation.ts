import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  industry: z.string().max(50).optional(),
  timezone: z.string().max(50).optional(),
  defaultFromName: z.string().max(100).optional(),
  defaultFromEmail: z.string().email().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().optional(),
  industry: z.string().max(50).optional(),
  timezone: z.string().max(50).optional(),
  defaultFromName: z.string().max(100).optional(),
  defaultFromEmail: z.string().email().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
});

export const updateMemberSchema = z.object({
  role: z.enum(['admin', 'editor', 'viewer']),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberDto = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberDto = z.infer<typeof updateMemberSchema>;
