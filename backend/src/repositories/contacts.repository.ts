import { db } from '../config/firebase-admin';
import { PaginationOptions } from '../utils/pagination';

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  listIds?: string[];
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFilters extends PaginationOptions {
  status?: string;
  listId?: string;
  tag?: string;
}

const MOCK_CONTACTS: Contact[] = [];

export class ContactsRepository {
  private col(workspaceId: string) {
    if (!db.collection) return null;
    return db.collection('workspaces').doc(workspaceId).collection('contacts');
  }

  async findAll(
    workspaceId: string,
    options: ContactFilters
  ): Promise<{ data: Contact[]; total: number }> {
    const col = this.col(workspaceId);
    if (!col) return { data: MOCK_CONTACTS, total: 0 };

    const page = options.page || 1;
    const limit = options.limit || 20;

    let query: FirebaseFirestore.Query = col;

    if (options.status) {
      query = query.where('status', '==', options.status);
    }
    if (options.listId) {
      query = query.where('listIds', 'array-contains', options.listId);
    }
    if (options.tag) {
      query = query.where('tags', 'array-contains', options.tag);
    }

    const countSnap = await query.count().get();
    const total = countSnap.data().count;

    const snap = await query
      .orderBy('createdAt', 'desc')
      .offset((page - 1) * limit)
      .limit(limit)
      .get();

    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Contact));
    return { data, total };
  }

  async findById(workspaceId: string, contactId: string): Promise<Contact | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const doc = await col.doc(contactId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Contact;
  }

  async findByEmail(workspaceId: string, email: string): Promise<Contact | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const snap = await col.where('email', '==', email.toLowerCase()).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as Contact;
  }

  async create(workspaceId: string, data: Partial<Contact>): Promise<Contact> {
    const col = this.col(workspaceId);
    const now = new Date();
    const contactData = {
      ...data,
      email: (data.email || '').toLowerCase(),
      status: data.status || 'subscribed',
      workspaceId,
      createdAt: now,
      updatedAt: now,
    };
    if (!col) {
      return { id: `mock-${Date.now()}`, ...contactData } as Contact;
    }
    const ref = await col.add(contactData);
    return { id: ref.id, ...contactData } as Contact;
  }

  async update(
    workspaceId: string,
    contactId: string,
    data: Partial<Contact>
  ): Promise<Contact | null> {
    const col = this.col(workspaceId);
    if (!col) return null;
    const ref = col.doc(contactId);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = { ...data, updatedAt: new Date() };
    await ref.update(updated);
    return { id: contactId, ...doc.data(), ...updated } as Contact;
  }

  async delete(workspaceId: string, contactId: string): Promise<boolean> {
    const col = this.col(workspaceId);
    if (!col) return false;
    const doc = await col.doc(contactId).get();
    if (!doc.exists) return false;
    await col.doc(contactId).delete();
    return true;
  }

  async bulkCreate(
    workspaceId: string,
    contacts: Partial<Contact>[]
  ): Promise<{ created: number; duplicates: number; errors: number }> {
    const col = this.col(workspaceId);
    if (!col) return { created: 0, duplicates: 0, errors: 0 };

    let created = 0;
    let duplicates = 0;
    let errors = 0;
    const now = new Date();

    // Process in batches of 500 (Firestore limit)
    const batchSize = 500;
    for (let i = 0; i < contacts.length; i += batchSize) {
      const chunk = contacts.slice(i, i + batchSize);
      const batch = db.batch();

      for (const contact of chunk) {
        try {
          if (!contact.email) {
            errors++;
            continue;
          }
          // Check for duplicates
          const existing = await this.findByEmail(workspaceId, contact.email);
          if (existing) {
            duplicates++;
            continue;
          }
          const ref = col.doc();
          batch.set(ref, {
            ...contact,
            email: contact.email.toLowerCase(),
            status: contact.status || 'subscribed',
            workspaceId,
            createdAt: now,
            updatedAt: now,
          });
          created++;
        } catch {
          errors++;
        }
      }
      await batch.commit();
    }
    return { created, duplicates, errors };
  }
}

export const contactsRepository = new ContactsRepository();
