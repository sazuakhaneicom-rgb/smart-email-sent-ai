import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach Firebase ID token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get Firebase token dynamically to avoid circular imports
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Firebase not configured — use dev token in development
      if (process.env.NODE_ENV === 'development') {
        config.headers.Authorization = 'Bearer dev-token';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: { code: string; message: string } }>) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Workspace-scoped API helper
export const workspaceApi = (workspaceId: string) => ({
  contacts: {
    list: (params?: Record<string, string>) =>
      apiClient.get(`/workspaces/${workspaceId}/contacts`, { params }),
    create: (data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/contacts`, data),
    update: (id: string, data: unknown) =>
      apiClient.patch(`/workspaces/${workspaceId}/contacts/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/workspaces/${workspaceId}/contacts/${id}`),
    import: (data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/contacts/import`, data),
  },
  campaigns: {
    list: (params?: Record<string, string>) =>
      apiClient.get(`/workspaces/${workspaceId}/campaigns`, { params }),
    create: (data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/campaigns`, data),
    get: (id: string) =>
      apiClient.get(`/workspaces/${workspaceId}/campaigns/${id}`),
    update: (id: string, data: unknown) =>
      apiClient.patch(`/workspaces/${workspaceId}/campaigns/${id}`, data),
    send: (id: string) =>
      apiClient.post(`/workspaces/${workspaceId}/campaigns/${id}/send`),
    schedule: (id: string, data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/campaigns/${id}/schedule`, data),
    testSend: (id: string, data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/campaigns/${id}/test-send`, data),
  },
  templates: {
    list: (params?: Record<string, string>) =>
      apiClient.get(`/workspaces/${workspaceId}/templates`, { params }),
    create: (data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/templates`, data),
    get: (id: string) =>
      apiClient.get(`/workspaces/${workspaceId}/templates/${id}`),
    update: (id: string, data: unknown) =>
      apiClient.patch(`/workspaces/${workspaceId}/templates/${id}`, data),
    duplicate: (id: string) =>
      apiClient.post(`/workspaces/${workspaceId}/templates/${id}/duplicate`),
  },
  analytics: {
    overview: (params?: Record<string, string>) =>
      apiClient.get(`/workspaces/${workspaceId}/analytics/overview`, { params }),
    campaign: (campaignId: string) =>
      apiClient.get(`/workspaces/${workspaceId}/analytics/campaigns/${campaignId}`),
  },
  domains: {
    list: () => apiClient.get(`/workspaces/${workspaceId}/domains`),
    add: (data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/domains`, data),
    verify: (id: string) =>
      apiClient.post(`/workspaces/${workspaceId}/domains/${id}/verify`),
    delete: (id: string) =>
      apiClient.delete(`/workspaces/${workspaceId}/domains/${id}`),
  },
  billing: {
    get: () => apiClient.get(`/workspaces/${workspaceId}/billing`),
    subscribe: (data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/billing/subscribe`, data),
    invoices: () => apiClient.get(`/workspaces/${workspaceId}/billing/invoices`),
  },
  dashboard: {
    summary: () => apiClient.get(`/workspaces/${workspaceId}/dashboard/summary`),
    activity: () => apiClient.get(`/workspaces/${workspaceId}/dashboard/activity`),
    chart: (range: string) =>
      apiClient.get(`/workspaces/${workspaceId}/dashboard/chart`, { params: { range } }),
  },
  lists: {
    list: () => apiClient.get(`/workspaces/${workspaceId}/lists`),
    create: (data: unknown) =>
      apiClient.post(`/workspaces/${workspaceId}/lists`, data),
  },
});

export const authApi = {
  sync: (data: unknown) => apiClient.post('/auth/sync', data),
  me: () => apiClient.get('/auth/me'),
  changePassword: (data: unknown) => apiClient.post('/auth/change-password', data),
  sessions: () => apiClient.get('/auth/sessions'),
  revokeSession: (id: string) => apiClient.delete(`/auth/sessions/${id}`),
  updateProfile: (data: unknown) => apiClient.patch('/auth/me', data),
};

export default apiClient;
