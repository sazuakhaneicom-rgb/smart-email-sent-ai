import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireWorkspaceMember } from '../../middleware/workspace';
import { validate } from '../../middleware/validate';
import { auditLog } from '../../middleware/auditLog';
import { workspacesController } from './controller';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
  updateMemberSchema,
} from './validation';

const router = Router();

// POST /workspaces - Create workspace
router.post(
  '/',
  authenticate,
  validate(createWorkspaceSchema),
  (req, res) => workspacesController.create(req as any, res)
);

// GET /workspaces/:workspaceId - Get workspace
router.get(
  '/:workspaceId',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => workspacesController.getById(req as any, res)
);

// PATCH /workspaces/:workspaceId - Update workspace
router.patch(
  '/:workspaceId',
  authenticate,
  requireWorkspaceMember('admin'),
  validate(updateWorkspaceSchema),
  auditLog('workspace.update'),
  (req, res) => workspacesController.update(req as any, res)
);

// DELETE /workspaces/:workspaceId - Delete workspace
router.delete(
  '/:workspaceId',
  authenticate,
  requireWorkspaceMember('owner'),
  auditLog('workspace.delete'),
  (req, res) => workspacesController.delete(req as any, res)
);

// GET /workspaces/:workspaceId/members - List members
router.get(
  '/:workspaceId/members',
  authenticate,
  requireWorkspaceMember('viewer'),
  (req, res) => workspacesController.getMembers(req as any, res)
);

// POST /workspaces/:workspaceId/members - Invite member
router.post(
  '/:workspaceId/members',
  authenticate,
  requireWorkspaceMember('admin'),
  validate(inviteMemberSchema),
  auditLog('workspace.member.invite'),
  (req, res) => workspacesController.inviteMember(req as any, res)
);

// PATCH /workspaces/:workspaceId/members/:userId - Update member role
router.patch(
  '/:workspaceId/members/:userId',
  authenticate,
  requireWorkspaceMember('admin'),
  validate(updateMemberSchema),
  auditLog('workspace.member.update'),
  (req, res) => workspacesController.updateMember(req as any, res)
);

// DELETE /workspaces/:workspaceId/members/:userId - Remove member
router.delete(
  '/:workspaceId/members/:userId',
  authenticate,
  requireWorkspaceMember('admin'),
  auditLog('workspace.member.remove'),
  (req, res) => workspacesController.removeMember(req as any, res)
);

export default router;
