// Função para ordenar array por propriedade
export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Função para filtrar array por propriedade
export const filterBy = <T>(array: T[], key: keyof T, value: any): T[] => {
  return array.filter((item) => item[key] === value);
};

// Função para agrupar array por propriedade
export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {} as { [key: string]: T[] });
};

// Função para remover duplicatas de array
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

// Função para remover duplicatas por propriedade
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// Função para dividir array em chunks
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Função para embaralhar array
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Função para pegar amostra aleatória de array
export const sample = <T>(array: T[], size: number = 1): T[] => {
  return shuffle(array).slice(0, size);
};

// Função para contar ocorrências em array
export const countBy = <T>(array: T[], key: keyof T): { [key: string]: number } => {
  return array.reduce((counts, item) => {
    const value = String(item[key]);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });
};

// Função para somar valores de propriedade
export const sumBy = <T>(array: T[], key: keyof T): number => {
  return array.reduce((sum, item) => sum + Number(item[key]), 0);
};

// Função para calcular média de valores de propriedade
export const averageBy = <T>(array: T[], key: keyof T): number => {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
};

// Função para encontrar valor máximo por propriedade
export const maxBy = <T>(array: T[], key: keyof T): T | undefined => {
  if (array.length === 0) return undefined;
  return array.reduce((max, item) => 
    Number(item[key]) > Number(max[key]) ? item : max
  );
};

// Função para encontrar valor mínimo por propriedade
export const minBy = <T>(array: T[], key: keyof T): T | undefined => {
  if (array.length === 0) return undefined;
  return array.reduce((min, item) => 
    Number(item[key]) < Number(min[key]) ? item : min
  );
};

// Função para mesclar objetos
export const merge = <T extends object>(...objects: T[]): T => {
  return objects.reduce((result, obj) => ({
    ...result,
    ...obj,
  }), {} as T);
};

// Função para pegar propriedades específicas de objeto
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
};

// Função para omitir propriedades específicas de objeto
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
};

// Função para transformar objeto em query string
export const toQueryString = (obj: object): string => {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
};

// Função para transformar query string em objeto
export const fromQueryString = (query: string): { [key: string]: string } => {
  return Object.fromEntries(
    query
      .substring(1)
      .split('&')
      .map((param) => param.split('='))
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );
}; 