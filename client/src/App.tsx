import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { SolicitationProvider } from './context/SolicitationContext';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SolicitationProvider>
        <AppRoutes />
      </SolicitationProvider>
    </BrowserRouter>
  );
}; 