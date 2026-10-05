const API_BASE = '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers = {}, ...customConfig } = options;

  const token = localStorage.getItem('secondlife_token');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, config);
  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = responseData?.message || `Request failed with status ${response.status}`;
    const error: any = new Error(errorMsg);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData;
}

// API methods
export const api = {
  // Auth
  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', data }),
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest('/auth/register', { method: 'POST', data }),
  demoLogin: (accountType: 'monish' | 'admin' | 'guest' = 'monish') =>
    apiRequest('/auth/demo-login', { method: 'POST', data: { accountType } }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    apiRequest('/auth/profile', { method: 'PUT', data }),

  // Components Master Catalog
  getComponents: (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/components${query ? `?${query}` : ''}`);
  },
  getComponentById: (id: string) => apiRequest(`/components/${id}`),
  createComponent: (data: any) => apiRequest('/components', { method: 'POST', data }),
  updateComponent: (id: string, data: any) => apiRequest(`/components/${id}`, { method: 'PUT', data }),
  deleteComponent: (id: string) => apiRequest(`/components/${id}`, { method: 'DELETE' }),

  // User Inventory
  getInventory: (params?: { search?: string; category?: string; condition?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/inventory${query ? `?${query}` : ''}`);
  },
  addInventoryItem: (data: { componentId: string; quantity: number; condition?: string; location?: string; notes?: string }) =>
    apiRequest('/inventory', { method: 'POST', data }),
  updateInventoryItem: (id: string, data: { quantity?: number; condition?: string; location?: string; notes?: string }) =>
    apiRequest(`/inventory/${id}`, { method: 'PUT', data }),
  deleteInventoryItem: (id: string) => apiRequest(`/inventory/${id}`, { method: 'DELETE' }),
  resetDemoInventory: () => apiRequest('/inventory/reset-demo', { method: 'POST' }),

  // Projects
  getProjects: (params?: { category?: string; difficulty?: string; search?: string; featured?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/projects${query ? `?${query}` : ''}`);
  },
  getProjectById: (id: string) => apiRequest(`/projects/${id}`),
  toggleFavorite: (id: string) => apiRequest(`/projects/${id}/favorite`, { method: 'POST' }),
  getFavorites: () => apiRequest('/projects/favorites'),
  markCompleted: (id: string, data?: { notes?: string; rating?: number }) =>
    apiRequest(`/projects/${id}/complete`, { method: 'POST', data }),
  createProject: (data: any) => apiRequest('/projects', { method: 'POST', data }),
  updateProject: (id: string, data: any) => apiRequest(`/projects/${id}`, { method: 'PUT', data }),
  deleteProject: (id: string) => apiRequest(`/projects/${id}`, { method: 'DELETE' }),

  // Recommendations & Matching Engine
  getRecommendations: (params?: { status?: string; category?: string; difficulty?: string; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/recommendations${query ? `?${query}` : ''}`);
  },
  getProjectMatch: (projectId: string) => apiRequest(`/recommendations/${projectId}`),
  analyzeAdHoc: (components: { componentId: string; quantity: number }[]) =>
    apiRequest('/matching/analyze', { method: 'POST', data: { components } }),

  // Sustainability
  getSustainability: () => apiRequest('/sustainability'),

  // Admin
  getAdminUsers: () => apiRequest('/admin/users'),
  updateAdminUserRole: (id: string, role: string) =>
    apiRequest(`/admin/users/${id}/role`, { method: 'PUT', data: { role } }),
  deleteAdminUser: (id: string) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
  getAdminAnalytics: () => apiRequest('/admin/analytics'),
};
