import { ERROR_MESSAGES } from './constants';

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (!emailRegex.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'A senha deve conter pelo menos uma letra maiúscula';
  if (!/[a-z]/.test(password)) return 'A senha deve conter pelo menos uma letra minúscula';
  if (!/[0-9]/.test(password)) return 'A senha deve conter pelo menos um número';
  return null;
};

export const validateCNPJ = (cnpj: string): string | null => {
  if (!cnpj) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) return ERROR_MESSAGES.INVALID_CNPJ;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return ERROR_MESSAGES.INVALID_CNPJ;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (digito !== parseInt(cnpj.charAt(12))) return ERROR_MESSAGES.INVALID_CNPJ;
  
  // Validação do segundo dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (digito !== parseInt(cnpj.charAt(13))) return ERROR_MESSAGES.INVALID_CNPJ;
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  // Remove caracteres não numéricos
  phone = phone.replace(/[^\d]/g, '');
  
  // Verifica se o número tem entre 10 e 11 dígitos (com ou sem DDD)
  if (phone.length < 10 || phone.length > 11) {
    return 'O telefone deve ter entre 10 e 11 dígitos';
  }
  
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value && value !== 0) return `${fieldName} é obrigatório`;
  if (typeof value === 'string' && !value.trim()) return `${fieldName} é obrigatório`;
  return null;
};

export const validateFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
): string | null => {
  if (!file) return ERROR_MESSAGES.REQUIRED_FIELD;
  
  if (file.size > maxSize) {
    return `O arquivo deve ter no máximo ${maxSize / (1024 * 1024)}MB`;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.join(', ')}`;
  }
  
  return null;
}; 