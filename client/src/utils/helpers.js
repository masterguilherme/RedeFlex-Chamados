// Formatação de data
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Formatação de CPF
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatação de telefone
export const formatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

// Formatação de valor monetário
export const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Validação de email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validação de CPF
export const validateCPF = (cpf) => {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;

  // Verifica CPFs com números iguais
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

// Validação de senha
export const validatePassword = (password) => {
  if (!password) return false;
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

// Tratamento de erros da API
export const handleApiError = (error) => {
  if (error.response) {
    // O servidor respondeu com um status de erro
    return error.response.data.message || 'Ocorreu um erro ao processar sua solicitação.';
  } else if (error.request) {
    // A requisição foi feita mas não houve resposta
    return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
  } else {
    // Algo aconteceu na configuração da requisição
    return 'Ocorreu um erro ao configurar a requisição.';
  }
};

// Função para debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Função para throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Função para capitalizar texto
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Função para truncar texto
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}; 