import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se há um token no localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Configurar o token no cabeçalho das requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verificar se o token é válido
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setCurrentUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Salvar o token no localStorage
      localStorage.setItem('authToken', token);
      
      // Configurar o token no cabeçalho das requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError(error.response?.data?.message || 'Erro ao fazer login');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      setError(error.response?.data?.message || 'Erro ao registrar usuário');
      throw error;
    }
  };

  const logout = () => {
    // Remover o token do localStorage
    localStorage.removeItem('authToken');
    
    // Remover o token do cabeçalho das requisições
    delete axios.defaults.headers.common['Authorization'];
    
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
