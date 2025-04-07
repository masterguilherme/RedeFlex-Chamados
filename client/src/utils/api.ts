import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_URL } from './constants';
import { ApiError, ApiResponse, PaginatedResponse } from '../types/api';

// Configuração base do axios
const api = axios.create({
  baseURL: API_URL,
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

// Interceptor para tratar erros
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

// Função genérica para fazer requisições GET
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Função genérica para fazer requisições GET paginadas
export const getPaginated = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<PaginatedResponse<T>> => {
  try {
    const response = await api.get<PaginatedResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Função genérica para fazer requisições POST
export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Função genérica para fazer requisições PUT
export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Função genérica para fazer requisições DELETE
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Função para fazer upload de arquivos
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<ApiResponse<any>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Função para tratar erros
const handleError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    return {
      message: axiosError.message,
      statusCode: axiosError.response?.status || 500,
    };
  }
  return {
    message: 'Erro desconhecido',
    statusCode: 500,
  };
}; 