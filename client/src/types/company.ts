export interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyCreate {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

export interface CompanyUpdate {
  name?: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  active?: boolean;
} 