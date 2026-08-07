import { Response } from 'express';
import { WorkspaceRequest } from '../../middleware/workspace';
import { billingService } from './service';
import { sendSuccess, sendError } from '../../utils/response';
import { SubscribePlanDto } from './validation';
import { config } from '../../config';
import crypto from 'crypto';

export class BillingController {
  async getBilling(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const plan = await billingService.getCurrentPlan(req.workspaceId!);
      sendSuccess(res, plan);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async subscribe(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as SubscribePlanDto;
      const result = await billingService.subscribe(req.workspaceId!, dto);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'SUBSCRIBE_FAILED');
    }
  }

  async getInvoices(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await billingService.getInvoices(
        req.workspaceId!,
        req.query as Record<string, string>
      );
      sendSuccess(res, result.data, 200, result.meta);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async webhook(req: any, res: Response): Promise<void> {
    // Verify webhook signature for Stripe
    const signature = req.headers['stripe-signature'] as string;
    if (signature && config.payment.webhookSecret) {
      const payload = req.rawBody || JSON.stringify(req.body);
      const expectedSig = crypto
        .createHmac('sha256', config.payment.webhookSecret)
        .update(payload)
        .digest('hex');
      if (!signature.includes(expectedSig)) {
        sendError(res, 'Invalid webhook signature', 400, 'INVALID_SIGNATURE');
        return;
      }
    }
    try {
      const result = await billingService.handleWebhook(req.body);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'WEBHOOK_FAILED');
    }
  }
}

export const billingController = new BillingController();
