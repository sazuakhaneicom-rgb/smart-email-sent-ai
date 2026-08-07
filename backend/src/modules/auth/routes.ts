import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { authRateLimit } from '../../middleware/rateLimiter';
import { authController } from './controller';
import {
  syncUserSchema,
  changePasswordSchema,
  mfaEnrollSchema,
  mfaVerifySchema,
} from './validation';

const router = Router();

// POST /auth/sync - Sync Firebase user to Firestore profile
router.post(
  '/sync',
  authRateLimit,
  authenticate,
  validate(syncUserSchema),
  (req, res) => authController.syncUser(req as any, res)
);

// GET /auth/me - Get current user profile + workspaces
router.get(
  '/me',
  authenticate,
  (req, res) => authController.getMe(req as any, res)
);

// POST /auth/mfa/enroll - Initiate MFA enrollment
router.post(
  '/mfa/enroll',
  authenticate,
  validate(mfaEnrollSchema),
  (req, res) => authController.enrollMfa(req as any, res)
);

// POST /auth/mfa/verify - Verify MFA code
router.post(
  '/mfa/verify',
  authenticate,
  validate(mfaVerifySchema),
  (req, res) => authController.verifyMfa(req as any, res)
);

// POST /auth/change-password - Change password
router.post(
  '/change-password',
  authRateLimit,
  authenticate,
  validate(changePasswordSchema),
  (req, res) => authController.changePassword(req as any, res)
);

// GET /auth/sessions - List active sessions
router.get(
  '/sessions',
  authenticate,
  (req, res) => authController.getSessions(req as any, res)
);

// DELETE /auth/sessions/:id - Revoke a session
router.delete(
  '/sessions/:id',
  authenticate,
  (req, res) => authController.revokeSession(req as any, res)
);

export default router;
