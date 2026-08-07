import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { dashboardController } from './controller';

const router = Router({ mergeParams: true });

// GET /workspaces/:wid/dashboard/summary
router.get(
  '/summary',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => dashboardController.getSummary(req as any, res)
);

// GET /workspaces/:wid/dashboard/activity
router.get(
  '/activity',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => dashboardController.getActivity(req as any, res)
);

// GET /workspaces/:wid/dashboard/chart
router.get(
  '/chart',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => dashboardController.getChart(req as any, res)
);

export default router;
