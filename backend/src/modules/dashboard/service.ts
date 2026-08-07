import { campaignsRepository } from '../../repositories/campaigns.repository';
import { contactsRepository } from '../../repositories/contacts.repository';
import { analyticsRepository } from '../../repositories/analytics.repository';
import { billingRepository } from '../../repositories/billing.repository';
import { auditLogRepository } from '../../repositories/audit-log.repository';

export class DashboardService {
  async getSummary(workspaceId: string) {
    const [plan, { total: totalContacts }, { total: totalCampaigns }, overview] = await Promise.all([
      billingRepository.getCurrentPlan(workspaceId),
      contactsRepository.findAll(workspaceId, { page: 1, limit: 1 }),
      campaignsRepository.findAll(workspaceId, { page: 1, limit: 1 }),
      analyticsRepository.getOverview(workspaceId, {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    ]);

    const emailQuotaUsed = plan.emailsSentThisMonth;
    const emailQuotaTotal = plan.emailsPerMonth;
    const emailQuotaPercent = emailQuotaTotal > 0
      ? Math.round((emailQuotaUsed / emailQuotaTotal) * 100)
      : 0;

    return {
      contacts: { total: totalContacts },
      campaigns: { total: totalCampaigns, activeCampaigns: overview.campaignCount },
      emails: {
        sentThisMonth: emailQuotaUsed,
        quota: emailQuotaTotal,
        quotaPercent: emailQuotaPercent,
      },
      analytics: {
        avgOpenRate: Math.round(overview.avgOpenRate * 10) / 10,
        avgClickRate: Math.round(overview.avgClickRate * 10) / 10,
        totalSent: overview.totalSent,
      },
      plan: {
        tier: plan.tier,
        name: plan.name,
        renewsAt: plan.renewsAt,
      },
    };
  }

  async getActivity(workspaceId: string, options: { page?: number; limit?: number }) {
    return auditLogRepository.findAll(workspaceId, {
      page: options.page || 1,
      limit: options.limit || 10,
    });
  }

  async getChart(workspaceId: string, query: Record<string, string>) {
    const from = query.from
      ? new Date(query.from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : new Date();
    const overview = await analyticsRepository.getOverview(workspaceId, { from, to });
    return {
      dailyStats: overview.dailyStats,
      period: { from: from.toISOString(), to: to.toISOString() },
    };
  }
}

export const dashboardService = new DashboardService();
