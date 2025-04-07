import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SolicitationForm } from './SolicitationForm';
import { SolicitationContext } from '../../context/SolicitationContext';
import { TestSolicitation } from '../../types/test';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SolicitationForm', () => {
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
    getById: jest.fn(),
    create: jest.fn().mockResolvedValue(mockSolicitation),
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
          <SolicitationForm />
        </SolicitationContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    renderComponent();

    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Criar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    renderComponent();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    fireEvent.change(titleInput, { target: { value: 'New Solicitation' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

    fireEvent.click(screen.getByText('Criar'));

    await waitFor(() => {
      expect(mockContextValue.create).toHaveBeenCalledWith({
        title: 'New Solicitation',
        description: 'New Description',
        status: 'pending',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/solicitations/1');
    });
  });

  it('should handle navigation on cancel', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Cancelar'));

    expect(mockNavigate).toHaveBeenCalledWith('/solicitations');
  });

  it('should show error message when present', () => {
    const errorMessage = 'Erro ao criar solicitação';
    render(
      <MemoryRouter>
        <SolicitationContext.Provider value={{ ...mockContextValue, error: errorMessage }}>
          <SolicitationForm />
        </SolicitationContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('Criar'));

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    expect(titleInput).toBeRequired();
    expect(descriptionInput).toBeRequired();
    expect(mockContextValue.create).not.toHaveBeenCalled();
  });
}); 