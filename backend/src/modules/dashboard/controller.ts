import { Response } from 'express';
import { WorkspaceRequest } from '../../middleware/workspace';
import { dashboardService } from './service';
import { sendSuccess, sendError } from '../../utils/response';

export class DashboardController {
  async getSummary(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const data = await dashboardService.getSummary(req.workspaceId!);
      sendSuccess(res, data);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async getActivity(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query as Record<string, string>;
      const result = await dashboardService.getActivity(req.workspaceId!, {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? Math.min(50, parseInt(limit, 10)) : 10,
      });
      sendSuccess(res, result.data, 200, {
        page: result.data.length > 0 ? 1 : 1,
        limit: 10,
        total: result.total,
        totalPages: Math.ceil(result.total / 10),
      });
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async getChart(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const data = await dashboardService.getChart(
        req.workspaceId!,
        req.query as Record<string, string>
      );
      sendSuccess(res, data);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }
}

export const dashboardController = new DashboardController();
