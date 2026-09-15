import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Issues endpoints
export const issuesAPI = {
  getAll: (published = true) => api.get(`/issues?published=${published}`),
  getCurrent: () => api.get('/issues/current'),
  getById: (id: string) => api.get(`/issues/${id}`),
  create: (data: any) => api.post('/issues', data),
  update: (id: string, data: any) => api.put(`/issues/${id}`, data),
  delete: (id: string) => api.delete(`/issues/${id}`)
};

// Papers endpoints
export const papersAPI = {
  getAll: (params?: any) => api.get('/papers', { params }),
  getById: (id: string) => api.get(`/papers/${id}`),
  create: (formData: FormData) =>
    api.post('/papers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (id: string, formData: FormData) =>
    api.put(`/papers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id: string) => api.delete(`/papers/${id}`)
};

// CFP endpoints
export const cfpAPI = {
  getAll: (includeInactive = false) => api.get(`/cfp?all=${includeInactive}`),
  getById: (id: string) => api.get(`/cfp/${id}`),
  create: (data: any) => api.post('/cfp', data),
  update: (id: string, data: any) => api.put(`/cfp/${id}`, data),
  delete: (id: string) => api.delete(`/cfp/${id}`)
};

// Editorial Board endpoints
export const boardAPI = {
  getAll: (includeInactive = false) => api.get(`/board?all=${includeInactive}`),
  create: (data: any) => api.post('/board', data),
  update: (id: string, data: any) => api.put(`/board/${id}`, data),
  delete: (id: string) => api.delete(`/board/${id}`)
};

// Contact endpoints
export const contactAPI = {
  submit: (data: any) => api.post('/contact', data),
  getAll: (status?: string) => api.get(`/contact${status ? `?status=${status}` : ''}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/contact/${id}/status`, { status })
};

// Admin endpoints
export const adminAPI = {
  getEditors: () => api.get('/admin/editors'),
  deleteEditor: (id: string) => api.delete(`/admin/editors/${id}`),
  getLogs: (params?: any) => api.get('/admin/logs', { params })
};

// Conferences endpoints
export const conferencesAPI = {
  getAll: () => api.get('/conferences'),
  create: (formData: FormData) => 
    api.post('/conferences', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id: string) => api.delete(`/conferences/${id}`)
};

// Settings endpoints
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (formData: FormData) =>
    api.put('/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default api;
