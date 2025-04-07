import { CommentWithUser } from './comment';
import { Attachment } from './attachment';
import { PRIORITY_LEVELS, CATEGORIES } from '../utils/constants';

export type SolicitationStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
export type SolicitationPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type ServiceCategory = 'INFORMATICA' | 'ELETRICA' | 'HIDRAULICA' | 'MARCENARIA' | 'PINTURA' | 'OUTROS';

export interface Solicitation {
  id: number;
  title: string;
  description: string;
  status: SolicitationStatus;
  priority: SolicitationPriority;
  category: ServiceCategory;
  userId: number;
  technicianId?: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface SolicitationWithDetails extends Solicitation {
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

export interface SolicitationCreate {
  title: string;
  description: string;
  priority: SolicitationPriority;
  category: ServiceCategory;
  companyId: number;
}

export interface SolicitationUpdate {
  title?: string;
  description?: string;
  status?: SolicitationStatus;
  priority?: SolicitationPriority;
  category?: ServiceCategory;
  technicianId?: number;
}

export interface SolicitationComment {
  id: number;
  solicitationId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolicitationCommentCreate {
  content: string;
  solicitationId: number;
} 