import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SolicitationList } from './SolicitationList';
import { SolicitationContext } from '../../context/SolicitationContext';
import { TestSolicitation } from '../../types/test';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SolicitationList', () => {
  const mockSolicitations: TestSolicitation[] = [
    {
      id: 1,
      title: 'Test Solicitation 1',
      description: 'Test Description 1',
      status: 'pending',
      userId: 1,
      technicianId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Test Solicitation 2',
      description: 'Test Description 2',
      status: 'in_progress',
      userId: 1,
      technicianId: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockContextValue = {
    solicitations: mockSolicitations,
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
    error: null,
    loading: false,
  };

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <SolicitationContext.Provider value={mockContextValue}>
          <SolicitationList />
        </SolicitationContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render solicitation list', () => {
    renderComponent();

    expect(screen.getByText('Solicitações')).toBeInTheDocument();
    expect(screen.getByText('Nova Solicitação')).toBeInTheDocument();
    expect(screen.getByText('Test Solicitation 1')).toBeInTheDocument();
    expect(screen.getByText('Test Solicitation 2')).toBeInTheDocument();
  });

  it('should handle search filter', () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Buscar por título ou descrição');
    fireEvent.change(searchInput, { target: { value: 'Solicitation 1' } });

    expect(screen.getByText('Test Solicitation 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Solicitation 2')).not.toBeInTheDocument();
  });

  it('should handle status filter', () => {
    renderComponent();

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);
    fireEvent.click(screen.getByText('Em Andamento'));

    expect(screen.queryByText('Test Solicitation 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Solicitation 2')).toBeInTheDocument();
  });

  it('should navigate to new solicitation page', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Nova Solicitação'));
    expect(mockNavigate).toHaveBeenCalledWith('/solicitations/new');
  });

  it('should navigate to solicitation details', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Test Solicitation 1'));
    expect(mockNavigate).toHaveBeenCalledWith('/solicitations/1');
  });

  it('should show loading state', () => {
    render(
      <MemoryRouter>
        <SolicitationContext.Provider value={{ ...mockContextValue, loading: true }}>
          <SolicitationList />
        </SolicitationContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Erro ao carregar solicitações';
    render(
      <MemoryRouter>
        <SolicitationContext.Provider value={{ ...mockContextValue, error: errorMessage }}>
          <SolicitationList />
        </SolicitationContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show empty state', () => {
    render(
      <MemoryRouter>
        <SolicitationContext.Provider value={{ ...mockContextValue, solicitations: [] }}>
          <SolicitationList />
        </SolicitationContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeInTheDocument();
  });

  it('should call getAll on mount', () => {
    renderComponent();
    expect(mockContextValue.getAll).toHaveBeenCalled();
  });
}); 