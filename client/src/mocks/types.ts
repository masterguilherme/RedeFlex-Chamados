import { RestHandler, ResponseResolver as MSWResponseResolver, MockedRequest, DefaultBodyType, RestContext } from 'msw';
import { SolicitationStatus } from '../types/solicitation';
import { TechnicianStatus } from '../types/technician';
import { User, AuthResponse as UserAuthResponse } from '../types/user';
import { Attachment } from '../types/attachment';

export interface MockedRequestWithParams extends MockedRequest<DefaultBodyType> {
  params: {
    [key: string]: string;
  };
}

export type RequestHandler = RestHandler<MockedRequestWithParams>;

export type ResponseResolver = MSWResponseResolver<MockedRequestWithParams, RestContext>;

export type AuthResponse = UserAuthResponse;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RequestBody {
  [key: string]: unknown;
  status?: SolicitationStatus | TechnicianStatus;
}

export interface CommentRequestBody extends RequestBody {
  content: string;
  solicitationId: number;
  userId: number;
}

export interface AttachmentRequestBody extends RequestBody {
  file: File;
  solicitationId: number;
  userId: number;
}

export interface SolicitationWithDetails {
  id: number;
  title: string;
  description: string;
  status: SolicitationStatus;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  technicianId?: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  technician?: {
    id: number;
    name: string;
    email: string;
    specialty: string;
  };
  comments: CommentWithUser[];
  attachments: Attachment[];
}

export interface TechnicianWithDetails {
  id: number;
  name: string;
  email: string;
  specialty: string;
  status: TechnicianStatus;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  solicitations: {
    id: number;
    title: string;
    status: SolicitationStatus;
  }[];
}

export interface CommentWithUser {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  solicitationId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AttachmentWithDetails {
  id: number;
  filename: string;
  url: string;
  createdAt: string;
  solicitationId: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TestUser extends User {
  password?: string;
}

export interface TestTechnician {
  id: number;
  name: string;
  email: string;
  specialty: string;
  status: TechnicianStatus;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface TestSolicitation {
  id: number;
  title: string;
  description: string;
  status: SolicitationStatus;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  technicianId?: number;
} 