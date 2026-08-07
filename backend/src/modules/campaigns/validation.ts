import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(500),
  previewText: z.string().max(200).optional(),
  fromName: z.string().min(1).max(100),
  fromEmail: z.string().email(),
  replyTo: z.string().email().optional(),
  templateId: z.string().optional(),
  designJson: z.record(z.string(), z.unknown()).optional(),
  htmlContent: z.string().optional(),
  recipientListIds: z.array(z.string()).min(1, 'At least one list required'),
  recipientTags: z.array(z.string()).optional(),
  domainId: z.string().optional(),
});

export const updateCampaignSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  subject: z.string().min(1).max(500).optional(),
  previewText: z.string().max(200).optional(),
  fromName: z.string().max(100).optional(),
  fromEmail: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  templateId: z.string().optional(),
  designJson: z.record(z.string(), z.unknown()).optional(),
  htmlContent: z.string().optional(),
  recipientListIds: z.array(z.string()).optional(),
  recipientTags: z.array(z.string()).optional(),
  domainId: z.string().optional(),
});

export const scheduleCampaignSchema = z.object({
  scheduledAt: z.string().datetime({ message: 'Must be a valid ISO 8601 datetime' }),
});

export const testSendSchema = z.object({
  toEmail: z.string().email(),
});

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignDto = z.infer<typeof updateCampaignSchema>;
export type ScheduleCampaignDto = z.infer<typeof scheduleCampaignSchema>;
export type TestSendDto = z.infer<typeof testSendSchema>;
