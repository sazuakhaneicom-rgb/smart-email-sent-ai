import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { settingsController } from './controller';

const router = Router();

// GET /settings/profile
router.get(
  '/profile',
  authenticate,
  (req, res) => settingsController.getProfile(req as any, res)
);

// PATCH /settings/profile
router.patch(
  '/profile',
  authenticate,
  (req, res) => settingsController.updateProfile(req as any, res)
);

// GET /settings/sessions
router.get(
  '/sessions',
  authenticate,
  (req, res) => settingsController.getSessions(req as any, res)
);

// DELETE /settings/sessions (revoke all)
router.delete(
  '/sessions',
  authenticate,
  (req, res) => settingsController.revokeAllSessions(req as any, res)
);

export default router;
