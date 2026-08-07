import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { db } from '../config/firebase-admin';
import { sendError } from '../utils/response';

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface WorkspaceRequest extends AuthenticatedRequest {
  workspaceId?: string;
  workspaceRole?: WorkspaceRole;
}

export const requireWorkspaceMember = (minRole: WorkspaceRole = 'viewer') => {
  const roleHierarchy: WorkspaceRole[] = ['viewer', 'editor', 'admin', 'owner'];

  return async (
    req: WorkspaceRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rawWorkspaceId = req.params.workspaceId || req.params.wid;
      const workspaceId = Array.isArray(rawWorkspaceId) ? rawWorkspaceId[0] : rawWorkspaceId;
      const userId = req.user?.uid;

      if (!workspaceId || !userId) {
        sendError(res, 'Workspace or user not found', 403, 'FORBIDDEN');
        return;
      }

      // Dev mode bypass
      if (process.env.NODE_ENV === 'development' && userId === 'dev-user-id') {
        req.workspaceId = workspaceId;
        req.workspaceRole = 'owner';
        next();
        return;
      }

      if (!db.collection) {
        req.workspaceId = workspaceId;
        req.workspaceRole = 'owner';
        next();
        return;
      }

      const memberRef = db
        .collection('workspaces')
        .doc(workspaceId)
        .collection('members')
        .doc(userId);
      const memberDoc = await memberRef.get();

      if (!memberDoc.exists) {
        sendError(res, 'You are not a member of this workspace', 403, 'FORBIDDEN');
        return;
      }

      const memberData = memberDoc.data() as { role: WorkspaceRole; status: string };

      if (memberData.status !== 'active') {
        sendError(res, 'Your workspace membership is not active', 403, 'FORBIDDEN');
        return;
      }

      const userRoleIndex = roleHierarchy.indexOf(memberData.role);
      const minRoleIndex = roleHierarchy.indexOf(minRole);

      if (userRoleIndex < minRoleIndex) {
        sendError(res, 'Insufficient permissions', 403, 'FORBIDDEN');
        return;
      }

      req.workspaceId = workspaceId;
      req.workspaceRole = memberData.role;
      next();
    } catch {
      sendError(res, 'Workspace access check failed', 500, 'INTERNAL_ERROR');
    }
  };
};
