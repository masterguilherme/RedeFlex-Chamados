import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TechnicianForm } from '../TechnicianForm';
import { TechnicianProvider } from '../../../context/TechnicianContext';
import { AuthProvider } from '../../../context/AuthContext';
import { TestTechnician } from '../../../types/test';

const mockTechnician: TestTechnician = {
  id: 1,
  name: 'Test Technician',
  email: 'tech@example.com',
  role: 'technician',
  specialties: ['Web Development'],
  rating: 4.5,
  phone: '1234567890',
  address: 'Test Address',
  specialization: 'hardware',
  status: 'active',
};

const renderComponent = (initialValues?: TestTechnician) => {
  return render(
    <AuthProvider>
      <TechnicianProvider>
        <MemoryRouter>
          <TechnicianForm initialValues={initialValues} onSubmit={jest.fn()} onCancel={jest.fn()} />
        </MemoryRouter>
      </TechnicianProvider>
    </AuthProvider>
  );
};

describe('TechnicianForm', () => {
  it('deve renderizar formulário vazio', () => {
    renderComponent();

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument();
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument();
    expect(screen.getByLabelText('Especialização')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('deve renderizar formulário com valores iniciais', () => {
    renderComponent(mockTechnician);

    expect(screen.getByLabelText('Nome')).toHaveValue(mockTechnician.name);
    expect(screen.getByLabelText('Email')).toHaveValue(mockTechnician.email);
    expect(screen.getByLabelText('Telefone')).toHaveValue(mockTechnician.phone);
    expect(screen.getByLabelText('Endereço')).toHaveValue(mockTechnician.address);
    expect(screen.getByLabelText('Especialização')).toHaveValue(mockTechnician.specialization);
  });

  it('deve validar campos obrigatórios', async () => {
    renderComponent();

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Telefone é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Especialização é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve validar formato de email', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  it('deve chamar onSubmit com valores do formulário', async () => {
    const onSubmit = jest.fn();
    render(
      <AuthProvider>
        <TechnicianProvider>
          <MemoryRouter>
            <TechnicianForm onSubmit={onSubmit} onCancel={jest.fn()} />
          </MemoryRouter>
        </TechnicianProvider>
      </AuthProvider>
    );

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Telefone');
    const addressInput = screen.getByLabelText('Endereço');
    const specializationSelect = screen.getByLabelText('Especialização');

    fireEvent.change(nameInput, { target: { value: 'New Technician' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(addressInput, { target: { value: 'Test Address' } });
    fireEvent.change(specializationSelect, { target: { value: 'hardware' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'New Technician',
        email: 'new@example.com',
        phone: '1234567890',
        address: 'Test Address',
        specialization: 'hardware',
      });
    });
  });

  it('deve chamar onCancel quando botão cancelar é clicado', () => {
    const onCancel = jest.fn();
    render(
      <AuthProvider>
        <TechnicianProvider>
          <MemoryRouter>
            <TechnicianForm onSubmit={jest.fn()} onCancel={onCancel} />
          </MemoryRouter>
        </TechnicianProvider>
      </AuthProvider>
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('deve validar formato de telefone', async () => {
    renderComponent();

    const phoneInput = screen.getByLabelText('Telefone');
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Telefone inválido')).toBeInTheDocument();
    });
  });

  it('deve permitir edição de todos os campos', () => {
    renderComponent(mockTechnician);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Telefone');
    const addressInput = screen.getByLabelText('Endereço');
    const specializationSelect = screen.getByLabelText('Especialização');

    expect(nameInput).not.toBeDisabled();
    expect(emailInput).not.toBeDisabled();
    expect(phoneInput).not.toBeDisabled();
    expect(addressInput).not.toBeDisabled();
    expect(specializationSelect).not.toBeDisabled();
  });

  it('deve limpar campos após submissão bem-sucedida', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <AuthProvider>
        <TechnicianProvider>
          <MemoryRouter>
            <TechnicianForm onSubmit={onSubmit} onCancel={jest.fn()} />
          </MemoryRouter>
        </TechnicianProvider>
      </AuthProvider>
    );

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Telefone');

    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(phoneInput).toHaveValue('');
    });
  });
}); 