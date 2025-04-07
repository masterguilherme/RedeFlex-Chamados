import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SolicitationDetails } from './SolicitationDetails';
import { SolicitationContext } from '../../context/SolicitationContext';
import { TestSolicitation } from '../../types/test';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SolicitationDetails', () => {
  const mockSolicitation: TestSolicitation = {
    id: 1,
    title: 'Test Solicitation',
    description: 'Test Description',
    status: 'pending',
    userId: 1,
    technicianId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockContextValue = {
    solicitations: [],
    getAll: jest.fn(),
    getById: jest.fn().mockResolvedValue(mockSolicitation),
    create: jest.fn(),
    update: jest.fn().mockResolvedValue(mockSolicitation),
    updateStatus: jest.fn().mockResolvedValue(mockSolicitation),
    remove: jest.fn().mockResolvedValue(undefined),
    error: null,
    loading: false,
  };

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/solicitations/1']}>
        <SolicitationContext.Provider value={mockContextValue}>
          <Routes>
            <Route path="/solicitations/:id" element={<SolicitationDetails />} />
          </Routes>
        </SolicitationContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render solicitation details', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Solicitation')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  it('should handle status change', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText('Status'));
    fireEvent.click(screen.getByText('Em Andamento'));

    await waitFor(() => {
      expect(mockContextValue.updateStatus).toHaveBeenCalledWith(1, 'in_progress');
    });
  });

  it('should handle edit mode', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar'));

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    expect(titleInput).not.toBeDisabled();
    expect(descriptionInput).not.toBeDisabled();

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(mockContextValue.update).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'pending',
      });
    });
  });

  it('should handle delete', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Excluir'));
    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() => {
      expect(mockContextValue.remove).toHaveBeenCalledWith(1);
      expect(mockNavigate).toHaveBeenCalledWith('/solicitations');
    });
  });

  it('should show loading state', () => {
    render(
      <MemoryRouter initialEntries={['/solicitations/1']}>
        <SolicitationContext.Provider value={{ ...mockContextValue, loading: true }}>
          <Routes>
            <Route path="/solicitations/:id" element={<SolicitationDetails />} />
          </Routes>
        </SolicitationContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Erro ao carregar solicitação';
    render(
      <MemoryRouter initialEntries={['/solicitations/1']}>
        <SolicitationContext.Provider value={{ ...mockContextValue, error: errorMessage }}>
          <Routes>
            <Route path="/solicitations/:id" element={<SolicitationDetails />} />
          </Routes>
        </SolicitationContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
}); 