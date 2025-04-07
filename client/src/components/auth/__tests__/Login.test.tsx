import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../Login';
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
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('Login', () => {
  it('should render login form', () => {
    renderComponent();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    renderComponent();

    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');

    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  it('should handle login error', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
    });
  });

  it('should navigate to register page', () => {
    renderComponent();

    const registerLink = screen.getByText('Criar uma conta');
    fireEvent.click(registerLink);

    expect(window.location.pathname).toBe('/register');
  });

  it('should toggle password visibility', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    const toggleButton = screen.getByLabelText('toggle password visibility');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
}); 