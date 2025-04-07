import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SolicitationRoutes } from './solicitation.routes';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/solicitations/*" element={<SolicitationRoutes />} />
    </Routes>
  );
}; 