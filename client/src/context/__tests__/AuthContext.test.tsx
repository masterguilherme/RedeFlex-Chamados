import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { TestUser, TestAuthResponse } from '../../types/test';

const mockUser: TestUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
};

const mockAuthResponse: TestAuthResponse = {
  token: 'fake-jwt-token',
  user: mockUser,
};

const TestComponent = () => {
  const { user, login, logout, register, isAuthenticated } = useAuth();

  return (
    <div>
      {user && (
        <>
          <div data-testid="user-name">{user.name}</div>
          <div data-testid="user-email">{user.email}</div>
          <div data-testid="user-role">{user.role}</div>
        </>
      )}
      <button onClick={() => login({ email: 'test@example.com', password: 'password123' })}>
        Login
      </button>
      <button onClick={() => register({ name: 'New User', email: 'new@example.com', password: 'password123' })}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
      <div data-testid="is-authenticated">{isAuthenticated ? 'true' : 'false'}</div>
    </div>
  );
};

const renderComponent = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    renderComponent();

    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-role')).not.toBeInTheDocument();
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('should handle successful login', async () => {
    renderComponent();

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent(mockUser.name);
      expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
      expect(screen.getByTestId('user-role')).toHaveTextContent(mockUser.role);
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      expect(localStorage.getItem('token')).toBe(mockAuthResponse.token);
    });
  });

  it('should handle successful registration', async () => {
    renderComponent();

    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    });
  });

  it('should handle logout', async () => {
    renderComponent();

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-role')).not.toBeInTheDocument();
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle login error', async () => {
    renderComponent();

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('should handle registration error', async () => {
    renderComponent();

    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('should restore user session from localStorage', () => {
    localStorage.setItem('token', mockAuthResponse.token);
    localStorage.setItem('user', JSON.stringify(mockUser));

    renderComponent();

    expect(screen.getByTestId('user-name')).toHaveTextContent(mockUser.name);
    expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
    expect(screen.getByTestId('user-role')).toHaveTextContent(mockUser.role);
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });
}); 