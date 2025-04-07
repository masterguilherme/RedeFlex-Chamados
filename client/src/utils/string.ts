// Função para capitalizar a primeira letra de cada palavra
export const capitalize = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Função para remover acentos
export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// Função para remover caracteres especiais
export const removeSpecialChars = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9]/g, '');
};

// Função para remover espaços extras
export const removeExtraSpaces = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

// Função para truncar texto
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// Função para gerar slug
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Função para formatar número com separador de milhar
export const formatNumber = (num: number): string => {
  return num.toLocaleString('pt-BR');
};

// Função para formatar número com separador de milhar e decimais
export const formatNumberWithDecimals = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Função para formatar CPF
export const formatCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para formatar CNPJ
export const formatCNPJ = (cnpj: string): string => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Função para formatar telefone
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

// Função para formatar CEP
export const formatCEP = (cep: string): string => {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

// Função para formatar cartão de crédito
export const formatCreditCard = (card: string): string => {
  return card.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

// Função para formatar data
export const formatDate = (date: string): string => {
  return date.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
};

// Função para formatar hora
export const formatTime = (time: string): string => {
  return time.replace(/(\d{2})(\d{2})/, '$1:$2');
};

// Função para formatar data e hora
export const formatDateTime = (datetime: string): string => {
  return datetime.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})/, '$1/$2/$3 $4:$5');
};

// Função para formatar moeda
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Função para formatar porcentagem
export const formatPercentage = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Função para formatar tamanho de arquivo
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}; 