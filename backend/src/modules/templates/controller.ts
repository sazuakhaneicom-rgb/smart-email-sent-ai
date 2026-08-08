import { Response } from 'express';
import { WorkspaceRequest } from '../../middleware/workspace';
import { templatesService } from './service';
import { sendSuccess, sendError } from '../../utils/response';
import { CreateTemplateDto, UpdateTemplateDto } from './validation';

const str = (val: string | string[] | undefined): string => (Array.isArray(val) ? val[0] : val || '');

export class TemplatesController {
  async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await templatesService.findAll(
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
      const template = await templatesService.findById(req.workspaceId!, str(req.params.templateId || req.params.id));
      sendSuccess(res, template);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async create(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as CreateTemplateDto;
      const template = await templatesService.create(req.workspaceId!, req.user!.uid, dto);
      sendSuccess(res, template, 201);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'CREATE_FAILED');
    }
  }

  async update(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as UpdateTemplateDto;
      const template = await templatesService.update(req.workspaceId!, str(req.params.templateId || req.params.id), dto);
      sendSuccess(res, template);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async delete(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await templatesService.delete(req.workspaceId!, str(req.params.templateId || req.params.id));
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async duplicate(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const template = await templatesService.duplicate(
        req.workspaceId!,
        str(req.params.templateId || req.params.id),
        req.user!.uid
      );
      sendSuccess(res, template, 201);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }
}

export const templatesController = new TemplatesController();
