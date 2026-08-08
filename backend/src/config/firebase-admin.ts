import { config } from './index';

let admin: any = null;
let db: any = {};
let auth: any = {};
let storage: any = {};

try {
  // Safe optional require so app starts smoothly with or without valid credentials
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  admin = require('firebase-admin');

  if (admin && !admin.apps.length) {
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
  }

  if (admin && admin.apps.length) {
    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
  }
} catch (err) {
  console.warn('⚠️  Firebase Admin load warning:', err);
}

export { admin, db, auth, storage };