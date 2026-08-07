import { db } from '../config/firebase-admin';
import { PaginationOptions } from '../utils/pagination';

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'paused'
  | 'cancelled';

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  templateId?: string;
  designJson?: Record<string, unknown>;
  htmlContent?: string;
  recipientListIds: string[];
  recipientTags?: string[];
  status: CampaignStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  stats: CampaignStats;
  domainId?: string;
  workspaceId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const defaultStats: CampaignStats = {
  sent: 0,
  delivered: 0,
  opened: 0,
  clicked: 0,
  bounced: 0,
  complained: 0,
  unsubscribed: 0,
};

export class CampaignsRepository {
  private col(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('campaigns');
  }

  async findAll(
    workspaceId: string,
    options: PaginationOptions & { status?: string }
  ): Promise<{ data: Campaign[]; total: number }> {
    const col = this.col(workspaceId);
    if (!col) return { data: [], total: 0 };

    const page = options.page || 1;
    const limit = options.limit || 20;

    let query: FirebaseFirestore.Query = col;
    if (options.status) {
      query = query.where('status', '==', options.status);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snap = await query
      .orderBy('createdAt', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)
      .get();

    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Campaign));
    return { data, total };
  }

  async findById(workspaceId: string, campaignId: string): Promise<Campaign | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const doc = await col.doc(campaignId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Campaign;
  }

  async findScheduledReady(): Promise<Campaign[]> {
    if (!db.collection) return [];
    const now = new Date();
    const snap = await db
      .collectionGroup('campaigns')
      .where('status', '==', 'scheduled')
      .where('scheduledAt', '<=', now)
      .limit(50)
      .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Campaign));
  }

  async create(workspaceId: string, data: Partial<Campaign>): Promise<Campaign> {
    const col = this.col(workspaceId);
    const now = new Date();
    const campaignData = {
      ...data,
      status: data.status || 'draft',
      stats: defaultStats,
      workspaceId,
      createdAt: now,
      updatedAt: now,
    };
    if (!col) {
      return { id: `mock-${Date.now()}`, ...campaignData } as Campaign;
    }
    const ref = await col.add(campaignData);
    return { id: ref.id, ...campaignData } as Campaign;
  }

  async update(
    workspaceId: string,
    campaignId: string,
    data: Partial<Campaign>
  ): Promise<Campaign | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const ref = col.doc(campaignId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = { ...data, updatedAt: new Date() };
    await ref.update(updated);
    return { id: campaignId, ...doc.data(), ...updated } as Campaign;
  }

  async delete(workspaceId: string, campaignId: string): Promise<boolean> {
    const col = this.col(workspaceId);
    if (!col) return false;
    const doc = await col.doc(campaignId).get();
    if (!doc.exists) return false;
    await col.doc(campaignId).delete();
    return true;
  }

  async updateStats(
    workspaceId: string,
    campaignId: string,
    stats: Partial<CampaignStats>
  ): Promise<void> {
    const col = this.col(workspaceId);
    if (!col) return;
    const ref = col.doc(campaignId);
    // Use Firestore increment for atomic stat updates
    const increments: Record<string, FirebaseFirestore.FieldValue> = {};
    const { FieldValue } = await import('firebase-admin/firestore');
    for (const [key, val] of Object.entries(stats)) {
      if (typeof val === 'number') {
        increments[`stats.${key}`] = FieldValue.increment(val);
      }
    }
    await ref.update({ ...increments, updatedAt: new Date() });
  }
}

export const campaignsRepository = new CampaignsRepository();
