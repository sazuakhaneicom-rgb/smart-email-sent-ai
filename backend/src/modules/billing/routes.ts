import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { validate } from '../../middleware/validate';
import { webhookRateLimit } from '../../middleware/rateLimiter';
import { billingController } from './controller';
import { subscribePlanSchema } from './validation';

const router = Router({ mergeParams: true });

// GET /workspaces/:wid/billing
router.get(
  '/',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => billingController.getBilling(req as any, res)
);

// POST /workspaces/:wid/billing/subscribe
router.post(
  '/subscribe',
  authenticate,
  requireWorkspaceMember('owner'),
  validate(subscribePlanSchema),
  (req, res) => billingController.subscribe(req as any, res)
);

// GET /workspaces/:wid/billing/invoices
router.get(
  '/invoices',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => billingController.getInvoices(req as any, res)
);

// POST /workspaces/:wid/billing/webhook (payment provider webhooks — no auth)
router.post(
  '/webhook',
  webhookRateLimit,
  (req, res) => billingController.webhook(req as any, res)
);

export default router;
