import { Request, Response } from 'express';
import { WorkspaceRequest } from '../../middleware/workspace';
import { analyticsService } from './service';
import { sendSuccess, sendError } from '../../utils/response';

const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

const str = (val: string | string[] | undefined): string => (Array.isArray(val) ? val[0] : val || '');

export class AnalyticsController {
  async getOverview(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getOverview(
        req.workspaceId!,
        req.query as Record<string, string>
      );
      sendSuccess(res, data);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async getCampaignStats(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getCampaignStats(
        req.workspaceId!,
        str(req.params.campaignId)
      );
      sendSuccess(res, data);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async trackOpen(req: Request, res: Response): Promise<void> {
    const wid = str(req.params.wid);
    const campaignId = str(req.params.campaignId);
    const contactId = str(req.params.contactId);
    try {
      await analyticsService.trackOpen(wid, campaignId, contactId, {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
    } catch {
      // Silently fail — always return pixel
    }
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.status(200).end(TRACKING_PIXEL);
  }

  async trackClick(req: Request, res: Response): Promise<void> {
    const wid = str(req.params.wid);
    const campaignId = str(req.params.campaignId);
    const contactId = str(req.params.contactId);
    const url = req.query.url as string;
    try {
      if (url) {
        await analyticsService.trackClick(wid, campaignId, contactId, url, {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
        });
        res.redirect(url);
        return;
      }
    } catch {
      // Silently fail
    }
    res.status(400).send('Invalid click tracking URL');
  }
}

export const analyticsController = new AnalyticsController();
