import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { validate } from '../../middleware/validate';
import { auditLog } from '../../middleware/auditLog';
import { campaignsController } from './controller';
import {
  createCampaignSchema,
  updateCampaignSchema,
  scheduleCampaignSchema,
  testSendSchema,
} from './validation';

const router = Router({ mergeParams: true });

// GET /workspaces/:wid/campaigns
router.get(
  '/',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => campaignsController.list(req as any, res)
);

// POST /workspaces/:wid/campaigns
router.post(
  '/',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(createCampaignSchema),
  auditLog('campaigns.create'),
  (req, res) => campaignsController.create(req as any, res)
);

// GET /workspaces/:wid/campaigns/:campaignId
router.get(
  '/:campaignId',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => campaignsController.getById(req as any, res)
);

// PATCH /workspaces/:wid/campaigns/:campaignId
router.patch(
  '/:campaignId',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(updateCampaignSchema),
  auditLog('campaigns.update'),
  (req, res) => campaignsController.update(req as any, res)
);

// DELETE /workspaces/:wid/campaigns/:campaignId
router.delete(
  '/:campaignId',
  authenticate,
  requireWorkspaceMember('editor'),
  auditLog('campaigns.delete'),
  (req, res) => campaignsController.delete(req as any, res)
);

// POST /workspaces/:wid/campaigns/:campaignId/send
router.post(
  '/:campaignId/send',
  authenticate,
  requireWorkspaceMember('editor'),
  auditLog('campaigns.send'),
  (req, res) => campaignsController.send(req as any, res)
);

// POST /workspaces/:wid/campaigns/:campaignId/schedule
router.post(
  '/:campaignId/schedule',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(scheduleCampaignSchema),
  auditLog('campaigns.schedule'),
  (req, res) => campaignsController.schedule(req as any, res)
);

// POST /workspaces/:wid/campaigns/:campaignId/pause
router.post(
  '/:campaignId/pause',
  authenticate,
  requireWorkspaceMember('editor'),
  auditLog('campaigns.pause'),
  (req, res) => campaignsController.pause(req as any, res)
);

// POST /workspaces/:wid/campaigns/:campaignId/test-send
router.post(
  '/:campaignId/test-send',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(testSendSchema),
  (req, res) => campaignsController.testSend(req as any, res)
);

// GET /workspaces/:wid/campaigns/unsubscribe/:token (public)
router.get(
  '/unsubscribe/:token',
  (req, res) => campaignsController.unsubscribe(req as any, res)
);

export default router;
