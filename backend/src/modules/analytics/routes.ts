import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { analyticsController } from './controller';

const router = Router({ mergeParams: true });

// GET /workspaces/:wid/analytics/overview
router.get(
  '/overview',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => analyticsController.getOverview(req as any, res)
);

// GET /workspaces/:wid/analytics/campaigns/:campaignId
router.get(
  '/campaigns/:campaignId',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => analyticsController.getCampaignStats(req as any, res)
);

// GET /track/open/:wid/:campaignId/:contactId — public tracking pixel
router.get(
  '/track/open/:wid/:campaignId/:contactId',
  (req, res) => analyticsController.trackOpen(req, res)
);

// GET /track/click/:wid/:campaignId/:contactId?url= — click redirect
router.get(
  '/track/click/:wid/:campaignId/:contactId',
  (req, res) => analyticsController.trackClick(req, res)
);

export default router;
