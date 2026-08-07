import * as admin from 'firebase-admin';
import { config } from './index';

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let storage: admin.storage.Storage;

if (!admin.apps.length) {
  try {
    if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey,
        }),
        storageBucket: config.firebase.storageBucket,
      });
      console.log('✅ Firebase Admin initialized');
    } else {
      console.warn('⚠️  Firebase credentials not configured — running in mock mode');
    }
  } catch (err) {
    console.error('Firebase init error:', err);
  }
}

db = admin.apps.length ? admin.firestore() : ({} as admin.firestore.Firestore);
auth = admin.apps.length ? admin.auth() : ({} as admin.auth.Auth);
storage = admin.apps.length ? admin.storage() : ({} as admin.storage.Storage);

export { admin, db, auth, storage };
