// Tipos de usuário
export const USER_TYPES = {
  ADMIN: 'admin',
  SOLICITANTE: 'solicitante',
  PRESTADOR: 'prestador',
};

// Status das solicitações
export const SOLICITATION_STATUS = {
  PENDENTE: 'PENDENTE',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDA: 'CONCLUIDA',
  CANCELADA: 'CANCELADA',
};

// Prioridades das solicitações
export const SOLICITATION_PRIORITIES = {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  URGENTE: 'URGENTE',
};

// Categorias de serviços
export const SERVICE_CATEGORIES = {
  INFORMATICA: 'INFORMATICA',
  ELETRICA: 'ELETRICA',
  HIDRAULICA: 'HIDRAULICA',
  MARCENARIA: 'MARCENARIA',
  PINTURA: 'PINTURA',
  OUTROS: 'OUTROS',
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número',
  INVALID_CPF: 'CPF inválido',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  SERVER_ERROR: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não está autorizado a acessar este recurso.',
  NOT_FOUND: 'Recurso não encontrado.',
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Cadastro realizado com sucesso!',
  LOGOUT: 'Logout realizado com sucesso!',
  UPDATE: 'Atualização realizada com sucesso!',
  DELETE: 'Exclusão realizada com sucesso!',
  CREATE: 'Criação realizada com sucesso!',
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Configurações de upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Configurações de cache
export const CACHE = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  EXPIRATION_TIME: 24 * 60 * 60 * 1000, // 24 horas
};

// Configurações de tema
export const THEME = {
  PRIMARY_COLOR: '#1976d2',
  SECONDARY_COLOR: '#dc004e',
  BACKGROUND_COLOR: '#f5f5f5',
  TEXT_COLOR: '#333333',
  ERROR_COLOR: '#f44336',
  SUCCESS_COLOR: '#4caf50',
  WARNING_COLOR: '#ff9800',
  INFO_COLOR: '#2196f3',
};

// Configurações de roteamento
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

// Configurações de validação
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_COMMENT_LENGTH: 500,
}; 