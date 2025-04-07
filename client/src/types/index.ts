export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Solicitation {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  technicianId?: number;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Technician {
  id: number;
  name: string;
  email: string;
  specialties: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  solicitationId: number;
  user?: User;
}

export interface Attachment {
  id: number;
  filename: string;
  url: string;
  createdAt: string;
  solicitationId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
} 