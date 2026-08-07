import { db } from '../config/firebase-admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  language?: string;
  timezone?: string;
  mfaEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWorkspaceRef {
  workspaceId: string;
  workspaceName: string;
  role: string;
  joinedAt: Date;
}

export class UsersRepository {
  private col() {
    if (!db.collection) return null;
    return db.collection('users');
  }

  async findById(userId: string): Promise<UserProfile | null> {
    const col = this.col();
    if (!col) return null;
    const doc = await col.doc(userId).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() } as UserProfile;
  }

  async create(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const col = this.col();
    const now = new Date();
    const profileData: UserProfile = {
      uid: userId,
      email: data.email || '',
      displayName: data.displayName,
      photoURL: data.photoURL,
      language: data.language || 'bn',
      timezone: data.timezone || 'Asia/Dhaka',
      mfaEnabled: false,
      createdAt: now,
      updatedAt: now,
    };
    if (col) {
      await col.doc(userId).set(profileData);
    }
    return profileData;
  }

  async update(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
    const col = this.col();
    if (!col) return null;
    const ref = col.doc(userId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = { ...data, updatedAt: new Date() };
    await ref.update(updated);
    return { uid: userId, ...doc.data(), ...updated } as UserProfile;
  }

  async upsert(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const col = this.col();
    const existing = await this.findById(userId);
    if (existing) {
      const updated = await this.update(userId, data);
      return updated || existing;
    }
    return this.create(userId, data);
  }

  async getWorkspaces(userId: string): Promise<UserWorkspaceRef[]> {
    if (!db.collection) return [];
    // Query all workspaces where this user is a member
    const workspacesSnap = await db.collection('workspaces').get();
    const results: UserWorkspaceRef[] = [];

    for (const wsDoc of workspacesSnap.docs) {
      const memberDoc = await wsDoc.ref.collection('members').doc(userId).get();
      if (memberDoc.exists) {
        const memberData = memberDoc.data() as { role: string; joinedAt: Date };
        const wsData = wsDoc.data() as { name: string };
        results.push({
          workspaceId: wsDoc.id,
          workspaceName: wsData.name,
          role: memberData.role,
          joinedAt: memberData.joinedAt,
        });
      }
    }
    return results;
  }
}

export const usersRepository = new UsersRepository();
