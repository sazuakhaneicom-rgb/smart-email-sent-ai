import { Response } from 'express';
import { WorkspaceRequest } from '../../middleware/workspace';
import { contactsService } from './service';
import { sendSuccess, sendError } from '../../utils/response';
import { CreateContactDto, UpdateContactDto, ImportContactsDto } from './validation';

const str = (val: string | string[] | undefined): string => (Array.isArray(val) ? val[0] : val || '');

export class ContactsController {
  async list(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await contactsService.findAll(
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
      const contact = await contactsService.findById(req.workspaceId!, str(req.params.contactId || req.params.id));
      sendSuccess(res, contact);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async create(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as CreateContactDto;
      const contact = await contactsService.create(req.workspaceId!, dto);
      sendSuccess(res, contact, 201);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      sendError(res, msg, msg.includes('already exists') ? 409 : 500, 'CREATE_FAILED');
    }
  }

  async update(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as UpdateContactDto;
      const contact = await contactsService.update(req.workspaceId!, str(req.params.contactId || req.params.id), dto);
      sendSuccess(res, contact);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async delete(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const result = await contactsService.delete(req.workspaceId!, str(req.params.contactId || req.params.id));
      sendSuccess(res, result);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 404, 'NOT_FOUND');
    }
  }

  async importCsv(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const dto = req.body as ImportContactsDto;
      const result = await contactsService.importFromCsv(req.workspaceId!, dto);
      sendSuccess(res, result, 200);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 400, 'IMPORT_FAILED');
    }
  }

  async exportCsv(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const csv = await contactsService.exportToCsv(
        req.workspaceId!,
        req.query as Record<string, string>
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="contacts-${req.workspaceId}-${Date.now()}.csv"`
      );
      res.status(200).send(csv);
    } catch (err: unknown) {
      sendError(res, (err as Error).message, 500, 'EXPORT_FAILED');
    }
  }
}

export const contactsController = new ContactsController();
