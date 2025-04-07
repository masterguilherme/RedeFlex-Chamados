import { SolicitationStatus } from './solicitation';
import { UserRole } from './user';

export interface TestUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface TestTechnician {
  id: number;
  name: string;
  email: string;
  specialty: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestSolicitation {
  id: number;
  title: string;
  description: string;
  status: SolicitationStatus;
  userId: number;
  technicianId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestAuthResponse {
  user: TestUser;
  token: string;
}

export interface TestApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 