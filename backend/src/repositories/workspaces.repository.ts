import { db } from '../config/firebase-admin';
import { WorkspaceRole } from '../middleware/workspace';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  industry?: string;
  timezone?: string;
  defaultFromName?: string;
  defaultFromEmail?: string;
  ownerId: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  email: string;
  name?: string;
  role: WorkspaceRole;
  status: 'active' | 'invited' | 'suspended';
  joinedAt: Date;
  invitedBy?: string;
}

export class WorkspacesRepository {
  private col() {
    if (!db.collection) return null;
    return db.collection('workspaces');
  }

  async findById(workspaceId: string): Promise<Workspace | null> {
    const col = this.col();
    if (!col) return null;
    const doc = await col.doc(workspaceId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Workspace;
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    const col = this.col();
    if (!col) return null;
    const snap = await col.where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as Workspace;
  }

  async create(data: Partial<Workspace>): Promise<Workspace> {
    const col = this.col();
    const now = new Date();
    const workspaceData = {
      ...data,
      memberCount: 1,
      createdAt: now,
      updatedAt: now,
    };
    if (!col) return { id: `mock-${Date.now()}`, ...workspaceData } as Workspace;
    const ref = await col.add(workspaceData);
    return { id: ref.id, ...workspaceData } as Workspace;
  }

  async update(workspaceId: string, data: Partial<Workspace>): Promise<Workspace | null> {
    const col = this.col();
    if (!col) return null;
    const ref = col.doc(workspaceId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = { ...data, updatedAt: new Date() };
    await ref.update(updated);
    return { id: workspaceId, ...doc.data(), ...updated } as Workspace;
  }

  async delete(workspaceId: string): Promise<boolean> {
    const col = this.col();
    if (!col) return false;
    const doc = await col.doc(workspaceId).get();
    if (!doc.exists) return false;
    await col.doc(workspaceId).delete();
    return true;
  }

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const col = this.col();
    if (!col) return [];
    const snap = await col
      .doc(workspaceId)
      .collection('members')
      .orderBy('joinedAt', 'asc')
      .get();
    return snap.docs.map((doc: any) => ({ userId: doc.id, ...doc.data() } as WorkspaceMember));
  }

  async addMember(
    workspaceId: string,
    userId: string,
    memberData: Partial<WorkspaceMember>
  ): Promise<WorkspaceMember> {
    const col = this.col();
    const now = new Date();
    const data: WorkspaceMember = {
      userId,
      email: memberData.email || '',
      name: memberData.name,
      role: memberData.role || 'viewer',
      status: memberData.status || 'active',
      joinedAt: now,
      invitedBy: memberData.invitedBy,
    };
    if (col) {
      await col.doc(workspaceId).collection('members').doc(userId).set(data);
      const { FieldValue } = await import('firebase-admin/firestore');
      await col.doc(workspaceId).update({ memberCount: FieldValue.increment(1), updatedAt: new Date() });
    }
    return data;
  }

  async updateMember(
    workspaceId: string,
    userId: string,
    data: Partial<WorkspaceMember>
  ): Promise<WorkspaceMember | null> {
    const col = this.col();
    if (!col) return null;
    const ref = col.doc(workspaceId).collection('members').doc(userId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update(data);
    return { userId, ...doc.data(), ...data } as WorkspaceMember;
  }

  async removeMember(workspaceId: string, userId: string): Promise<boolean> {
    const col = this.col();
    if (!col) return false;
    const ref = col.doc(workspaceId).collection('members').doc(userId);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    const { FieldValue } = await import('firebase-admin/firestore');
    await col.doc(workspaceId).update({ memberCount: FieldValue.increment(-1), updatedAt: new Date() });
    return true;
  }
}

export const workspacesRepository = new WorkspacesRepository();
