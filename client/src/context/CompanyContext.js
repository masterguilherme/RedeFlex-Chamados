import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Estado inicial
const initialState = {
  companies: [],
  loading: false,
  error: null
};

// Tipos de ações
const CompanyContext = createContext(initialState);

// Reducer
const companyReducer = (state, action) => {
  switch (action.type) {
    case 'GET_COMPANIES':
      return {
        ...state,
        companies: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_COMPANY':
      return {
        ...state,
        companies: [...state.companies, action.payload],
        loading: false,
        error: null
      };
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id ? action.payload : company
        ),
        loading: false,
        error: null
      };
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        loading: false,
        error: null
      };
    case 'COMPANY_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

// Provider
export const CompanyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);
  const { token } = useContext(AuthContext);

  // Configurar token no header
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  }

  // Obter todas as empresas
  const getCompanies = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('/api/companies');
      dispatch({ type: 'GET_COMPANIES', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'COMPANY_ERROR',
        payload: err.response?.data?.msg || 'Erro ao carregar empresas'
      });
    }
  };

  // Adicionar empresa
  const addCompany = async (companyData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('/api/companies', companyData);
      dispatch({ type: 'ADD_COMPANY', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'COMPANY_ERROR',
        payload: err.response?.data?.msg || 'Erro ao adicionar empresa'
      });
      throw err;
    }
  };

  // Atualizar empresa
  const updateCompany = async (id, companyData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`/api/companies/${id}`, companyData);
      dispatch({ type: 'UPDATE_COMPANY', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'COMPANY_ERROR',
        payload: err.response?.data?.msg || 'Erro ao atualizar empresa'
      });
      throw err;
    }
  };

  // Desativar empresa
  const deleteCompany = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`/api/companies/${id}`);
      dispatch({ type: 'DELETE_COMPANY', payload: id });
    } catch (err) {
      dispatch({
        type: 'COMPANY_ERROR',
        payload: err.response?.data?.msg || 'Erro ao desativar empresa'
      });
      throw err;
    }
  };

  // Limpar erros
  const clearErrors = () => dispatch({ type: 'COMPANY_ERROR', payload: null });

  return (
    <CompanyContext.Provider
      value={{
        companies: state.companies,
        loading: state.loading,
        error: state.error,
        getCompanies,
        addCompany,
        updateCompany,
        deleteCompany,
        clearErrors
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// Hook personalizado
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany deve ser usado dentro de um CompanyProvider');
  }
  return context;
}; 