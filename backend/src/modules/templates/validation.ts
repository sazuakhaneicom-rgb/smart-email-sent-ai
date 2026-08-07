import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  thumbnail: z.string().url().optional(),
  designJson: z.record(z.string(), z.unknown()),
  htmlContent: z.string().optional(),
  tags: z.array(z.string().max(50)).optional(),
  isPublic: z.boolean().optional().default(false),
});

export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  thumbnail: z.string().url().optional(),
  designJson: z.record(z.string(), z.unknown()).optional(),
  htmlContent: z.string().optional(),
  tags: z.array(z.string().max(50)).optional(),
  isPublic: z.boolean().optional(),
});

export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateDto = z.infer<typeof updateTemplateSchema>;
