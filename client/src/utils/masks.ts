// Função para aplicar máscara de telefone
export const phoneMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
};

// Função para aplicar máscara de CNPJ
export const cnpjMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Função para aplicar máscara de CPF
export const cpfMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para aplicar máscara de CEP
export const cepMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  return value.replace(/(\d{5})(\d{3})/, '$1-$2');
};

// Função para aplicar máscara de data
export const dateMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  return value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
};

// Função para aplicar máscara de hora
export const timeMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  return value.replace(/(\d{2})(\d{2})/, '$1:$2');
};

// Função para aplicar máscara de moeda
export const currencyMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Converte para número e formata
  const number = Number(value) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};

// Função para remover máscara
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Função para aplicar máscara de cartão de crédito
export const creditCardMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  return value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

// Função para aplicar máscara de cartão de crédito com data e CVV
export const creditCardFullMask = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');
  
  // Aplica a máscara
  return value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{2})(\d{3})/, '$1 $2 $3 $4 $5/$6');
}; 