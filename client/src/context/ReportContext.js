import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ReportContext = createContext();

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports deve ser usado dentro de um ReportProvider');
  }
  return context;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports');
      setReports(response.data);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      setError('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/reports', reportData);
      setReports(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      setError('Erro ao criar relatório');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (id, reportData) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/reports/${id}`, reportData);
      setReports(prev => prev.map(report => 
        report.id === id ? response.data : report
      ));
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
      setError('Erro ao atualizar relatório');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/reports/${id}`);
      setReports(prev => prev.filter(report => report.id !== id));
      setError(null);
    } catch (error) {
      console.error('Erro ao remover relatório:', error);
      setError('Erro ao remover relatório');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports/${id}/generate`, {
        responseType: 'blob'
      });
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setError('Erro ao gerar relatório');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReportMetrics = async (filters) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports/metrics', { params: filters });
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      setError('Erro ao buscar métricas');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    reports,
    loading,
    error,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    getReportMetrics,
    loadReports
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};

export default ReportContext; 