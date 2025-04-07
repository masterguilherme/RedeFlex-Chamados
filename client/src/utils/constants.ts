import { SolicitationPriority, ServiceCategory } from '../types/solicitation';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  TECHNICIANS: '/technicians',
  SOLICITATIONS: '/solicitations',
  COMMENTS: '/comments',
  ATTACHMENTS: '/attachments',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ACCESS_DENIED: '/acesso-negado',
  ADMIN: '/admin',
  PROFILE: '/perfil',
  SOLICITATIONS: '/solicitacoes',
  NEW_SOLICITATION: '/solicitacoes/nova',
  SOLICITATION_DETAILS: '/solicitacoes/:id',
  TECHNICIANS: '/tecnicos',
  TECHNICIAN_DETAILS: '/tecnicos/:id',
};

export const USER_TYPES = {
  ADMIN: 'admin',
  SOLICITANTE: 'solicitante',
  PRESTADOR: 'prestador',
} as const;

export const SOLICITATION_STATUS = {
  PENDENTE: 'PENDENTE',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDA: 'CONCLUIDA',
  CANCELADA: 'CANCELADA',
} as const;

export const PRIORITY_LEVELS: Record<string, SolicitationPriority> = {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  URGENTE: 'URGENTE',
} as const;

export const SERVICE_CATEGORIES: Record<string, ServiceCategory> = {
  INFORMATICA: 'INFORMATICA',
  ELETRICA: 'ELETRICA',
  HIDRAULICA: 'HIDRAULICA',
  MARCENARIA: 'MARCENARIA',
  PINTURA: 'PINTURA',
  OUTROS: 'OUTROS',
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número',
  INVALID_CNPJ: 'CNPJ inválido',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  SERVER_ERROR: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não está autorizado a acessar este recurso.',
  NOT_FOUND: 'Recurso não encontrado.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Cadastro realizado com sucesso!',
  LOGOUT: 'Logout realizado com sucesso!',
  UPDATE: 'Atualização realizada com sucesso!',
  DELETE: 'Exclusão realizada com sucesso!',
  CREATE: 'Criação realizada com sucesso!',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
} as const;

export const CACHE = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  EXPIRATION_TIME: 24 * 60 * 60 * 1000, // 24 horas
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  SOLICITANTE: 'solicitante',
  PRESTADOR: 'prestador'
};

export const SOLICITATION_STATUS_LABELS = {
  [SOLICITATION_STATUS.PENDENTE]: 'Pendente',
  [SOLICITATION_STATUS.EM_ANDAMENTO]: 'Em Andamento',
  [SOLICITATION_STATUS.CONCLUIDA]: 'Concluída',
  [SOLICITATION_STATUS.CANCELADA]: 'Cancelada',
} as const;

export const TECHNICIAN_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  UNAVAILABLE: 'unavailable',
} as const;

export const TECHNICIAN_STATUS_LABELS = {
  [TECHNICIAN_STATUS.AVAILABLE]: 'Disponível',
  [TECHNICIAN_STATUS.BUSY]: 'Ocupado',
  [TECHNICIAN_STATUS.UNAVAILABLE]: 'Indisponível',
} as const;

export const PRIORITY_LABELS = {
  [PRIORITY_LEVELS.BAIXA]: 'Baixa',
  [PRIORITY_LEVELS.MEDIA]: 'Média',
  [PRIORITY_LEVELS.ALTA]: 'Alta',
  [PRIORITY_LEVELS.URGENTE]: 'Urgente',
} as const;

export const CATEGORIES = {
  ELECTRICAL: 'electrical',
  PLUMBING: 'plumbing',
  PAINTING: 'painting',
  CARPENTRY: 'carpentry',
  OTHER: 'other',
} as const;

export const CATEGORY_LABELS = {
  [CATEGORIES.ELECTRICAL]: 'Elétrica',
  [CATEGORIES.PLUMBING]: 'Hidráulica',
  [CATEGORIES.PAINTING]: 'Pintura',
  [CATEGORIES.CARPENTRY]: 'Marcenaria',
  [CATEGORIES.OTHER]: 'Outro',
} as const;

export const SPECIALTIES = [
  'IT',
  'Network',
  'Security',
  'Database',
  'Cloud',
  'DevOps',
  'Mobile',
  'Web',
  'Desktop',
  'Other'
]; 