import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { validate } from '../../middleware/validate';
import { auditLog } from '../../middleware/auditLog';
import { domainsController } from './controller';
import { addDomainSchema } from './validation';

const router = Router({ mergeParams: true });

router.get(
  '/',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => domainsController.list(req as any, res)
);

router.post(
  '/',
  authenticate,
  requireWorkspaceMember('admin'),
  validate(addDomainSchema),
  auditLog('domains.add'),
  (req, res) => domainsController.add(req as any, res)
);

router.get(
  '/:domainId',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => domainsController.getById(req as any, res)
);

router.delete(
  '/:domainId',
  authenticate,
  requireWorkspaceMember('admin'),
  auditLog('domains.delete'),
  (req, res) => domainsController.delete(req as any, res)
);

router.post(
  '/:domainId/verify',
  authenticate,
  requireWorkspaceMember('admin'),
  auditLog('domains.verify'),
  (req, res) => domainsController.verify(req as any, res)
);

export default router;
