// Função para formatar data para o formato brasileiro
export const formatDateBR = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

// Função para formatar data e hora para o formato brasileiro
export const formatDateTimeBR = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
};

// Função para formatar data para o formato ISO
export const formatDateISO = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Função para formatar data e hora para o formato ISO
export const formatDateTimeISO = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString();
};

// Função para adicionar dias a uma data
export const addDays = (date: Date | string, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Função para adicionar meses a uma data
export const addMonths = (date: Date | string, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

// Função para adicionar anos a uma data
export const addYears = (date: Date | string, years: number): Date => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

// Função para calcular a diferença em dias entre duas datas
export const diffDays = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Função para calcular a diferença em meses entre duas datas
export const diffMonths = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
};

// Função para calcular a diferença em anos entre duas datas
export const diffYears = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d2.getFullYear() - d1.getFullYear();
};

// Função para verificar se uma data é hoje
export const isToday = (date: Date | string): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// Função para verificar se uma data é ontem
export const isYesterday = (date: Date | string): boolean => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

// Função para verificar se uma data é amanhã
export const isTomorrow = (date: Date | string): boolean => {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
};

// Função para verificar se uma data é no passado
export const isPast = (date: Date | string): boolean => {
  const d = new Date(date);
  return d < new Date();
};

// Função para verificar se uma data é no futuro
export const isFuture = (date: Date | string): boolean => {
  const d = new Date(date);
  return d > new Date();
};

// Função para obter o primeiro dia do mês
export const getFirstDayOfMonth = (date: Date | string): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

// Função para obter o último dia do mês
export const getLastDayOfMonth = (date: Date | string): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

// Função para obter o primeiro dia do ano
export const getFirstDayOfYear = (date: Date | string): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), 0, 1);
};

// Função para obter o último dia do ano
export const getLastDayOfYear = (date: Date | string): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), 11, 31);
}; 