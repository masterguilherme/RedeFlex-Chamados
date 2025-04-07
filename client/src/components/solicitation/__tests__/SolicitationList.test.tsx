import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SolicitationList } from '../SolicitationList';
import { SolicitationProvider } from '../../../context/SolicitationContext';
import { AuthProvider } from '../../../context/AuthContext';
import { TestSolicitation } from '../../../types/test';

const mockSolicitations: TestSolicitation[] = [
  {
    id: 1,
    title: 'Test Solicitation 1',
    description: 'Test Description 1',
    status: 'pending',
    technicianId: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Test Solicitation 2',
    description: 'Test Description 2',
    status: 'in_progress',
    technicianId: 2,
    createdAt: '2024-01-02T00:00:00.000Z',
  },
];

const renderComponent = () => {
  return render(
    <AuthProvider>
      <SolicitationProvider>
        <MemoryRouter>
          <SolicitationList />
        </MemoryRouter>
      </SolicitationProvider>
    </AuthProvider>
  );
};

describe('SolicitationList', () => {
  it('should render solicitation list', async () => {
    renderComponent();

    await waitFor(() => {
      mockSolicitations.forEach((solicitation) => {
        expect(screen.getByText(solicitation.title)).toBeInTheDocument();
        expect(screen.getByText(solicitation.description)).toBeInTheDocument();
        expect(screen.getByText(solicitation.status)).toBeInTheDocument();
      });
    });
  });

  it('should filter solicitations by title', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Buscar solicitação...');
    fireEvent.change(searchInput, { target: { value: 'Test Solicitation 1' } });

    await waitFor(() => {
      expect(screen.getByText('Test Solicitation 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Solicitation 2')).not.toBeInTheDocument();
    });
  });

  it('should filter solicitations by status', async () => {
    renderComponent();

    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(screen.getByText('Test Solicitation 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Solicitation 2')).not.toBeInTheDocument();
    });
  });

  it('should navigate to solicitation details when row is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      const solicitationRow = screen.getByText('Test Solicitation 1').closest('tr');
      fireEvent.click(solicitationRow!);
      expect(window.location.pathname).toBe('/solicitations/1');
    });
  });

  it('should open create solicitation dialog when add button is clicked', async () => {
    renderComponent();

    const addButton = screen.getByText('Adicionar Solicitação');
    fireEvent.click(addButton);

    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
  });

  it('should create new solicitation when form is submitted', async () => {
    renderComponent();

    const addButton = screen.getByText('Adicionar Solicitação');
    fireEvent.click(addButton);

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    fireEvent.change(titleInput, { target: { value: 'New Solicitation' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('New Solicitation')).toBeInTheDocument();
    });
  });
}); 