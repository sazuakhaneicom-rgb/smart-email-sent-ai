import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCL3976YduCH6P1qNnqmwbx3lzx7guIacg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "smart-email-sent-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "smart-email-sent-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "smart-email-sent-ai.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "850948404150",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:850948404150:web:46d2e847a095c76faa8717",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MZQB16YB4F"
};

let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} else {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

export { app, auth, db, storage, analytics };
