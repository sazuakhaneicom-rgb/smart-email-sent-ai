import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { WorkspaceRequest } from '../../middleware/workspace';
import { workspacesService } from './service';
import { sendSuccess, sendError } from '../../utils/response';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  InviteMemberDto,
  UpdateMemberDto,
} from './validation';

export class WorkspacesController {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as CreateWorkspaceDto;
      const workspace = await workspacesService.create(
        req.user!.uid,
        req.user!.email || '',
        req.user!.name,
        dto
      );
      sendSuccess(res, workspace, 201);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      sendError(res, msg, msg.includes('taken') ? 409 : 500, 'CREATE_FAILED');
    }
  }

  async getById(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspace = await workspacesService.getById(req.workspaceId!);
      sendSuccess(res, workspace);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async update(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as UpdateWorkspaceDto;
      const workspace = await workspacesService.update(req.workspaceId!, dto);
      sendSuccess(res, workspace);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'UPDATE_FAILED');
    }
  }

  async delete(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await workspacesService.delete(req.workspaceId!);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'DELETE_FAILED');
    }
  }

  async getMembers(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const members = await workspacesService.getMembers(req.workspaceId!);
      sendSuccess(res, members);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async inviteMember(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as InviteMemberDto;
      const member = await workspacesService.inviteMember(req.workspaceId!, req.user!.uid, dto);
      sendSuccess(res, member, 201);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      sendError(res, msg, msg.includes('already') ? 409 : 500, 'INVITE_FAILED');
    }
  }

  async updateMember(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as UpdateMemberDto;
      const member = await workspacesService.updateMember(req.workspaceId!, req.params.userId, dto);
      sendSuccess(res, member);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'UPDATE_FAILED');
    }
  }

  async removeMember(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await workspacesService.removeMember(
        req.workspaceId!,
        req.params.userId,
        req.user!.uid
      );
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'REMOVE_FAILED');
    }
  }
}

export const workspacesController = new WorkspacesController();
