import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Estado inicial
const initialState = {
  users: [],
  loading: false,
  error: null
};

// Tipos de ações
const UserContext = createContext(initialState);

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USERS':
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        loading: false,
        error: null
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        loading: false,
        error: null
      };
    case 'USER_ERROR':
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
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { token } = useContext(AuthContext);

  // Configurar token no header
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  }

  // Obter todos os usuários
  const getUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('/api/users');
      dispatch({ type: 'GET_USERS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response?.data?.msg || 'Erro ao carregar usuários'
      });
    }
  };

  // Atualizar usuário
  const updateUser = async (id, userData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`/api/users/${id}`, userData);
      dispatch({ type: 'UPDATE_USER', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response?.data?.msg || 'Erro ao atualizar usuário'
      });
      throw err;
    }
  };

  // Desativar usuário
  const deleteUser = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`/api/users/${id}`);
      dispatch({ type: 'DELETE_USER', payload: id });
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response?.data?.msg || 'Erro ao desativar usuário'
      });
      throw err;
    }
  };

  // Limpar erros
  const clearErrors = () => dispatch({ type: 'USER_ERROR', payload: null });

  return (
    <UserContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        error: state.error,
        getUsers,
        updateUser,
        deleteUser,
        clearErrors
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}; 