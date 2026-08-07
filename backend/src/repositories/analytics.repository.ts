import { db } from '../config/firebase-admin';

export type EventType = 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'unsubscribed';

export interface AnalyticsEvent {
  id: string;
  campaignId: string;
  contactId: string;
  eventType: EventType;
  url?: string;
  userAgent?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface ClickStat {
  url: string;
  clicks: number;
  uniqueClicks: number;
}

export interface OverviewStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  avgOpenRate: number;
  avgClickRate: number;
  campaignCount: number;
  dailyStats: Array<{ date: string; sent: number; opened: number; clicked: number }>;
}

export class AnalyticsRepository {
  private eventsCol(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('analyticsEvents');
  }

  async createEvent(
    workspaceId: string,
    campaignId: string,
    eventData: Partial<AnalyticsEvent>
  ): Promise<AnalyticsEvent> {
    const col = this.eventsCol(workspaceId);
    const now = new Date();
    const data = { ...eventData, campaignId, createdAt: now };
    if (!col) return { id: `mock-${Date.now()}`, ...data } as AnalyticsEvent;
    const ref = await col.add(data);
    return { id: ref.id, ...data } as AnalyticsEvent;
  }

  async getCampaignStats(workspaceId: string, campaignId: string): Promise<CampaignStats> {
    const empty: CampaignStats = {
      sent: 0, delivered: 0, opened: 0, clicked: 0,
      bounced: 0, complained: 0, unsubscribed: 0,
      openRate: 0, clickRate: 0, bounceRate: 0,
    };
    const col = this.eventsCol(workspaceId);
    if (!col) return empty;

    const snap = await col.where('campaignId', '==', campaignId).get();
    const counts: Record<EventType, number> = {
      sent: 0, delivered: 0, opened: 0, clicked: 0,
      bounced: 0, complained: 0, unsubscribed: 0,
    };

    snap.docs.forEach((doc: any) => {
      const event = doc.data() as AnalyticsEvent;
      if (counts[event.eventType] !== undefined) {
        counts[event.eventType]++;
      }
    });

    const openRate = counts.sent > 0 ? (counts.opened / counts.sent) * 100 : 0;
    const clickRate = counts.opened > 0 ? (counts.clicked / counts.opened) * 100 : 0;
    const bounceRate = counts.sent > 0 ? (counts.bounced / counts.sent) * 100 : 0;

    return { ...counts, openRate, clickRate, bounceRate };
  }

  async getClickStats(workspaceId: string, campaignId: string): Promise<ClickStat[]> {
    const col = this.eventsCol(workspaceId);
    if (!col) return [];

    const snap = await col
      .where('campaignId', '==', campaignId)
      .where('eventType', '==', 'clicked')
      .get();

    const urlMap = new Map<string, { clicks: number; contacts: Set<string> }>();
    snap.docs.forEach((doc: any) => {
      const event = doc.data() as AnalyticsEvent;
      if (event.url) {
        if (!urlMap.has(event.url)) {
          urlMap.set(event.url, { clicks: 0, contacts: new Set() });
        }
        const entry = urlMap.get(event.url)!;
        entry.clicks++;
        entry.contacts.add(event.contactId);
      }
    });

    return Array.from(urlMap.entries()).map(([url, { clicks, contacts }]) => ({
      url,
      clicks,
      uniqueClicks: contacts.size,
    })).sort((a, b) => b.clicks - a.clicks);
  }

  async getOverview(
    workspaceId: string,
    dateRange: { from: Date; to: Date }
  ): Promise<OverviewStats> {
    const empty: OverviewStats = {
      totalSent: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0,
      avgOpenRate: 0, avgClickRate: 0, campaignCount: 0, dailyStats: [],
    };
    const col = this.eventsCol(workspaceId);
    if (!col) return empty;

    const snap = await col
      .where('createdAt', '>=', dateRange.from)
      .where('createdAt', '<=', dateRange.to)
      .get();

    let sent = 0, opened = 0, clicked = 0, bounced = 0;
    const campaignSet = new Set<string>();
    const dailyMap = new Map<string, { sent: number; opened: number; clicked: number }>();

    snap.docs.forEach((doc: any) => {
      const event = doc.data() as AnalyticsEvent;
      campaignSet.add(event.campaignId);
      const dateKey = event.createdAt?.toISOString?.().slice(0, 10) || new Date().toISOString().slice(0, 10);
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, { sent: 0, opened: 0, clicked: 0 });
      }
      const day = dailyMap.get(dateKey)!;
      switch (event.eventType) {
        case 'sent': sent++; day.sent++; break;
        case 'opened': opened++; day.opened++; break;
        case 'clicked': clicked++; day.clicked++; break;
        case 'bounced': bounced++; break;
      }
    });

    const dailyStats = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalSent: sent,
      totalOpened: opened,
      totalClicked: clicked,
      totalBounced: bounced,
      avgOpenRate: sent > 0 ? (opened / sent) * 100 : 0,
      avgClickRate: opened > 0 ? (clicked / opened) * 100 : 0,
      campaignCount: campaignSet.size,
      dailyStats,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
