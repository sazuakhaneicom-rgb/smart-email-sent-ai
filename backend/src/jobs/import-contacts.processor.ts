import { Worker, Job } from 'bullmq';
import { connection } from './queue';
import { contactsRepository, Contact } from '../repositories/contacts.repository';
import { logger } from '../utils/logger';

interface ImportContactsJobData {
  workspaceId: string;
  fileContent: string; // CSV string
  mappings: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  listIds?: string[];
  tags?: string[];
}

const processImportContacts = async (job: Job<ImportContactsJobData>): Promise<void> => {
  const { workspaceId, fileContent, mappings, listIds = [], tags = [] } = job.data;
  logger.info(`[import-contacts] Processing import for workspace ${workspaceId}`);

  // Parse CSV
  const lines = fileContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  const headers = lines[0]
    .split(',')
    .map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

  const contacts: Partial<Contact>[] = [];
  let parseErrors = 0;

  for (let i = 1; i < lines.length; i++) {
    try {
      // Handle quoted fields with commas
      const row: string[] = [];
      let inQuote = false;
      let current = '';
      for (const char of lines[i]) {
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      row.push(current.trim());

      const rowData: Record<string, string> = {};
      headers.forEach((header, idx) => {
        rowData[header] = row[idx] || '';
      });

      const email = rowData[mappings.email.toLowerCase()];
      if (!email || !email.includes('@')) {
        parseErrors++;
        continue;
      }

      contacts.push({
        email: email.toLowerCase(),
        firstName: mappings.firstName ? rowData[mappings.firstName.toLowerCase()] : undefined,
        lastName: mappings.lastName ? rowData[mappings.lastName.toLowerCase()] : undefined,
        phone: mappings.phone ? rowData[mappings.phone.toLowerCase()] : undefined,
        listIds,
        tags,
        status: 'subscribed',
      });
    } catch {
      parseErrors++;
    }
  }

  logger.info(`[import-contacts] Parsed ${contacts.length} valid contacts, ${parseErrors} parse errors`);

  // Bulk create in batches
  const result = await contactsRepository.bulkCreate(workspaceId, contacts);

  logger.info(
    `[import-contacts] Import complete — created: ${result.created}, duplicates: ${result.duplicates}, errors: ${result.errors + parseErrors}`
  );

  await job.updateProgress(100);
};

// Only start worker if Redis is available
if ((connection as any).options) {
  const worker = new Worker<ImportContactsJobData>(
    'import-contacts',
    processImportContacts,
    {
      connection,
      concurrency: 1, // Single concurrency to avoid Firestore batch conflicts
    }
  );

  worker.on('completed', (job) => {
    logger.info(`[import-contacts] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`[import-contacts] Job ${job?.id} failed:`, err);
  });
}

export {};
