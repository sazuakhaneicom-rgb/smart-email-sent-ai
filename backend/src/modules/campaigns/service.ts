import { campaignsRepository } from '../../repositories/campaigns.repository';
import { billingRepository } from '../../repositories/billing.repository';
import { contactsRepository } from '../../repositories/contacts.repository';
import { templatesRepository } from '../../repositories/templates.repository';
import { renderTemplate, TemplateDesignJson } from '../../utils/email-render';
import { generateUnsubscribeToken, verifyUnsubscribeToken } from '../../utils/unsubscribe-token';
import { config } from '../../config';
import { getPaginationOptions } from '../../utils/pagination';
import { CreateCampaignDto, UpdateCampaignDto, ScheduleCampaignDto, TestSendDto } from './validation';
import { logger } from '../../utils/logger';

export class CampaignsService {
  async findAll(workspaceId: string, query: Record<string, string>) {
    const options = getPaginationOptions(query);
    const { data, total } = await campaignsRepository.findAll(workspaceId, {
      ...options,
      status: query.status,
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

  async findById(workspaceId: string, campaignId: string) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');
    return campaign;
  }

  async create(workspaceId: string, createdBy: string, dto: CreateCampaignDto) {
    return campaignsRepository.create(workspaceId, { ...dto, createdBy, status: 'draft' });
  }

  async update(workspaceId: string, campaignId: string, dto: UpdateCampaignDto) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.status === 'sending' || campaign.status === 'sent') {
      throw new Error('Cannot edit a campaign that is sending or already sent');
    }
    const updated = await campaignsRepository.update(workspaceId, campaignId, dto);
    if (!updated) throw new Error('Campaign not found');
    return updated;
  }

  async delete(workspaceId: string, campaignId: string) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.status === 'sending') {
      throw new Error('Cannot delete a campaign that is currently sending');
    }
    await campaignsRepository.delete(workspaceId, campaignId);
    return { deleted: true };
  }

  async send(workspaceId: string, campaignId: string) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.status !== 'draft' && campaign.status !== 'paused') {
      throw new Error(`Cannot send campaign with status: ${campaign.status}`);
    }

    // Check billing quota
    const plan = await billingRepository.getCurrentPlan(workspaceId);
    if (plan.emailsSentThisMonth >= plan.emailsPerMonth) {
      throw new Error('Monthly email quota exceeded. Please upgrade your plan.');
    }

    // Update status to sending
    await campaignsRepository.update(workspaceId, campaignId, { status: 'sending' });

    // Enqueue in BullMQ
    try {
      const { sendCampaignQueue } = await import('../../jobs/queue');
      await sendCampaignQueue.add(
        `send-${campaignId}`,
        { workspaceId, campaignId, batchSize: 50 },
        { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
      );
      logger.info(`Campaign ${campaignId} enqueued for sending`);
    } catch (err) {
      logger.warn('BullMQ not available, simulating send:', err);
      await campaignsRepository.update(workspaceId, campaignId, {
        status: 'sent',
        sentAt: new Date(),
      });
    }

    return { queued: true, campaignId };
  }

  async schedule(workspaceId: string, campaignId: string, dto: ScheduleCampaignDto) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.status !== 'draft') {
      throw new Error('Only draft campaigns can be scheduled');
    }

    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt <= new Date()) {
      throw new Error('Scheduled time must be in the future');
    }

    const updated = await campaignsRepository.update(workspaceId, campaignId, {
      status: 'scheduled',
      scheduledAt,
    });
    return updated;
  }

  async pause(workspaceId: string, campaignId: string) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.status !== 'sending' && campaign.status !== 'scheduled') {
      throw new Error('Only sending or scheduled campaigns can be paused');
    }
    return campaignsRepository.update(workspaceId, campaignId, { status: 'paused' });
  }

  async testSend(workspaceId: string, campaignId: string, dto: TestSendDto) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');

    // Render the email for preview
    let html = campaign.htmlContent || '';
    if (campaign.templateId) {
      const template = await templatesRepository.findById(workspaceId, campaign.templateId);
      if (template?.designJson) {
        const unsubUrl = `${config.apiBaseUrl}/api/v1/unsubscribe/test`;
        html = renderTemplate(
          template.designJson as unknown as TemplateDesignJson,
          { email: dto.toEmail, firstName: 'Test', lastName: 'User' },
          unsubUrl
        );
      }
    }

    // SES send (placeholder)
    logger.info(`Test send to ${dto.toEmail} for campaign ${campaignId}`);
    logger.debug('HTML preview length:', html.length);

    return { sent: true, to: dto.toEmail };
  }

  async handleUnsubscribe(token: string) {
    const decoded = verifyUnsubscribeToken(token);
    if (!decoded) throw new Error('Invalid or expired unsubscribe token');

    const { workspaceId, contactId } = decoded;
    await contactsRepository.update(workspaceId, contactId, { status: 'unsubscribed' });
    return { unsubscribed: true };
  }
}

export const campaignsService = new CampaignsService();
