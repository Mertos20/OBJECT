import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token ekleme interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - 401 hatası geldiğinde logout yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Sayfayı yenile veya login sayfasına yönlendir
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Token istekleri için özel axios instance (API base path olmadan)
const authApi = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients
export const clientAPI = {
  getAll: () => api.get('/clients/'),
  getById: (id) => api.get(`/clients/${id}/`),
  create: (data) => api.post('/clients/', data),
  update: (id, data) => api.put(`/clients/${id}/`, data),
  delete: (id) => api.delete(`/clients/${id}/`),
  assignStaffContact: (id, staffData) => api.post(`/clients/${id}/assign_staff_contact/`, staffData),
};

// Campaigns
export const campaignAPI = {
  getAll: () => api.get('/campaigns/'),
  getById: (id) => api.get(`/campaigns/${id}/`),
  create: (data) => api.post('/campaigns/', data),
  update: (id, data) => api.put(`/campaigns/${id}/`, data),
  delete: (id) => api.delete(`/campaigns/${id}/`),
  assignStaff: (id, staffData) => api.post(`/campaigns/${id}/assign_staff/`, staffData),
};

// Staff
export const staffAPI = {
  getAll: () => api.get('/staff/'),
  getById: (id) => api.get(`/staff/${id}/`),
  create: (data) => api.post('/staff/', data),
  update: (id, data) => api.put(`/staff/${id}/`, data),
  delete: (id) => api.delete(`/staff/${id}/`),
};

// Staff Grades
export const staffGradeAPI = {
  getAll: () => api.get('/staff-grades/'),
  getById: (id) => api.get(`/staff-grades/${id}/`),
  create: (data) => api.post('/staff-grades/', data),
  update: (id, data) => api.put(`/staff-grades/${id}/`, data),
  delete: (id) => api.delete(`/staff-grades/${id}/`),
};

// Payments
export const paymentAPI = {
  getAll: () => api.get('/payments/'),
  getById: (id) => api.get(`/payments/${id}/`),
  create: (data) => api.post('/payments/', data),
  update: (id, data) => api.put(`/payments/${id}/`, data),
  delete: (id) => api.delete(`/payments/${id}/`),
};

// Adverts
export const advertAPI = {
  getAll: () => api.get('/adverts/'),
  getById: (id) => api.get(`/adverts/${id}/`),
  create: (data) => api.post('/adverts/', data),
  update: (id, data) => api.put(`/adverts/${id}/`, data),
  delete: (id) => api.delete(`/adverts/${id}/`),
};

// Campaign Staff Assignments
export const campaignStaffAPI = {
  getAll: () => api.get('/campaign-staff/'),
  getById: (id) => api.get(`/campaign-staff/${id}/`),
  create: (data) => api.post('/campaign-staff/', data),
  delete: (id) => api.delete(`/campaign-staff/${id}/`),
};

// Client Staff Contacts
export const clientStaffContactAPI = {
  getAll: () => api.get('/client-staff-contacts/'),
  getById: (id) => api.get(`/client-staff-contacts/${id}/`),
  create: (data) => api.post('/client-staff-contacts/', data),
  delete: (id) => api.delete(`/client-staff-contacts/${id}/`),
};

// Auth API
export const authAPI = {
  login: (username, password) => authApi.post('/api/token/', { username, password }),
  refreshToken: (refresh) => authApi.post('/api/token/refresh/', { refresh }),
};

export { authApi };
export default api;