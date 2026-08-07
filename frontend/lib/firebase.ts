// ============================================
// Firebase placeholder — credentials added later
// ============================================

let app: unknown = null;
let auth: unknown = null;
let db: unknown = null;
let storage: unknown = null;

// Lazy initialize Firebase when credentials are available
const initFirebase = async () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !projectId) {
    console.warn('⚠️  Firebase credentials not configured');
    return;
  }

  try {
    const { initializeApp, getApps } = await import('firebase/app');
    if (getApps().length === 0) {
      app = initializeApp({
        apiKey,
        authDomain,
        projectId,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
      console.log('✅ Firebase initialized');
    }

    const { getAuth } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');
    const { getStorage } = await import('firebase/storage');

    auth = getAuth(app as Parameters<typeof getAuth>[0]);
    db = getFirestore(app as Parameters<typeof getFirestore>[0]);
    storage = getStorage(app as Parameters<typeof getStorage>[0]);
  } catch (err) {
    console.error('Firebase init failed:', err);
  }
};

// Auto-initialize on import (browser only)
if (typeof window !== 'undefined') {
  initFirebase();
}

export { app, auth, db, storage };
export default initFirebase;
