import { contactsRepository, Contact } from '../../repositories/contacts.repository';
import { CreateContactDto, UpdateContactDto, ImportContactsDto } from './validation';
import { getPaginationOptions } from '../../utils/pagination';

export class ContactsService {
  async findAll(workspaceId: string, query: Record<string, string>) {
    const options = getPaginationOptions(query);
    const { data, total } = await contactsRepository.findAll(workspaceId, {
      ...options,
      status: query.status,
      listId: query.listId,
      tag: query.tag,
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

  async findById(workspaceId: string, contactId: string) {
    const contact = await contactsRepository.findById(workspaceId, contactId);
    if (!contact) throw new Error('Contact not found');
    return contact;
  }

  async create(workspaceId: string, dto: CreateContactDto) {
    // Check for duplicate email
    const existing = await contactsRepository.findByEmail(workspaceId, dto.email);
    if (existing) throw new Error('A contact with this email already exists');
    return contactsRepository.create(workspaceId, dto);
  }

  async update(workspaceId: string, contactId: string, dto: UpdateContactDto) {
    const contact = await contactsRepository.update(workspaceId, contactId, dto);
    if (!contact) throw new Error('Contact not found');
    return contact;
  }

  async delete(workspaceId: string, contactId: string) {
    const deleted = await contactsRepository.delete(workspaceId, contactId);
    if (!deleted) throw new Error('Contact not found');
    return { deleted: true };
  }

  async importFromCsv(workspaceId: string, dto: ImportContactsDto) {
    const { csvContent, mappings, listIds, tags } = dto;

    // Parse CSV using built-in string operations
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const contacts: Partial<Contact>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const rowData: Record<string, string> = {};
      headers.forEach((header, idx) => {
        rowData[header] = row[idx] || '';
      });

      const email = rowData[mappings.email];
      if (!email || !email.includes('@')) continue;

      contacts.push({
        email,
        firstName: mappings.firstName ? rowData[mappings.firstName] : undefined,
        lastName: mappings.lastName ? rowData[mappings.lastName] : undefined,
        phone: mappings.phone ? rowData[mappings.phone] : undefined,
        listIds: listIds || [],
        tags: tags || [],
        status: 'subscribed',
      });
    }

    const result = await contactsRepository.bulkCreate(workspaceId, contacts);
    return { ...result, total: contacts.length };
  }

  async exportToCsv(workspaceId: string, query: Record<string, string>): Promise<string> {
    const options = getPaginationOptions({ ...query, limit: '10000' });
    const { data } = await contactsRepository.findAll(workspaceId, options);

    const headers = ['email', 'firstName', 'lastName', 'phone', 'status', 'tags', 'createdAt'];
    const rows = data.map((c) =>
      [
        c.email,
        c.firstName || '',
        c.lastName || '',
        c.phone || '',
        c.status,
        (c.tags || []).join(';'),
        c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }
}

export const contactsService = new ContactsService();
