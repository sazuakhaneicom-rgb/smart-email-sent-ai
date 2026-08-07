import { Worker, Job } from 'bullmq';
import { connection } from './queue';
import { campaignsRepository } from '../repositories/campaigns.repository';
import { contactsRepository } from '../repositories/contacts.repository';
import { billingRepository } from '../repositories/billing.repository';
import { analyticsRepository } from '../repositories/analytics.repository';
import { templatesRepository } from '../repositories/templates.repository';
import { renderTemplate, TemplateDesignJson } from '../utils/email-render';
import { generateUnsubscribeToken } from '../utils/unsubscribe-token';
import { config } from '../config';
import { logger } from '../utils/logger';

interface SendCampaignJobData {
  workspaceId: string;
  campaignId: string;
  batchSize?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const processSendCampaign = async (job: Job<SendCampaignJobData>): Promise<void> => {
  const { workspaceId, campaignId, batchSize = 50 } = job.data;
  logger.info(`[send-campaign] Processing job for campaign ${campaignId}`);

  const campaign = await campaignsRepository.findById(workspaceId, campaignId);
  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`);
  }

  if (campaign.status !== 'sending') {
    logger.warn(`[send-campaign] Campaign ${campaignId} is not in 'sending' state. Aborting.`);
    return;
  }

  // Get template HTML
  let templateHtml = campaign.htmlContent || '';
  let designJson: TemplateDesignJson | null = null;
  if (campaign.templateId) {
    const template = await templatesRepository.findById(workspaceId, campaign.templateId);
    if (template?.designJson) {
      designJson = template.designJson as unknown as TemplateDesignJson;
    }
  }

  // Fetch all subscribed contacts from recipient lists
  let allContacts: Awaited<ReturnType<typeof contactsRepository.findAll>>['data'] = [];
  for (const listId of campaign.recipientListIds) {
    const { data } = await contactsRepository.findAll(workspaceId, {
      listId,
      status: 'subscribed',
      page: 1,
      limit: 10000,
    });
    allContacts = [...allContacts, ...data];
  }

  // Deduplicate by email
  const seen = new Set<string>();
  const uniqueContacts = allContacts.filter((c) => {
    if (seen.has(c.email)) return false;
    seen.add(c.email);
    return true;
  });

  logger.info(`[send-campaign] Sending to ${uniqueContacts.length} unique contacts`);

  let totalSent = 0;
  const totalBatches = Math.ceil(uniqueContacts.length / batchSize);

  for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
    // Check if campaign was paused mid-send
    const freshCampaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (freshCampaign?.status === 'paused') {
      logger.info(`[send-campaign] Campaign ${campaignId} paused at batch ${batchIdx}`);
      return;
    }

    const batch = uniqueContacts.slice(batchIdx * batchSize, (batchIdx + 1) * batchSize);

    for (const contact of batch) {
      try {
        // Generate per-contact email content with merge tags
        const contactData: Record<string, string> = {
          email: contact.email,
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          ...contact.customFields,
        };

        const unsubToken = generateUnsubscribeToken(workspaceId, contact.id, campaignId);
        const unsubUrl = `${config.apiBaseUrl}/api/v1/workspaces/${workspaceId}/campaigns/unsubscribe/${unsubToken}`;

        let finalHtml = templateHtml;
        if (designJson) {
          finalHtml = renderTemplate(designJson, contactData, unsubUrl);
        }

        // Add tracking pixel
        const trackingPixelUrl = `${config.apiBaseUrl}/api/v1/workspaces/${workspaceId}/analytics/track/open/${workspaceId}/${campaignId}/${contact.id}`;
        finalHtml = finalHtml.replace(
          '</body>',
          `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none"/></body>`
        );

        // Amazon SES send placeholder
        // In production, use @aws-sdk/client-ses:
        // const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
        // const ses = new SESClient({ region: config.ses.region, credentials: { ... } });
        // await ses.send(new SendEmailCommand({ ... }));

        logger.debug(`[send-campaign] Sent email to ${contact.email}`);

        // Track sent event
        await analyticsRepository.createEvent(workspaceId, campaignId, {
          contactId: contact.id,
          eventType: 'sent',
        });

        totalSent++;
      } catch (err) {
        logger.error(`[send-campaign] Failed to send to ${contact.email}:`, err);
      }
    }

    // Update job progress
    const progress = Math.round(((batchIdx + 1) / totalBatches) * 100);
    await job.updateProgress(progress);

    // Rate limiting: max 50 emails/sec per AWS SES default
    await sleep(1000);
  }

  // Mark campaign as sent
  await campaignsRepository.update(workspaceId, campaignId, {
    status: 'sent',
    sentAt: new Date(),
  });

  // Update billing usage
  await billingRepository.incrementEmailsSent(workspaceId, totalSent);

  // Update campaign stats
  await campaignsRepository.updateStats(workspaceId, campaignId, { sent: totalSent });

  logger.info(`[send-campaign] Campaign ${campaignId} completed. Sent: ${totalSent}`);
};

// Only start worker if Redis is available
if ((connection as any).options) {
  const worker = new Worker<SendCampaignJobData>(
    'send-campaign',
    processSendCampaign,
    {
      connection,
      concurrency: 2,
    }
  );

  worker.on('completed', (job) => {
    logger.info(`[send-campaign] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`[send-campaign] Job ${job?.id} failed:`, err);
  });

  worker.on('progress', (job, progress) => {
    logger.debug(`[send-campaign] Job ${job.id} progress: ${progress}%`);
  });
}

export {};
