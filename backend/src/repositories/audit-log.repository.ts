import { db } from '../config/firebase-admin';
import { PaginationOptions } from '../utils/pagination';

export interface AuditLogEntry {
  id: string;
  workspaceId: string;
  userId: string;
  action: string;
  targetId?: string | null;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export class AuditLogRepository {
  private col(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('auditLogs');
  }

  async create(workspaceId: string, logData: Partial<AuditLogEntry>): Promise<AuditLogEntry> {
    const col = this.col(workspaceId);
    const now = new Date();
    const entry: Omit<AuditLogEntry, 'id'> = {
      workspaceId,
      userId: logData.userId || '',
      action: logData.action || 'unknown',
      targetId: logData.targetId || null,
      ip: logData.ip,
      userAgent: logData.userAgent,
      metadata: logData.metadata,
      timestamp: now,
    };
    if (!col) return { id: `mock-${Date.now()}`, ...entry };
    const ref = await col.add(entry);
    return { id: ref.id, ...entry };
  }

  async findAll(
    workspaceId: string,
    options: PaginationOptions & { userId?: string; action?: string }
  ): Promise<{ data: AuditLogEntry[]; total: number }> {
    const col = this.col(workspaceId);
    if (!col) return { data: [], total: 0 };

    const page = options.page || 1;
    const limit = options.limit || 20;

    let query: FirebaseFirestore.Query = col;
    if (options.userId) {
      query = query.where('userId', '==', options.userId);
    }
    if (options.action) {
      query = query.where('action', '==', options.action);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snap = await query
      .orderBy('timestamp', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)
      .get();

    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AuditLogEntry));
    return { data, total };
  }
}

export const auditLogRepository = new AuditLogRepository();
