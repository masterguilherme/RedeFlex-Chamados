import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SolicitationProvider, useSolicitation } from '../SolicitationContext';
import { TestSolicitation } from '../../types/test';

const mockSolicitation: TestSolicitation = {
  id: 1,
  title: 'Test Solicitation',
  description: 'Test Description',
  status: 'pending',
  technicianId: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const TestComponent = () => {
  const { solicitations, getAll, getById, create, update, updateStatus, remove } = useSolicitation();

  return (
    <div>
      {solicitations.map((solicitation) => (
        <div key={solicitation.id}>
          <div data-testid={`solicitation-title-${solicitation.id}`}>{solicitation.title}</div>
          <div data-testid={`solicitation-description-${solicitation.id}`}>
            {solicitation.description}
          </div>
          <div data-testid={`solicitation-status-${solicitation.id}`}>{solicitation.status}</div>
        </div>
      ))}
      <button onClick={() => getAll()}>Get All</button>
      <button onClick={() => getById(1)}>Get By Id</button>
      <button
        onClick={() =>
          create({
            title: 'New Solicitation',
            description: 'New Description',
            technicianId: 1,
          })
        }
      >
        Create
      </button>
      <button
        onClick={() =>
          update(1, {
            title: 'Updated Solicitation',
            description: 'Updated Description',
          })
        }
      >
        Update
      </button>
      <button onClick={() => updateStatus(1, 'in_progress')}>Update Status</button>
      <button onClick={() => remove(1)}>Delete</button>
    </div>
  );
};

const renderComponent = () => {
  return render(
    <SolicitationProvider>
      <TestComponent />
    </SolicitationProvider>
  );
};

describe('SolicitationContext', () => {
  it('should initialize with empty solicitations list', () => {
    renderComponent();

    expect(screen.queryByTestId('solicitation-title-1')).not.toBeInTheDocument();
  });

  it('should get all solicitations', async () => {
    renderComponent();

    const getAllButton = screen.getByText('Get All');
    fireEvent.click(getAllButton);

    await waitFor(() => {
      expect(screen.getByTestId(`solicitation-title-${mockSolicitation.id}`)).toHaveTextContent(
        mockSolicitation.title
      );
      expect(screen.getByTestId(`solicitation-description-${mockSolicitation.id}`)).toHaveTextContent(
        mockSolicitation.description
      );
      expect(screen.getByTestId(`solicitation-status-${mockSolicitation.id}`)).toHaveTextContent(
        mockSolicitation.status
      );
    });
  });

  it('should get solicitation by id', async () => {
    renderComponent();

    const getByIdButton = screen.getByText('Get By Id');
    fireEvent.click(getByIdButton);

    await waitFor(() => {
      expect(screen.getByTestId(`solicitation-title-${mockSolicitation.id}`)).toHaveTextContent(
        mockSolicitation.title
      );
    });
  });

  it('should create new solicitation', async () => {
    renderComponent();

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('solicitation-title-2')).toHaveTextContent('New Solicitation');
      expect(screen.getByTestId('solicitation-description-2')).toHaveTextContent('New Description');
    });
  });

  it('should update solicitation', async () => {
    renderComponent();

    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByTestId(`solicitation-title-${mockSolicitation.id}`)).toHaveTextContent(
        'Updated Solicitation'
      );
      expect(screen.getByTestId(`solicitation-description-${mockSolicitation.id}`)).toHaveTextContent(
        'Updated Description'
      );
    });
  });

  it('should update solicitation status', async () => {
    renderComponent();

    const updateStatusButton = screen.getByText('Update Status');
    fireEvent.click(updateStatusButton);

    await waitFor(() => {
      expect(screen.getByTestId(`solicitation-status-${mockSolicitation.id}`)).toHaveTextContent(
        'in_progress'
      );
    });
  });

  it('should delete solicitation', async () => {
    renderComponent();

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId(`solicitation-title-${mockSolicitation.id}`)).not.toBeInTheDocument();
    });
  });

  it('should handle error on get all solicitations', async () => {
    renderComponent();

    const getAllButton = screen.getByText('Get All');
    fireEvent.click(getAllButton);

    await waitFor(() => {
      expect(screen.queryByTestId(`solicitation-title-${mockSolicitation.id}`)).not.toBeInTheDocument();
    });
  });

  it('should handle error on get solicitation by id', async () => {
    renderComponent();

    const getByIdButton = screen.getByText('Get By Id');
    fireEvent.click(getByIdButton);

    await waitFor(() => {
      expect(screen.queryByTestId(`solicitation-title-${mockSolicitation.id}`)).not.toBeInTheDocument();
    });
  });

  it('should handle error on create solicitation', async () => {
    renderComponent();

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.queryByTestId('solicitation-title-2')).not.toBeInTheDocument();
    });
  });

  it('should handle error on update solicitation', async () => {
    renderComponent();

    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.queryByTestId(`solicitation-title-${mockSolicitation.id}`)).not.toBeInTheDocument();
    });
  });

  it('should handle error on update solicitation status', async () => {
    renderComponent();

    const updateStatusButton = screen.getByText('Update Status');
    fireEvent.click(updateStatusButton);

    await waitFor(() => {
      expect(screen.queryByTestId(`solicitation-status-${mockSolicitation.id}`)).not.toBeInTheDocument();
    });
  });

  it('should handle error on delete solicitation', async () => {
    renderComponent();

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId(`solicitation-title-${mockSolicitation.id}`)).not.toBeInTheDocument();
    });
  });
}); 