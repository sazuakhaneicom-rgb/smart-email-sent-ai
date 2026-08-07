import { db } from '../config/firebase-admin';

export type DomainStatus = 'pending' | 'verified' | 'failed';

export interface Domain {
  id: string;
  domain: string;
  fromName?: string;
  status: DomainStatus;
  spfVerified: boolean;
  dkimVerified: boolean;
  dmarcVerified: boolean;
  dkimSelector: string;
  dkimPublicKey?: string;
  spfRecord?: string;
  dkimRecord?: string;
  dmarcRecord?: string;
  lastCheckedAt?: Date;
  verifiedAt?: Date;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DomainsRepository {
  private col(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('domains');
  }

  async findAll(workspaceId: string): Promise<Domain[]> {
    const col = this.col(workspaceId);
    if (!col) return [];
    const snap = await col.orderBy('createdAt', 'desc').get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Domain));
  }

  async findById(workspaceId: string, domainId: string): Promise<Domain | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const doc = await col.doc(domainId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Domain;
  }

  async findByDomain(workspaceId: string, domain: string): Promise<Domain | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const snap = await col.where('domain', '==', domain.toLowerCase()).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as Domain;
  }

  async findPendingDomains(): Promise<Domain[]> {
    if (!db.collection) return [];
    const snap = await db
      .collectionGroup('domains')
      .where('status', '==', 'pending')
      .limit(100)
      .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Domain));
  }

  async create(workspaceId: string, data: Partial<Domain>): Promise<Domain> {
    const col = this.col(workspaceId);
    const now = new Date();
    const domainData = {
      ...data,
      domain: (data.domain || '').toLowerCase(),
      status: 'pending' as DomainStatus,
      spfVerified: false,
      dkimVerified: false,
      dmarcVerified: false,
      dkimSelector: data.dkimSelector || 'smartemail',
      workspaceId,
      createdAt: now,
      updatedAt: now,
    };
    if (!col) return { id: `mock-${Date.now()}`, ...domainData } as Domain;
    const ref = await col.add(domainData);
    return { id: ref.id, ...domainData } as Domain;
  }

  async update(
    workspaceId: string,
    domainId: string,
    data: Partial<Domain>
  ): Promise<Domain | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const ref = col.doc(domainId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = { ...data, updatedAt: new Date() };
    await ref.update(updated);
    return { id: domainId, ...doc.data(), ...updated } as Domain;
  }

  async delete(workspaceId: string, domainId: string): Promise<boolean> {
    const col = this.col(workspaceId);
    if (!col) return false;
    const doc = await col.doc(domainId).get();
    if (!doc.exists) return false;
    await col.doc(domainId).delete();
    return true;
  }

  async updateVerificationStatus(
    workspaceId: string,
    domainId: string,
    verification: {
      spfVerified: boolean;
      dkimVerified: boolean;
      dmarcVerified: boolean;
      spfRecord?: string;
      dkimRecord?: string;
      dmarcRecord?: string;
    }
  ): Promise<Domain | null> {
    const allVerified =
      verification.spfVerified && verification.dkimVerified && verification.dmarcVerified;
    const status: DomainStatus = allVerified ? 'verified' : 'pending';
    return this.update(workspaceId, domainId, {
      ...verification,
      status,
      lastCheckedAt: new Date(),
      ...(allVerified && { verifiedAt: new Date() }),
    });
  }
}

export const domainsRepository = new DomainsRepository();
