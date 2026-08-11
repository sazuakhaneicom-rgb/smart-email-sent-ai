import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';


// ============================================
// Types
// ============================================

export interface User {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'business';
  role: 'owner' | 'admin' | 'editor' | 'viewer';
}

interface AuthState {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

// ============================================
// Auth Store
// ============================================

// Detect fake/dev UIDs that should be cleared
function isFakeUid(uid: string): boolean {
  return (
    uid.startsWith('user-') ||
    uid.startsWith('google-user-') ||
    uid === 'user-001' ||
    uid === 'admin-001' ||
    uid.startsWith('demo-')
  );
}

function getInitialAuthState() {
  if (typeof window === 'undefined') {
    return { user: null, workspaces: [], currentWorkspace: null, isAuthenticated: false };
  }
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      const s = parsed.state || parsed;
      if (s.user && s.user.email) {
        return {
          user: s.user,
          workspaces: s.workspaces || [],
          currentWorkspace: s.currentWorkspace || null,
          isAuthenticated: true,
        };
      }
    }
  } catch (e) {}
  return { user: null, workspaces: [], currentWorkspace: null, isAuthenticated: false };
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      const initial = getInitialAuthState();
      return {
        user: initial.user,
        workspaces: initial.workspaces,
        currentWorkspace: initial.currentWorkspace,
        isLoading: false,
        isAuthenticated: initial.isAuthenticated,
        isHydrated: true,

        setHydrated: (isHydrated) => set({ isHydrated, isLoading: false }),

        setUser: (user) =>
          set({ user, isAuthenticated: !!user, isLoading: false, isHydrated: true }),

        setWorkspaces: (workspaces) => set({ workspaces }),

        setCurrentWorkspace: (workspace) =>
          set({ currentWorkspace: workspace }),

        setLoading: (isLoading) => set({ isLoading }),

        logout: () => {
          // Sign out from Firebase too
          if (auth) {
            signOut(auth).catch(() => {});
          }
          set({
            user: null,
            workspaces: [],
            currentWorkspace: null,
            isAuthenticated: false,
            isLoading: false,
          });
        },

      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        workspaces: state.workspaces,
        currentWorkspace: state.currentWorkspace,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================
// UI Store
// ============================================

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  toasts: Toast[];

  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModal: null,
  toasts: [],

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleSidebarCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// ============================================
// Campaign Wizard Store
// ============================================

interface CampaignWizardState {
  step: 1 | 2 | 3 | 4;
  campaignId: string | null;
  formData: {
    name: string;
    subject: string;
    fromName: string;
    fromEmail: string;
    replyTo: string;
    templateId: string | null;
    listIds: string[];
    scheduledAt: string | null;
  };

  setStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCampaignId: (id: string) => void;
  updateFormData: (data: Partial<CampaignWizardState['formData']>) => void;
  reset: () => void;
}

const initialFormData = {
  name: '',
  subject: '',
  fromName: '',
  fromEmail: '',
  replyTo: '',
  templateId: null,
  listIds: [],
  scheduledAt: null,
};

export const useCampaignWizardStore = create<CampaignWizardState>((set) => ({
  step: 1,
  campaignId: null,
  formData: initialFormData,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(4, state.step + 1) as 1 | 2 | 3 | 4 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) as 1 | 2 | 3 | 4 })),
  setCampaignId: (campaignId) => set({ campaignId }),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () => set({ step: 1, campaignId: null, formData: initialFormData }),
}));
