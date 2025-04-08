import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Mostrar um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Redirecionar para a página de login se não estiver autenticado
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Renderizar o componente filho se estiver autenticado
  return children;
};

export default PrivateRoute; 