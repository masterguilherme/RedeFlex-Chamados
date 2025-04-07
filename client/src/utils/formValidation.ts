import { ERROR_MESSAGES } from './constants';

// Interface para erros de validação
export interface ValidationError {
  field: string;
  message: string;
}

// Interface para regras de validação
export interface ValidationRule {
  field: string;
  rules: ((value: any) => string | null)[];
}

// Função para validar um campo com múltiplas regras
export const validateField = (value: any, rules: ((value: any) => string | null)[]): string | null => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

// Função para validar um formulário completo
export const validateForm = (data: any, rules: ValidationRule[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    const error = validateField(data[rule.field], rule.rules);
    if (error) {
      errors.push({
        field: rule.field,
        message: error,
      });
    }
  }

  return errors;
};

// Regras de validação comuns
export const rules = {
  required: (fieldName: string) => (value: any): string | null => {
    if (!value && value !== 0) return `${fieldName} é obrigatório`;
    if (typeof value === 'string' && !value.trim()) return `${fieldName} é obrigatório`;
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return ERROR_MESSAGES.INVALID_EMAIL;
    return null;
  },

  minLength: (min: number, fieldName: string) => (value: string): string | null => {
    if (!value) return null;
    if (value.length < min) return `${fieldName} deve ter pelo menos ${min} caracteres`;
    return null;
  },

  maxLength: (max: number, fieldName: string) => (value: string): string | null => {
    if (!value) return null;
    if (value.length > max) return `${fieldName} deve ter no máximo ${max} caracteres`;
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return null;
    if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
    if (!/[A-Z]/.test(value)) return 'A senha deve conter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(value)) return 'A senha deve conter pelo menos uma letra minúscula';
    if (!/[0-9]/.test(value)) return 'A senha deve conter pelo menos um número';
    return null;
  },

  confirmPassword: (password: string) => (value: string): string | null => {
    if (!value) return null;
    if (value !== password) return ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
    return null;
  },

  cnpj: (value: string): string | null => {
    if (!value) return null;
    const cnpj = value.replace(/\D/g, '');
    if (cnpj.length !== 14) return ERROR_MESSAGES.INVALID_CNPJ;
    if (/^(\d)\1{13}$/.test(cnpj)) return ERROR_MESSAGES.INVALID_CNPJ;
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    const phone = value.replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 11) return 'Telefone inválido';
    return null;
  },

  number: (fieldName: string) => (value: any): string | null => {
    if (!value) return null;
    if (isNaN(Number(value))) return `${fieldName} deve ser um número`;
    return null;
  },

  min: (min: number, fieldName: string) => (value: number): string | null => {
    if (!value) return null;
    if (value < min) return `${fieldName} deve ser maior ou igual a ${min}`;
    return null;
  },

  max: (max: number, fieldName: string) => (value: number): string | null => {
    if (!value) return null;
    if (value > max) return `${fieldName} deve ser menor ou igual a ${max}`;
    return null;
  },

  url: (value: string): string | null => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'URL inválida';
    }
  },

  date: (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Data inválida';
    return null;
  },

  futureDate: (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Data inválida';
    if (date <= new Date()) return 'A data deve ser futura';
    return null;
  },

  pastDate: (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Data inválida';
    if (date >= new Date()) return 'A data deve ser passada';
    return null;
  },
}; 