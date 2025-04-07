import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SolicitationList } from '../components/solicitation/SolicitationList';
import { SolicitationDetails } from '../components/solicitation/SolicitationDetails';
import { SolicitationForm } from '../components/solicitation/SolicitationForm';

export const SolicitationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SolicitationList />} />
      <Route path="/new" element={<SolicitationForm />} />
      <Route path="/:id" element={<SolicitationDetails />} />
    </Routes>
  );
}; 