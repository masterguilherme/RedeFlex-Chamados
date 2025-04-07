import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/auth/PrivateRoute';
import { ROUTES } from '../utils/constants';

// Páginas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AccessDenied from '../pages/AccessDenied';
import Profile from '../pages/Profile';
import SolicitationList from '../pages/solicitations/List';
import SolicitationCreate from '../pages/solicitations/Create';
import SolicitationDetails from '../pages/solicitations/Details';
import TechnicianList from '../pages/technicians/List';
import TechnicianDetails from '../pages/technicians/Details';
import Admin from '../pages/Admin';
import LogsPage from '../pages/logs/LogsPage';

// Componente para proteger rotas
const PrivateRoute = ({ children, allowedTypes }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedTypes && !allowedTypes.includes(user.userType)) {
    return <Navigate to="/acesso-negado" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.ACCESS_DENIED} element={<AccessDenied />} />

      {/* Rotas protegidas */}
      <Route
        path={ROUTES.HOME}
        element={
          <PrivateRoute
            component={Home}
            allowedTypes={['admin', 'solicitante', 'prestador']}
          />
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <PrivateRoute
            component={Profile}
            allowedTypes={['admin', 'solicitante', 'prestador']}
          />
        }
      />

      {/* Rotas de solicitações */}
      <Route
        path={ROUTES.SOLICITATIONS}
        element={
          <PrivateRoute
            component={SolicitationList}
            allowedTypes={['admin', 'solicitante', 'prestador']}
          />
        }
      />

      <Route
        path={ROUTES.NEW_SOLICITATION}
        element={
          <PrivateRoute
            component={SolicitationCreate}
            allowedTypes={['admin', 'solicitante']}
          />
        }
      />

      <Route
        path={ROUTES.SOLICITATION_DETAILS}
        element={
          <PrivateRoute
            component={SolicitationDetails}
            allowedTypes={['admin', 'solicitante', 'prestador']}
          />
        }
      />

      {/* Rotas de técnicos */}
      <Route
        path={ROUTES.TECHNICIANS}
        element={
          <PrivateRoute
            component={TechnicianList}
            allowedTypes={['admin', 'solicitante', 'prestador']}
          />
        }
      />

      <Route
        path={ROUTES.TECHNICIAN_DETAILS}
        element={
          <PrivateRoute
            component={TechnicianDetails}
            allowedTypes={['admin', 'solicitante', 'prestador']}
          />
        }
      />

      <Route
        path={ROUTES.ADMIN}
        element={
          <PrivateRoute allowedTypes={['admin']}>
            <Admin />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.LOGS}
        element={
          <PrivateRoute allowedTypes={['admin']}>
            <LogsPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 