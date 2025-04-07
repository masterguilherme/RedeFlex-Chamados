import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TechnicianList } from '../TechnicianList';
import { TechnicianProvider } from '../../../context/TechnicianContext';
import { AuthProvider } from '../../../context/AuthContext';
import { TestTechnician } from '../../../types/test';

const mockTechnicians: TestTechnician[] = [
  {
    id: 1,
    name: 'Test Technician 1',
    email: 'tech1@example.com',
    phone: '1234567890',
    status: 'active',
  },
  {
    id: 2,
    name: 'Test Technician 2',
    email: 'tech2@example.com',
    phone: '0987654321',
    status: 'inactive',
  },
];

const renderComponent = () => {
  return render(
    <AuthProvider>
      <TechnicianProvider>
        <MemoryRouter>
          <TechnicianList />
        </MemoryRouter>
      </TechnicianProvider>
    </AuthProvider>
  );
};

describe('TechnicianList', () => {
  it('should render technician list', async () => {
    renderComponent();

    await waitFor(() => {
      mockTechnicians.forEach((technician) => {
        expect(screen.getByText(technician.name)).toBeInTheDocument();
        expect(screen.getByText(technician.email)).toBeInTheDocument();
        expect(screen.getByText(technician.status)).toBeInTheDocument();
      });
    });
  });

  it('should filter technicians by name', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Buscar técnico...');
    fireEvent.change(searchInput, { target: { value: 'Test Technician 1' } });

    await waitFor(() => {
      expect(screen.getByText('Test Technician 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Technician 2')).not.toBeInTheDocument();
    });
  });

  it('should filter technicians by status', async () => {
    renderComponent();

    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'active' } });

    await waitFor(() => {
      expect(screen.getByText('Test Technician 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Technician 2')).not.toBeInTheDocument();
    });
  });

  it('should navigate to technician details when row is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      const technicianRow = screen.getByText('Test Technician 1').closest('tr');
      fireEvent.click(technicianRow!);
      expect(window.location.pathname).toBe('/technicians/1');
    });
  });

  it('should open create technician dialog when add button is clicked', async () => {
    renderComponent();

    const addButton = screen.getByText('Adicionar Técnico');
    fireEvent.click(addButton);

    expect(screen.getByText('Novo Técnico')).toBeInTheDocument();
  });

  it('should create new technician when form is submitted', async () => {
    renderComponent();

    const addButton = screen.getByText('Adicionar Técnico');
    fireEvent.click(addButton);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Telefone');

    fireEvent.change(nameInput, { target: { value: 'New Technician' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('New Technician')).toBeInTheDocument();
    });
  });
}); 