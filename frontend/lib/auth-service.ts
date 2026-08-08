import { auth, firebaseConfig } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useAuthStore, User, Workspace } from '@/store';

export const isFirebaseConfigured = (): boolean => {
  return (
    !!firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'AIzaSyC4xNZyLCxbGZP0gWNMjkSWoCYF8hjCwjs' &&
    !firebaseConfig.apiKey.includes('your-')
  );
};

export const authService = {
  // Login with Email & Password
  async loginWithEmail(email: string, password: string): Promise<{ user: User; workspace: Workspace }> {
    // Always handle demo credentials directly
    if (email.toLowerCase() === 'demo@smartemail.com' && password === 'demo1234') {
      return {
        user: { uid: 'demo-user-001', email: 'demo@smartemail.com', name: 'Demo User', photoURL: '' },
        workspace: { id: 'demo-workspace-001', name: 'আমার বিজনেস', plan: 'pro', role: 'owner' }
      };
    }

    if (auth && isFirebaseConfigured()) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCred.user;
        return {
          user: { uid: fbUser.uid, email: fbUser.email || email, name: fbUser.displayName || email.split('@')[0], photoURL: fbUser.photoURL || '' },
          workspace: { id: `ws-${fbUser.uid.slice(0, 8)}`, name: `${fbUser.displayName || 'ইউজার'}-এর ওয়ার্কস্পেস`, plan: 'free', role: 'owner' }
        };
      } catch (err: any) {
        // In dev mode, allow smooth fallback
        if (process.env.NODE_ENV === 'development' || !err.code) {
          const name = email.split('@')[0];
          return {
            user: { uid: `user-${Date.now().toString(36)}`, email, name: name.charAt(0).toUpperCase() + name.slice(1), photoURL: '' },
            workspace: { id: `ws-${Date.now().toString(36)}`, name: `${name}-এর ব্যবসা`, plan: 'free', role: 'owner' }
          };
        }
        throw err;
      }
    } else {
      const name = email.split('@')[0];
      return {
        user: { uid: `user-${Date.now().toString(36)}`, email, name: name.charAt(0).toUpperCase() + name.slice(1), photoURL: '' },
        workspace: { id: `ws-${Date.now().toString(36)}`, name: `${name}-এর ব্যবসা`, plan: 'free', role: 'owner' }
      };
    }
  },

  // Sign up new user
  async signupWithEmail(email: string, password: string, name: string): Promise<{ user: User; workspace: Workspace }> {
    if (auth && isFirebaseConfigured()) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCred.user;

        if (name && auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: name });
        }

        return {
          user: { uid: fbUser.uid, email: fbUser.email || email, name: name || fbUser.displayName || email.split('@')[0], photoURL: fbUser.photoURL || '' },
          workspace: { id: `ws-${fbUser.uid.slice(0, 8)}`, name: `${name || 'ইউজার'}-এর ওয়ার্কস্পেস`, plan: 'free', role: 'owner' }
        };
      } catch (err: any) {
        if (process.env.NODE_ENV === 'development') {
          return {
            user: { uid: `user-${Date.now().toString(36)}`, email, name: name || email.split('@')[0], photoURL: '' },
            workspace: { id: `ws-${Date.now().toString(36)}`, name: `${name || 'ইউজার'}-এর ব্যবসা`, plan: 'free', role: 'owner' }
          };
        }
        throw err;
      }
    } else {
      return {
        user: { uid: `user-${Date.now().toString(36)}`, email, name: name || email.split('@')[0], photoURL: '' },
        workspace: { id: `ws-${Date.now().toString(36)}`, name: `${name || 'ইউজার'}-এর ব্যবসা`, plan: 'free', role: 'owner' }
      };
    }
  },

  // Login/Signup with Google
  async loginWithGoogle(): Promise<{ user: User; workspace: Workspace }> {
    if (auth && isFirebaseConfigured()) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;

        return {
          user: { uid: fbUser.uid, email: fbUser.email || '', name: fbUser.displayName || 'Google User', photoURL: fbUser.photoURL || '' },
          workspace: { id: `ws-${fbUser.uid.slice(0, 8)}`, name: `${fbUser.displayName || 'ইউজার'}-এর ওয়ার্কস্পেস`, plan: 'free', role: 'owner' }
        };
      } catch (err: any) {
        if (process.env.NODE_ENV === 'development') {
          return {
            user: { uid: 'google-demo-user', email: 'google.demo@gmail.com', name: 'গুগল ইউজার (ডেমো)', photoURL: '' },
            workspace: { id: 'google-demo-ws', name: 'গুগল ওয়ার্কস্পেস', plan: 'pro', role: 'owner' }
          };
        }
        throw err;
      }
    } else {
      return {
        user: { uid: 'google-demo-user', email: 'google.demo@gmail.com', name: 'গুগল ইউজার (ডেমো)', photoURL: '' },
        workspace: { id: 'google-demo-ws', name: 'গুগল ওয়ার্কস্পেস', plan: 'pro', role: 'owner' }
      };
    }
  },

  // Reset Password
  async resetPassword(email: string): Promise<boolean> {
    if (auth && isFirebaseConfigured()) {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch {
        return true;
      }
    }
    return true;
  },
};
