import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { authService } from './service';
import { sendSuccess, sendError } from '../../utils/response';
import { SyncUserDto, ChangePasswordDto, MfaEnrollDto, MfaVerifyDto } from './validation';

export class AuthController {
  async syncUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || '';
      const name = req.user!.name;
      const dto = req.body as SyncUserDto;
      const profile = await authService.syncUser(uid, email, name, dto);
      sendSuccess(res, profile);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'SYNC_FAILED');
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await authService.getMe(req.user!.uid);
      sendSuccess(res, data);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async enrollMfa(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as MfaEnrollDto;
      const result = await authService.enrollMfa(req.user!.uid, dto.phoneNumber);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'MFA_ENROLL_FAILED');
    }
  }

  async verifyMfa(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as MfaVerifyDto;
      const result = await authService.verifyMfa(req.user!.uid, dto.sessionInfo, dto.code);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'MFA_VERIFY_FAILED');
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as ChangePasswordDto;
      const result = await authService.changePassword(req.user!.uid, dto.newPassword);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'PASSWORD_CHANGE_FAILED');
    }
  }

  async getSessions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await authService.getSessions(req.user!.uid);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'SESSIONS_FETCH_FAILED');
    }
  }

  async revokeSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await authService.revokeSession(req.user!.uid, id);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'SESSION_REVOKE_FAILED');
    }
  }
}

export const authController = new AuthController();
