import { User, UserResponse } from '../types/user';
import { CACHE } from './constants';
import { post } from './api';

// Função para fazer login
export const login = async (email: string, password: string): Promise<UserResponse> => {
  const response = await post<UserResponse>('/auth/login', { email, password });
  saveAuthData(response.data);
  return response.data;
};

// Função para fazer logout
export const logout = (): void => {
  localStorage.removeItem(CACHE.TOKEN_KEY);
  localStorage.removeItem(CACHE.USER_KEY);
  window.location.href = '/login';
};

// Função para salvar dados de autenticação
export const saveAuthData = (data: UserResponse): void => {
  localStorage.setItem(CACHE.TOKEN_KEY, data.token);
  localStorage.setItem(CACHE.USER_KEY, JSON.stringify(data.user));
};

// Função para obter o token de autenticação
export const getToken = (): string | null => {
  return localStorage.getItem(CACHE.TOKEN_KEY);
};

// Função para obter o usuário atual
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(CACHE.USER_KEY);
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getCurrentUser();
};

// Função para verificar se o token expirou
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Converter para milissegundos
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};

// Função para verificar se o usuário tem permissão
export const hasPermission = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admin tem acesso a tudo
  if (user.role === 'admin') return true;

  // Verificar se o usuário tem a role necessária
  return user.role === requiredRole;
};

// Função para verificar se o usuário tem uma das permissões
export const hasAnyPermission = (requiredRoles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admin tem acesso a tudo
  if (user.role === 'admin') return true;

  // Verificar se o usuário tem alguma das roles necessárias
  return requiredRoles.includes(user.role);
}; 