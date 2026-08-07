import { Response } from 'express';
import { WorkspaceRequest } from '../../middleware/workspace';
import { campaignsService } from './service';
import { sendSuccess, sendError } from '../../utils/response';
import { config } from '../../config';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  ScheduleCampaignDto,
  TestSendDto,
} from './validation';

export class CampaignsController {
  async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await campaignsService.findAll(
        req.workspaceId!,
        req.query as Record<string, string>
      );
      sendSuccess(res, result.data, 200, result.meta);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async getById(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const campaign = await campaignsService.findById(req.workspaceId!, req.params.campaignId);
      sendSuccess(res, campaign);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async create(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as CreateCampaignDto;
      const campaign = await campaignsService.create(req.workspaceId!, req.user!.uid, dto);
      sendSuccess(res, campaign, 201);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'CREATE_FAILED');
    }
  }

  async update(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as UpdateCampaignDto;
      const campaign = await campaignsService.update(
        req.workspaceId!,
        req.params.campaignId,
        dto
      );
      sendSuccess(res, campaign);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      sendError(res, msg, msg.includes('not found') ? 404 : 400, 'UPDATE_FAILED');
    }
  }

  async delete(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await campaignsService.delete(req.workspaceId!, req.params.campaignId);
      sendSuccess(res, result);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      sendError(res, msg, msg.includes('not found') ? 404 : 400, 'DELETE_FAILED');
    }
  }

  async send(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await campaignsService.send(req.workspaceId!, req.params.campaignId);
      sendSuccess(res, result);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      sendError(res, msg, msg.includes('quota') ? 402 : 400, 'SEND_FAILED');
    }
  }

  async schedule(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as ScheduleCampaignDto;
      const campaign = await campaignsService.schedule(req.workspaceId!, req.params.campaignId, dto);
      sendSuccess(res, campaign);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'SCHEDULE_FAILED');
    }
  }

  async pause(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const campaign = await campaignsService.pause(req.workspaceId!, req.params.campaignId);
      sendSuccess(res, campaign);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'PAUSE_FAILED');
    }
  }

  async testSend(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as TestSendDto;
      const result = await campaignsService.testSend(req.workspaceId!, req.params.campaignId, dto);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'TEST_SEND_FAILED');
    }
  }

  async unsubscribe(req: any, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      await campaignsService.handleUnsubscribe(token);
      // Redirect to a friendly unsubscribe confirmation page
      res.redirect(`${config.frontendUrl}/unsubscribed`);
    } catch {
      res.status(400).send('Invalid or expired unsubscribe link.');
    }
  }
}

export const campaignsController = new CampaignsController();
