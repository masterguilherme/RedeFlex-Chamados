import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SolicitationForm } from '../SolicitationForm';
import { SolicitationProvider } from '../../../context/SolicitationContext';
import { AuthProvider } from '../../../context/AuthContext';
import { TestSolicitation } from '../../../types/test';

const mockSolicitation: TestSolicitation = {
  id: 1,
  title: 'Test Solicitation',
  description: 'Test Description',
  status: 'pending',
  technicianId: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const renderComponent = (initialValues?: TestSolicitation) => {
  return render(
    <AuthProvider>
      <SolicitationProvider>
        <MemoryRouter>
          <SolicitationForm initialValues={initialValues} onSubmit={jest.fn()} onCancel={jest.fn()} />
        </MemoryRouter>
      </SolicitationProvider>
    </AuthProvider>
  );
};

describe('SolicitationForm', () => {
  it('should render empty form', () => {
    renderComponent();

    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should render form with initial values', () => {
    renderComponent(mockSolicitation);

    expect(screen.getByLabelText('Título')).toHaveValue(mockSolicitation.title);
    expect(screen.getByLabelText('Descrição')).toHaveValue(mockSolicitation.description);
  });

  it('should validate required fields', async () => {
    renderComponent();

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Título é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with form values', async () => {
    const onSubmit = jest.fn();
    render(
      <AuthProvider>
        <SolicitationProvider>
          <MemoryRouter>
            <SolicitationForm onSubmit={onSubmit} onCancel={jest.fn()} />
          </MemoryRouter>
        </SolicitationProvider>
      </AuthProvider>
    );

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Title',
        description: 'New Description',
      });
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(
      <AuthProvider>
        <SolicitationProvider>
          <MemoryRouter>
            <SolicitationForm onSubmit={jest.fn()} onCancel={onCancel} />
          </MemoryRouter>
        </SolicitationProvider>
      </AuthProvider>
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
}); 