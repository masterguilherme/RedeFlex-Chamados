import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

export interface Technician {
  id: number;
  name: string;
  email: string;
  status: string;
  specialization: string;
  phone: string;
  address: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TechnicianContextData {
  technicians: Technician[];
  loading: boolean;
  error: string | null;
  getAll: (page?: number, limit?: number, filters?: any) => Promise<{ data: Technician[]; total: number; page: number; totalPages: number }>;
  getById: (id: number) => Promise<Technician>;
  create: (data: Omit<Technician, 'id' | 'createdAt' | 'user'>) => Promise<Technician>;
  update: (id: number, data: Partial<Technician>) => Promise<Technician>;
  updateStatus: (id: number, status: string) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

const TechnicianContext = createContext<TechnicianContextData>({} as TechnicianContextData);

export const TechnicianProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/technicians', {
        params: { page, limit, ...filters },
      });
      setTechnicians(response.data.data);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar técnicos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/technicians/${id}`);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: Omit<Technician, 'id' | 'createdAt' | 'user'>) => {
    try {
      setLoading(true);
      const response = await api.post('/technicians', data);
      setTechnicians(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Erro ao criar técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: number, data: Partial<Technician>) => {
    try {
      setLoading(true);
      const response = await api.put(`/technicians/${id}`, data);
      setTechnicians(prev => prev.map(tech => tech.id === id ? response.data : tech));
      return response.data;
    } catch (err) {
      setError('Erro ao atualizar técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      setLoading(true);
      await api.patch(`/technicians/${id}/status`, { status });
      setTechnicians(prev => prev.map(tech => tech.id === id ? { ...tech, status } : tech));
    } catch (err) {
      setError('Erro ao atualizar status do técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTechnician = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await api.delete(`/technicians/${id}`);
      setTechnicians(prev => prev.filter(tech => tech.id !== id));
    } catch (err) {
      setError('Erro ao excluir técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TechnicianContext.Provider
      value={{
        technicians,
        loading,
        error,
        getAll,
        getById,
        create,
        update,
        updateStatus,
        delete: deleteTechnician,
      }}
    >
      {children}
    </TechnicianContext.Provider>
  );
};

export const useTechnician = () => {
  const context = useContext(TechnicianContext);
  if (!context) {
    throw new Error('useTechnician must be used within a TechnicianProvider');
  }
  return context;
}; 