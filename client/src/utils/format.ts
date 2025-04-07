export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  phone = phone.replace(/\D/g, '');
  
  // Formata o número
  if (phone.length === 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  } else if (phone.length === 10) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }
  
  return phone;
};

export const formatCNPJ = (cnpj: string): string => {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  // Formata o CNPJ
  if (cnpj.length === 14) {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
  }
  
  return cnpj;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em Andamento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
  };
  
  return statusMap[status] || status;
};

export const formatPriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta',
    URGENTE: 'Urgente',
  };
  
  return priorityMap[priority] || priority;
};

export const formatCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    INFORMATICA: 'Informática',
    ELETRICA: 'Elétrica',
    HIDRAULICA: 'Hidráulica',
    MARCENARIA: 'Marcenaria',
    PINTURA: 'Pintura',
    OUTROS: 'Outros',
  };
  
  return categoryMap[category] || category;
}; 