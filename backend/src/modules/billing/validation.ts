import { z } from 'zod';

export const subscribePlanSchema = z.object({
  tier: z.enum(['starter', 'growth', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'yearly']),
  paymentMethod: z.enum(['stripe', 'sslcommerz']),
  stripePaymentMethodId: z.string().optional(),
});

export type SubscribePlanDto = z.infer<typeof subscribePlanSchema>;
