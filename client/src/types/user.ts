export type UserRole = 'admin' | 'solicitante' | 'prestador';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  company?: string;
  active?: boolean;
}

export interface UserResponse {
  user: User;
  token: string;
} 