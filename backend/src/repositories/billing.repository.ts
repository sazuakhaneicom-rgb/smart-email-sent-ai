import { db } from '../config/firebase-admin';
import { PaginationOptions } from '../utils/pagination';

export type PlanTier = 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';
export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface BillingPlan {
  tier: PlanTier;
  name: string;
  emailsPerMonth: number;
  contactsLimit: number;
  workspaceMembersLimit: number;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  subscribedAt: Date;
  renewsAt?: Date;
  cancelledAt?: Date;
  stripeSubscriptionId?: string;
  sslcommerzTransactionId?: string;
  emailsSentThisMonth: number;
  monthResetAt: Date;
}

export interface Invoice {
  id: string;
  workspaceId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  paymentMethod?: string;
  stripeInvoiceId?: string;
  sslcommerzValId?: string;
  paidAt?: Date;
  createdAt: Date;
}

const freePlan: BillingPlan = {
  tier: 'free',
  name: 'Free Plan',
  emailsPerMonth: 500,
  contactsLimit: 500,
  workspaceMembersLimit: 1,
  price: 0,
  currency: 'BDT',
  billingCycle: 'monthly',
  subscribedAt: new Date(),
  emailsSentThisMonth: 0,
  monthResetAt: new Date(),
};

export class BillingRepository {
  private billingDoc(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('billing').doc('plan');
  }

  private invoicesCol(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('invoices');
  }

  async getCurrentPlan(workspaceId: string): Promise<BillingPlan> {
    const ref = this.billingDoc(workspaceId);
    if (!ref) return freePlan;
    const doc = await ref.get();
    if (!doc.exists) return freePlan;
    return doc.data() as BillingPlan;
  }

  async updatePlan(workspaceId: string, planData: Partial<BillingPlan>): Promise<BillingPlan> {
    const ref = this.billingDoc(workspaceId);
    if (!ref) return { ...freePlan, ...planData };
    const existing = await this.getCurrentPlan(workspaceId);
    const updated = { ...existing, ...planData, updatedAt: new Date() };
    await ref.set(updated, { merge: true });
    return updated;
  }

  async incrementEmailsSent(workspaceId: string, count: number): Promise<void> {
    const ref = this.billingDoc(workspaceId);
    if (!ref) return;
    const { FieldValue } = await import('firebase-admin/firestore');
    await ref.update({ emailsSentThisMonth: FieldValue.increment(count) });
  }

  async getInvoices(
    workspaceId: string,
    options: PaginationOptions
  ): Promise<{ data: Invoice[]; total: number }> {
    const col = this.invoicesCol(workspaceId);
    if (!col) return { data: [], total: 0 };

    const page = options.page || 1;
    const limit = options.limit || 20;

    const countSnap = await col.count().get();
    const total = countSnap.data().count;

    const snap = await col
      .orderBy('createdAt', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)
      .get();

    const data = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Invoice));
    return { data, total };
  }

  async createInvoice(workspaceId: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
    const col = this.invoicesCol(workspaceId);
    const now = new Date();
    const data = { ...invoiceData, workspaceId, createdAt: now };
    if (!col) return { id: `mock-${Date.now()}`, ...data } as Invoice;
    const ref = await col.add(data);
    return { id: ref.id, ...data } as Invoice;
  }

  async updateInvoice(
    workspaceId: string,
    invoiceId: string,
    data: Partial<Invoice>
  ): Promise<Invoice | null> {
    const col = this.invoicesCol(workspaceId);
    if (!col) return null;
    const ref = col.doc(invoiceId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update(data);
    return { id: invoiceId, ...doc.data(), ...data } as Invoice;
  }
}

export const billingRepository = new BillingRepository();
