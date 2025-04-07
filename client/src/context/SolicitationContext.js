import React, { createContext, useContext, useState, useEffect } from 'react';
import { solicitationService } from '../services/api';
import { handleApiError } from '../utils/helpers';
import { PAGINATION } from '../utils/constants';

const SolicitationContext = createContext(null);

export const SolicitationProvider = ({ children }) => {
  const [solicitations, setSolicitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
  });

  const fetchSolicitations = async (page = 1, limit = PAGINATION.DEFAULT_LIMIT) => {
    try {
      setLoading(true);
      setError(null);
      const response = await solicitationService.getAll(page, limit);
      setSolicitations(response.data);
      setPagination({
        page,
        limit,
        total: response.total,
      });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createSolicitation = async (solicitationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await solicitationService.create(solicitationData);
      setSolicitations((prev) => [response, ...prev]);
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSolicitation = async (id, solicitationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await solicitationService.update(id, solicitationData);
      setSolicitations((prev) =>
        prev.map((solicitation) =>
          solicitation.id === id ? response : solicitation
        )
      );
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSolicitation = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await solicitationService.delete(id);
      setSolicitations((prev) =>
        prev.filter((solicitation) => solicitation.id !== id)
      );
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSolicitationById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await solicitationService.getById(id);
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    solicitations,
    loading,
    error,
    pagination,
    fetchSolicitations,
    createSolicitation,
    updateSolicitation,
    deleteSolicitation,
    getSolicitationById,
    clearError,
  };

  return (
    <SolicitationContext.Provider value={value}>
      {children}
    </SolicitationContext.Provider>
  );
};

export const useSolicitation = () => {
  const context = useContext(SolicitationContext);
  if (!context) {
    throw new Error('useSolicitation deve ser usado dentro de um SolicitationProvider');
  }
  return context;
};

export default SolicitationContext; 