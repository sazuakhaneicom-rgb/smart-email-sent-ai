import { db } from '../config/firebase-admin';
import { PaginationOptions } from '../utils/pagination';

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  designJson: Record<string, unknown>;
  htmlContent?: string;
  tags?: string[];
  isPublic?: boolean;
  workspaceId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TemplatesRepository {
  private col(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('templates');
  }

  async findAll(
    workspaceId: string,
    options: PaginationOptions & { category?: string }
  ): Promise<{ data: EmailTemplate[]; total: number }> {
    const col = this.col(workspaceId);
    if (!col) return { data: [], total: 0 };

    const page = options.page || 1;
    const limit = options.limit || 20;

    let query: FirebaseFirestore.Query = col;
    if (options.category) {
      query = query.where('category', '==', options.category);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    let dataQuery = query.orderBy('createdAt', 'desc').offset((page - 1) * limit).limit(limit);

    if (options.search) {
      // Firestore doesn't support full-text search; filter client-side on small sets
      const allSnap = await query.orderBy('createdAt', 'desc').get();
      const search = options.search.toLowerCase();
      const filtered = allSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as EmailTemplate))
        .filter(
          (t) =>
            t.name.toLowerCase().includes(search) ||
            (t.description || '').toLowerCase().includes(search)
        );
      const start = (page - 1) * limit;
      return {
        data: filtered.slice(start, start + limit),
        total: filtered.length,
      };
    }

    const snap = await dataQuery.get();
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as EmailTemplate));
    return { data, total };
  }

  async findById(workspaceId: string, templateId: string): Promise<EmailTemplate | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const doc = await col.doc(templateId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as EmailTemplate;
  }

  async create(workspaceId: string, data: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const col = this.col(workspaceId);
    const now = new Date();
    const templateData = {
      ...data,
      workspaceId,
      createdAt: now,
      updatedAt: now,
    };
    if (!col) {
      return { id: `mock-${Date.now()}`, ...templateData } as EmailTemplate;
    }
    const ref = await col.add(templateData);
    return { id: ref.id, ...templateData } as EmailTemplate;
  }

  async update(
    workspaceId: string,
    templateId: string,
    data: Partial<EmailTemplate>
  ): Promise<EmailTemplate | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const ref = col.doc(templateId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = { ...data, updatedAt: new Date() };
    await ref.update(updated);
    return { id: templateId, ...doc.data(), ...updated } as EmailTemplate;
  }

  async delete(workspaceId: string, templateId: string): Promise<boolean> {
    const col = this.col(workspaceId);
    if (!col) return false;
    const doc = await col.doc(templateId).get();
    if (!doc.exists) return false;
    await col.doc(templateId).delete();
    return true;
  }

  async duplicate(workspaceId: string, templateId: string, createdBy: string): Promise<EmailTemplate | null> {
    const original = await this.findById(workspaceId, templateId);
    if (!original) return null;
    const { id: _id, createdAt: _ca, updatedAt: _ua, ...rest } = original;
    return this.create(workspaceId, {
      ...rest,
      name: `${original.name} (Copy)`,
      createdBy,
    });
  }
}

export const templatesRepository = new TemplatesRepository();
