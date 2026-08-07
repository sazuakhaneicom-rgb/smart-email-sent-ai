import { analyticsRepository } from '../../repositories/analytics.repository';
import { campaignsRepository } from '../../repositories/campaigns.repository';

export class AnalyticsService {
  async getOverview(workspaceId: string, query: Record<string, string>) {
    const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : new Date();
    return analyticsRepository.getOverview(workspaceId, { from, to });
  }

  async getCampaignStats(workspaceId: string, campaignId: string) {
    const campaign = await campaignsRepository.findById(workspaceId, campaignId);
    if (!campaign) throw new Error('Campaign not found');
    const stats = await analyticsRepository.getCampaignStats(workspaceId, campaignId);
    const clicks = await analyticsRepository.getClickStats(workspaceId, campaignId);
    return { campaign, stats, clicks };
  }

  async trackOpen(workspaceId: string, campaignId: string, contactId: string, meta: {
    userAgent?: string;
    ip?: string;
  }) {
    await analyticsRepository.createEvent(workspaceId, campaignId, {
      contactId,
      eventType: 'opened',
      userAgent: meta.userAgent,
      ip: meta.ip,
    });
    await campaignsRepository.updateStats(workspaceId, campaignId, { opened: 1 });
  }

  async trackClick(
    workspaceId: string,
    campaignId: string,
    contactId: string,
    url: string,
    meta: { userAgent?: string; ip?: string }
  ) {
    await analyticsRepository.createEvent(workspaceId, campaignId, {
      contactId,
      eventType: 'clicked',
      url,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });
    await campaignsRepository.updateStats(workspaceId, campaignId, { clicked: 1 });
  }
}

export const analyticsService = new AnalyticsService();
