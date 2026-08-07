import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { validate } from '../../middleware/validate';
import { auditLog } from '../../middleware/auditLog';
import { contactsController } from './controller';
import {
  createContactSchema,
  updateContactSchema,
  importContactsSchema,
} from './validation';

const router = Router({ mergeParams: true });

// GET /workspaces/:wid/contacts
router.get(
  '/',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => contactsController.list(req as any, res)
);

// GET /workspaces/:wid/contacts/export
router.get(
  '/export',
  authenticate,
  requireWorkspaceMember('editor'),
  (req, res) => contactsController.exportCsv(req as any, res)
);

// POST /workspaces/:wid/contacts/import
router.post(
  '/import',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(importContactsSchema),
  auditLog('contacts.import'),
  (req, res) => contactsController.importCsv(req as any, res)
);

// GET /workspaces/:wid/contacts/:contactId
router.get(
  '/:contactId',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => contactsController.getById(req as any, res)
);

// POST /workspaces/:wid/contacts
router.post(
  '/',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(createContactSchema),
  auditLog('contacts.create'),
  (req, res) => contactsController.create(req as any, res)
);

// PATCH /workspaces/:wid/contacts/:contactId
router.patch(
  '/:contactId',
  authenticate,
  requireWorkspaceMember('editor'),
  validate(updateContactSchema),
  auditLog('contacts.update'),
  (req, res) => contactsController.update(req as any, res)
);

// DELETE /workspaces/:wid/contacts/:contactId
router.delete(
  '/:contactId',
  authenticate,
  requireWorkspaceMember('editor'),
  auditLog('contacts.delete'),
  (req, res) => contactsController.delete(req as any, res)
);

export default router;
