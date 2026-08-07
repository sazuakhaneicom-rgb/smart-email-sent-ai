import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { validate } from '../../middleware/validate';
import { auditLog } from '../../middleware/auditLog';
import { templatesController } from './controller';
import { createTemplateSchema, updateTemplateSchema } from './validation';

const router = Router({ mergeParams: true });

router.get(
  '/',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => templatesController.list(req as any, res)
);

router.post(
  '/',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(createTemplateSchema),
  auditLog('templates.create'),
  (req, res) => templatesController.create(req as any, res)
);

router.get(
  '/:templateId',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => templatesController.getById(req as any, res)
);

router.patch(
  '/:templateId',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(updateTemplateSchema),
  auditLog('templates.update'),
  (req, res) => templatesController.update(req as any, res)
);

router.delete(
  '/:templateId',
  authenticate,
  requireWorkspaceMember('editor'),
  auditLog('templates.delete'),
  (req, res) => templatesController.delete(req as any, res)
);

router.post(
  '/:templateId/duplicate',
  authenticate,
  requireWorkspaceMember('editor'),
  auditLog('templates.duplicate'),
  (req, res) => templatesController.duplicate(req as any, res)
);

export default router;
