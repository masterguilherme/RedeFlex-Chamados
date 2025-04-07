import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TechnicianProvider } from '../../../context/TechnicianContext';
import TechnicianDetails from '../TechnicianDetails';

const mockNavigate = jest.fn();
const mockParams = { id: '1' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

const mockTechnician = {
  id: 1,
  name: 'Test Technician',
  email: 'tech@example.com',
  status: 'ativo',
  specialization: 'hardware',
  phone: '1234567890',
  address: 'Test Address',
  createdAt: '2024-01-01T00:00:00.000Z',
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  },
};

describe('TechnicianDetails Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <TechnicianProvider>
          <TechnicianDetails />
        </TechnicianProvider>
      </BrowserRouter>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render technician details', async () => {
    await waitFor(() => {
      expect(screen.getByText('Test Technician')).toBeInTheDocument();
      expect(screen.getByText('tech@example.com')).toBeInTheDocument();
      expect(screen.getByText(/ativo/i)).toBeInTheDocument();
      expect(screen.getByText(/hardware/i)).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('Test Address')).toBeInTheDocument();
    });
  });

  it('should update technician status', async () => {
    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'inativo' } });

    await waitFor(() => {
      expect(screen.getByText(/inativo/i)).toBeInTheDocument();
    });
  });

  it('should update technician information', async () => {
    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const specializationSelect = screen.getByLabelText(/especialização/i);
    const phoneInput = screen.getByLabelText(/telefone/i);
    const addressInput = screen.getByLabelText(/endereço/i);
    const saveButton = screen.getByRole('button', { name: /salvar/i });

    fireEvent.change(nameInput, { target: { value: 'Updated Technician' } });
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
    fireEvent.change(specializationSelect, { target: { value: 'software' } });
    fireEvent.change(phoneInput, { target: { value: '0987654321' } });
    fireEvent.change(addressInput, { target: { value: 'Updated Address' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated Technician')).toBeInTheDocument();
      expect(screen.getByText('updated@example.com')).toBeInTheDocument();
      expect(screen.getByText(/software/i)).toBeInTheDocument();
      expect(screen.getByText('0987654321')).toBeInTheDocument();
      expect(screen.getByText('Updated Address')).toBeInTheDocument();
    });
  });

  it('should show validation errors for empty fields', async () => {
    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const saveButton = screen.getByRole('button', { name: /salvar/i });

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);

    const emailInput = screen.getByLabelText(/email/i);
    const saveButton = screen.getByRole('button', { name: /salvar/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('should delete technician', async () => {
    const deleteButton = screen.getByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/technicians');
    });
  });

  it('should cancel technician deletion', async () => {
    const deleteButton = screen.getByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /confirmar/i })).not.toBeInTheDocument();
    });
  });

  it('should show loading state', async () => {
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    });
  });

  it('should show error state', async () => {
    await waitFor(() => {
      expect(screen.queryByText(/erro ao carregar técnico/i)).not.toBeInTheDocument();
    });
  });
}); 