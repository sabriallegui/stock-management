import axios, { AxiosError } from 'axios';

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized) - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
  updatedAt?: string;
}

export interface Gadget {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  status: 'AVAILABLE' | 'IN_USE' | 'BROKEN' | 'MAINTENANCE';
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  userId: string;
  gadgetId: string;
  startDate: string;
  endDate?: string;
  returned: boolean;
  returnedAt?: string;
  notes?: string;
  user?: User;
  gadget?: Gadget;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  userId: string;
  gadgetId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  quantity: number;
  user?: User;
  gadget?: Gadget;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};

// Users API (Admin only)
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  create: async (userData: { email: string; name: string; password: string; role?: 'ADMIN' | 'USER' }): Promise<User> => {
    const { data } = await api.post<User>('/users', userData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Gadgets API
export const gadgetsApi = {
  getAll: async (): Promise<Gadget[]> => {
    const { data } = await api.get<Gadget[]>('/gadgets');
    return data;
  },

  getById: async (id: string): Promise<Gadget> => {
    const { data } = await api.get<Gadget>(`/gadgets/${id}`);
    return data;
  },

  create: async (gadgetData: Partial<Gadget>): Promise<Gadget> => {
    const { data } = await api.post<Gadget>('/gadgets', gadgetData);
    return data;
  },

  update: async (id: string, gadgetData: Partial<Gadget>): Promise<Gadget> => {
    const { data } = await api.put<Gadget>(`/gadgets/${id}`, gadgetData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/gadgets/${id}`);
  },
};

// Assignments API
export const assignmentsApi = {
  getAll: async (): Promise<Assignment[]> => {
    const { data } = await api.get<Assignment[]>('/assignments');
    return data;
  },

  create: async (assignmentData: { userId: string; gadgetId: string; notes?: string }): Promise<Assignment> => {
    const { data } = await api.post<Assignment>('/assignments', assignmentData);
    return data;
  },

  returnGadget: async (id: string): Promise<Assignment> => {
    const { data } = await api.put<Assignment>(`/assignments/${id}/return`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/assignments/${id}`);
  },
};

// Requests API
export const requestsApi = {
  getAll: async (): Promise<Request[]> => {
    const { data } = await api.get<Request[]>('/requests');
    return data;
  },

  create: async (requestData: { gadgetId: string; reason?: string; quantity?: number }): Promise<Request> => {
    const { data } = await api.post<Request>('/requests', requestData);
    return data;
  },

  approve: async (id: string): Promise<Request> => {
    const { data } = await api.put<Request>(`/requests/${id}/approve`);
    return data;
  },

  reject: async (id: string): Promise<Request> => {
    const { data } = await api.put<Request>(`/requests/${id}/reject`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/requests/${id}`);
  },
};

export default api;
