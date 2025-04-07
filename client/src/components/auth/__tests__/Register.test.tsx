import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '../Register';
import { AuthProvider } from '../../../context/AuthContext';
import { TestUser } from '../../../types/test';

const mockUser: TestUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
};

const renderComponent = () => {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('Register', () => {
  it('should render register form', () => {
    renderComponent();

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    renderComponent();

    const registerButton = screen.getByText('Cadastrar');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Confirmação de senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const registerButton = screen.getByText('Cadastrar');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

    const registerButton = screen.getByText('Cadastrar');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('As senhas não conferem')).toBeInTheDocument();
    });
  });

  it('should handle successful registration', async () => {
    renderComponent();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');

    fireEvent.change(nameInput, { target: { value: mockUser.name } });
    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const registerButton = screen.getByText('Cadastrar');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('should handle registration error', async () => {
    renderComponent();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');

    fireEvent.change(nameInput, { target: { value: 'Existing User' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    const registerButton = screen.getByText('Cadastrar');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Email já cadastrado')).toBeInTheDocument();
    });
  });

  it('should navigate to login page', () => {
    renderComponent();

    const loginLink = screen.getByText('Já tem uma conta? Faça login');
    fireEvent.click(loginLink);

    expect(window.location.pathname).toBe('/login');
  });

  it('should toggle password visibility', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha') as HTMLInputElement;
    const toggleButtons = screen.getAllByLabelText('toggle password visibility');

    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    fireEvent.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('password');

    fireEvent.click(toggleButtons[1]);
    expect(passwordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('text');

    fireEvent.click(toggleButtons[0]);
    fireEvent.click(toggleButtons[1]);
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');
  });
}); 