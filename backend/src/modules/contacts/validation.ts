import { z } from 'zod';

export const createContactSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  tags: z.array(z.string().max(50)).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
  listIds: z.array(z.string()).optional(),
  status: z.enum(['subscribed', 'unsubscribed']).optional().default('subscribed'),
});

export const updateContactSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  tags: z.array(z.string().max(50)).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
  listIds: z.array(z.string()).optional(),
  status: z.enum(['subscribed', 'unsubscribed', 'bounced', 'complained']).optional(),
});

export const importContactsSchema = z.object({
  csvContent: z.string().min(1),
  mappings: z.object({
    email: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  }),
  listIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const listContactsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['subscribed', 'unsubscribed', 'bounced', 'complained']).optional(),
  listId: z.string().optional(),
  tag: z.string().optional(),
});

export type CreateContactDto = z.infer<typeof createContactSchema>;
export type UpdateContactDto = z.infer<typeof updateContactSchema>;
export type ImportContactsDto = z.infer<typeof importContactsSchema>;
