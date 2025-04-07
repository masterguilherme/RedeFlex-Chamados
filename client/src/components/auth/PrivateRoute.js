import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ component: Component, allowedTypes, ...rest }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Verificar tipo de usuário se allowedTypes for fornecido
  if (allowedTypes && user && !allowedTypes.includes(user.userType)) {
    return <Navigate to="/acesso-negado" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute; 