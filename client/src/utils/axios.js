import axios from 'axios';
import { CACHE } from '../utils/constants';
import { handleApiError } from './helpers';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CACHE.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(CACHE.TOKEN_KEY);
      localStorage.removeItem(CACHE.USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleApiError(error);
    // Aqui você pode adicionar lógica para mostrar notificações de erro
    return Promise.reject(errorMessage);
  }
);

export default instance; 