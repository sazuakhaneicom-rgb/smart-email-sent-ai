import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  // Actions
  setUser: (user: User | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// ============================================
// Auth Store
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      workspaces: [],
      currentWorkspace: null,
      isLoading: false,   // persist hydration-এর পরে false-ই থাকবে
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      setWorkspaces: (workspaces) => set({ workspaces }),

      setCurrentWorkspace: (workspace) =>
        set({ currentWorkspace: workspace }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          workspaces: [],
          currentWorkspace: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      // user, isAuthenticated সহ persist করলে page refresh-এও লগইন থাকবে
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
