import axios from '../utils/axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, senha) => {
    const response = await axios.post('/auth/login', { email, senha });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

export const userService = {
  getCurrentUser: async () => {
    const response = await axios.get('/users/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axios.put('/users/me', userData);
    return response.data;
  },
};

export const solicitationService = {
  create: async (solicitationData) => {
    const response = await axios.post('/solicitations', solicitationData);
    return response.data;
  },

  getAll: async (page = 1, limit = 10) => {
    const response = await axios.get('/solicitations', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/solicitations/${id}`);
    return response.data;
  },

  update: async (id, solicitationData) => {
    const response = await axios.put(`/solicitations/${id}`, solicitationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/solicitations/${id}`);
    return response.data;
  },
};

export const technicianService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await axios.get('/technicians', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/technicians/${id}`);
    return response.data;
  },

  update: async (id, technicianData) => {
    const response = await axios.put(`/technicians/${id}`, technicianData);
    return response.data;
  },
};

export const commentService = {
  create: async (solicitationId, commentData) => {
    const response = await axios.post(`/solicitations/${solicitationId}/comments`, commentData);
    return response.data;
  },

  delete: async (solicitationId, commentId) => {
    const response = await axios.delete(`/solicitations/${solicitationId}/comments/${commentId}`);
    return response.data;
  },
};

export const attachmentService = {
  upload: async (solicitationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`/solicitations/${solicitationId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (solicitationId, attachmentId) => {
    const response = await axios.delete(`/solicitations/${solicitationId}/attachments/${attachmentId}`);
    return response.data;
  },
};

export default api; 