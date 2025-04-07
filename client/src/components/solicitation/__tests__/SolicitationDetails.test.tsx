import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SolicitationDetails } from '../SolicitationDetails';
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

const renderComponent = () => {
  return render(
    <AuthProvider>
      <SolicitationProvider>
        <MemoryRouter initialEntries={[`/solicitations/${mockSolicitation.id}`]}>
          <Routes>
            <Route path="/solicitations/:id" element={<SolicitationDetails />} />
          </Routes>
        </MemoryRouter>
      </SolicitationProvider>
    </AuthProvider>
  );
};

describe('SolicitationDetails', () => {
  it('should render solicitation details', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(mockSolicitation.title)).toBeInTheDocument();
      expect(screen.getByText(mockSolicitation.description)).toBeInTheDocument();
      expect(screen.getByText(mockSolicitation.status)).toBeInTheDocument();
    });
  });

  it('should enable edit mode when edit button is clicked', async () => {
    renderComponent();

    const editButton = await screen.findByText('Editar');
    fireEvent.click(editButton);

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it('should update solicitation when form is submitted', async () => {
    renderComponent();

    const editButton = await screen.findByText('Editar');
    fireEvent.click(editButton);

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.getByText('Updated Description')).toBeInTheDocument();
    });
  });

  it('should update status when status is changed', async () => {
    renderComponent();

    const statusSelect = await screen.findByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });

    await waitFor(() => {
      expect(screen.getByText('in_progress')).toBeInTheDocument();
    });
  });

  it('should delete solicitation when delete button is clicked', async () => {
    const { container } = renderComponent();

    const deleteButton = await screen.findByText('Excluir');
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
}); 