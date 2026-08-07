import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { settingsService, UpdateProfileDto } from './service';
import { sendSuccess, sendError } from '../../utils/response';

export class SettingsController {
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await settingsService.getProfile(req.user!.uid);
      sendSuccess(res, profile);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as UpdateProfileDto;
      const profile = await settingsService.updateProfile(req.user!.uid, dto);
      sendSuccess(res, profile);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'UPDATE_FAILED');
    }
  }

  async getSessions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sessions = await settingsService.getSessions(req.user!.uid);
      sendSuccess(res, sessions);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async revokeAllSessions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await settingsService.revokeAllSessions(req.user!.uid);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'REVOKE_FAILED');
    }
  }
}

export const settingsController = new SettingsController();
