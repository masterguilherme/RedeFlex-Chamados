import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const LogContext = createContext();

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs deve ser usado dentro de um LogProvider');
  }
  return context;
};

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const loadLogs = async (type, startDate, endDate, limit) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/logs', {
        params: { type, startDate, endDate, limit }
      });
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (type, period) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/logs/stats', {
        params: { type, period }
      });
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const cleanupLogs = async (maxAge) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/logs/cleanup', { maxAge });
      await loadLogs();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao limpar logs');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LogContext.Provider
      value={{
        logs,
        stats,
        loading,
        error,
        loadLogs,
        loadStats,
        cleanupLogs
      }}
    >
      {children}
    </LogContext.Provider>
  );
}; 