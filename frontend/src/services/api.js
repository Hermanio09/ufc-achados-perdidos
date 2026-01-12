import axios from 'axios';

// Base URL da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token nas requisições
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

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH =============

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    // Salvar dados do usuário no localStorage
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    // Salvar dados do usuário no localStorage
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

// ============= ITEMS =============

export const createItem = async (formData) => {
  const response = await api.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getFoundItems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/items/found?${params}`);
  return response.data;
};

export const getItem = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const claimItem = async (id) => {
  const response = await api.post(`/items/${id}/claim`);
  return response.data;
};

export const returnItem = async (id) => {
  const response = await api.post(`/items/${id}/return`);
  return response.data;
};

export const getMyItems = async (type) => {
  const params = type ? `?type=${type}` : '';
  const response = await api.get(`/items/user/my-items${params}`);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};

// ============= USERS =============

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};

export default api;
