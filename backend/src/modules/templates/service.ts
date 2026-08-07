import { templatesRepository } from '../../repositories/templates.repository';
import { CreateTemplateDto, UpdateTemplateDto } from './validation';
import { getPaginationOptions } from '../../utils/pagination';

export class TemplatesService {
  async findAll(workspaceId: string, query: Record<string, string>) {
    const options = getPaginationOptions(query);
    const { data, total } = await templatesRepository.findAll(workspaceId, {
      ...options,
      category: query.category,
    });
    return {
      data,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async findById(workspaceId: string, templateId: string) {
    const template = await templatesRepository.findById(workspaceId, templateId);
    if (!template) throw new Error('Template not found');
    return template;
  }

  async create(workspaceId: string, createdBy: string, dto: CreateTemplateDto) {
    return templatesRepository.create(workspaceId, { ...dto, createdBy });
  }

  async update(workspaceId: string, templateId: string, dto: UpdateTemplateDto) {
    const template = await templatesRepository.update(workspaceId, templateId, dto);
    if (!template) throw new Error('Template not found');
    return template;
  }

  async delete(workspaceId: string, templateId: string) {
    const deleted = await templatesRepository.delete(workspaceId, templateId);
    if (!deleted) throw new Error('Template not found');
    return { deleted: true };
  }

  async duplicate(workspaceId: string, templateId: string, createdBy: string) {
    const template = await templatesRepository.duplicate(workspaceId, templateId, createdBy);
    if (!template) throw new Error('Template not found');
    return template;
  }
}

export const templatesService = new TemplatesService();
