import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';
import { TestSolicitation } from '../types/test';

type SolicitationStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface SolicitationContextData {
  solicitations: TestSolicitation[];
  loading: boolean;
  error: string | null;
  getAll: (page?: number, limit?: number, filters?: any) => Promise<void>;
  getById: (id: number) => Promise<TestSolicitation>;
  create: (data: Partial<TestSolicitation>) => Promise<TestSolicitation>;
  update: (id: number, data: Partial<TestSolicitation>) => Promise<TestSolicitation>;
  updateStatus: (id: number, status: SolicitationStatus) => Promise<TestSolicitation>;
  remove: (id: number) => Promise<void>;
}

export const SolicitationContext = createContext<SolicitationContextData>({} as SolicitationContextData);

export const useSolicitation = () => {
  const context = useContext(SolicitationContext);
  if (!context) {
    throw new Error('useSolicitation must be used within a SolicitationProvider');
  }
  return context;
};

export const SolicitationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solicitations, setSolicitations] = useState<TestSolicitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/solicitations', {
        params: { page, limit, ...filters },
      });
      setSolicitations(response.data.data);
    } catch (err) {
      setError('Erro ao carregar solicitações');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: number): Promise<TestSolicitation> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<TestSolicitation>(`/solicitations/${id}`);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar solicitação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: Partial<TestSolicitation>): Promise<TestSolicitation> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<TestSolicitation>('/solicitations', data);
      setSolicitations(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Erro ao criar solicitação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: number, data: Partial<TestSolicitation>): Promise<TestSolicitation> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<TestSolicitation>(`/solicitations/${id}`, data);
      setSolicitations(prev =>
        prev.map(solicitation =>
          solicitation.id === id ? response.data : solicitation
        )
      );
      return response.data;
    } catch (err) {
      setError('Erro ao atualizar solicitação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: SolicitationStatus): Promise<TestSolicitation> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<TestSolicitation>(`/solicitations/${id}/status`, { status });
      setSolicitations(prev =>
        prev.map(solicitation =>
          solicitation.id === id ? { ...solicitation, status } : solicitation
        )
      );
      return response.data;
    } catch (err) {
      setError('Erro ao atualizar status da solicitação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/solicitations/${id}`);
      setSolicitations(prev => prev.filter(solicitation => solicitation.id !== id));
    } catch (err) {
      setError('Erro ao excluir solicitação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SolicitationContext.Provider
      value={{
        solicitations,
        loading,
        error,
        getAll,
        getById,
        create,
        update,
        updateStatus,
        remove,
      }}
    >
      {children}
    </SolicitationContext.Provider>
  );
}; 