import { SolicitationStatus } from './solicitation';
import { TECHNICIAN_STATUS } from '../utils/constants';

export type TechnicianStatus = typeof TECHNICIAN_STATUS[keyof typeof TECHNICIAN_STATUS];

export interface Technician {
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

export interface TechnicianWithDetails extends Technician {
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

export interface CreateTechnicianDTO {
  name: string;
  email: string;
  specialty: string;
  phone?: string;
  address?: string;
  userId: number;
}

export interface UpdateTechnicianDTO {
  name?: string;
  email?: string;
  specialty?: string;
  phone?: string;
  address?: string;
  status?: TechnicianStatus;
} 