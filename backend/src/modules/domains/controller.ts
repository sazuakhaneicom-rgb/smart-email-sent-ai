import { Response } from 'express';
import { WorkspaceRequest } from '../../middleware/workspace';
import { domainsService } from './service';
import { sendSuccess, sendError } from '../../utils/response';
import { AddDomainDto } from './validation';

export class DomainsController {
  async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const domains = await domainsService.findAll(req.workspaceId!);
      sendSuccess(res, domains);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'FETCH_FAILED');
    }
  }

  async getById(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const domain = await domainsService.findById(req.workspaceId!, req.params.domainId);
      sendSuccess(res, domain);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async add(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as AddDomainDto;
      const domain = await domainsService.add(req.workspaceId!, dto);
      sendSuccess(res, domain, 201);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      sendError(res, msg, msg.includes('already') ? 409 : 500, 'ADD_FAILED');
    }
  }

  async delete(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await domainsService.delete(req.workspaceId!, req.params.domainId);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async verify(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await domainsService.verify(req.workspaceId!, req.params.domainId);
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'VERIFY_FAILED');
    }
  }
}

export const domainsController = new DomainsController();
