import { z } from 'zod';

export const addDomainSchema = z.object({
  domain: z
    .string()
    .min(3)
    .max(253)
    .regex(/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/, 'Invalid domain format'),
  fromName: z.string().max(100).optional(),
  dkimSelector: z.string().max(50).optional().default('smartemail'),
});

export type AddDomainDto = z.infer<typeof addDomainSchema>;
