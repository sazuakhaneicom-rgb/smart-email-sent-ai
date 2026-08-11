import { auth, firebaseConfig } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { User, Workspace } from '@/store';

export const isFirebaseConfigured = (): boolean => {
  return (
    !!firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes('your-') &&
    firebaseConfig.projectId === 'smart-email-sent-ai'
  );
};

// Human-readable Firebase error messages in Bengali
const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/user-not-found':
      return 'এই ইমেইলে কোনো অ্যাকাউন্ট নেই। নতুন অ্যাকাউন্ট তৈরি করুন।';
    case 'auth/wrong-password':
      return 'পাসওয়ার্ড সঠিক নয়।';
    case 'auth/invalid-credential':
      return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।';
    case 'auth/invalid-email':
      return 'ইমেইল ঠিকানাটি সঠিক নয়।';
    case 'auth/email-already-in-use':
      return 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে। লগইন করুন।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
    case 'auth/too-many-requests':
      return 'বহুবার ভুল হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগ সমস্যা। পুনরায় চেষ্টা করুন।';
    case 'auth/popup-closed-by-user':
      return 'Google সাইন-ইন বাতিল করা হয়েছে।';
    case 'auth/popup-blocked':
      return 'Popup block হয়েছে। Browser-এ popup allow করুন।';
    case 'auth/account-exists-with-different-credential':
      return 'এই ইমেইলে অন্য পদ্ধতিতে অ্যাকাউন্ট আছে। পাসওয়ার্ড দিয়ে লগইন করুন।';
    default:
      return 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
  }
};

export const authService = {
  // Listen to Firebase Auth state changes
  initAuthListener(onUserChanged: (user: User | null) => void) {
    if (auth && isFirebaseConfigured()) {
      return auth.onAuthStateChanged((fbUser) => {
        if (fbUser) {
          const user: User = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'ব্যবহারকারী',
            photoURL: fbUser.photoURL || '',
          };
          onUserChanged(user);
        } else {
          onUserChanged(null);
        }
      });
    }
    return () => {};
  },

  // Login with Email & Password — real Firebase ONLY, no fake fallback
  async loginWithEmail(email: string, password: string): Promise<{ user: User; workspace: Workspace }> {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase কানেক্ট নেই। Admin-এর সাথে যোগাযোগ করুন।');
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCred.user;
      return {
        user: {
          uid: fbUser.uid,
          email: fbUser.email || email,
          name: fbUser.displayName || email.split('@')[0],
          photoURL: fbUser.photoURL || '',
        },
        workspace: {
          id: `ws-${fbUser.uid.slice(0, 8)}`,
          name: `${fbUser.displayName || email.split('@')[0]}-এর ওয়ার্কস্পেস`,
          plan: 'free',
          role: 'owner',
        },
      };
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err.code || '');
      throw new Error(msg);
    }
  },

  // Sign up new user — real Firebase ONLY, no fake fallback
  async signupWithEmail(email: string, password: string, name: string): Promise<{ user: User; workspace: Workspace }> {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase কানেক্ট নেই। Admin-এর সাথে যোগাযোগ করুন।');
    }

    try {
      // Check if email already has an account
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods && methods.length > 0) {
        throw Object.assign(new Error(''), { code: 'auth/email-already-in-use' });
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCred.user;

      if (name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      return {
        user: {
          uid: fbUser.uid,
          email: fbUser.email || email,
          name: name || fbUser.displayName || email.split('@')[0],
          photoURL: fbUser.photoURL || '',
        },
        workspace: {
          id: `ws-${fbUser.uid.slice(0, 8)}`,
          name: `${name || 'ইউজার'}-এর ওয়ার্কস্পেস`,
          plan: 'free',
          role: 'owner',
        },
      };
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err.code || '');
      throw new Error(msg);
    }
  },

  // Login with Google — real Firebase, same Google UID always
  async loginWithGoogle(): Promise<{ user: User; workspace: Workspace }> {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase কানেক্ট নেই। Admin-এর সাথে যোগাযোগ করুন।');
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      return {
        user: {
          uid: fbUser.uid, // always same UID for same Google account
          email: fbUser.email || '',
          name: fbUser.displayName || 'গুগল ইউজার',
          photoURL: fbUser.photoURL || '',
        },
        workspace: {
          id: `ws-${fbUser.uid.slice(0, 8)}`, // always same workspace for same Google account
          name: `${fbUser.displayName || 'ইউজার'}-এর ওয়ার্কস্পেস`,
          plan: 'free',
          role: 'owner',
        },
      };
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err.code || '');
      throw new Error(msg);
    }
  },

  // Reset Password
  async resetPassword(email: string): Promise<boolean> {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase কানেক্ট নেই।');
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err.code || '');
      throw new Error(msg);
    }
  },
};
