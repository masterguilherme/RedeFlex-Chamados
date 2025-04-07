/**
 * Utilitários para manipulação de arrays
 */

/**
 * Verifica se um valor é um array
 */
export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

/**
 * Verifica se um array está vazio
 */
export const isEmpty = <T>(array: T[]): boolean => {
  return array.length === 0;
};

/**
 * Verifica se um array contém um valor
 */
export const contains = <T>(array: T[], value: T): boolean => {
  return array.includes(value);
};

/**
 * Verifica se um array contém todos os valores
 */
export const containsAll = <T>(array: T[], values: T[]): boolean => {
  return values.every(value => array.includes(value));
};

/**
 * Verifica se um array contém algum dos valores
 */
export const containsAny = <T>(array: T[], values: T[]): boolean => {
  return values.some(value => array.includes(value));
};

/**
 * Verifica se um array contém nenhum dos valores
 */
export const containsNone = <T>(array: T[], values: T[]): boolean => {
  return !values.some(value => array.includes(value));
};

/**
 * Verifica se um array contém valores duplicados
 */
export const hasDuplicates = <T>(array: T[]): boolean => {
  return new Set(array).size !== array.length;
};

/**
 * Remove valores duplicados de um array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Remove valores duplicados de um array baseado em uma propriedade
 */
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Remove valores duplicados de um array baseado em uma função
 */
export const uniqueByFn = <T>(array: T[], fn: (item: T) => unknown): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = fn(item);
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Remove valores nulos e undefined de um array
 */
export const compact = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((item): item is T => item !== null && item !== undefined);
};

/**
 * Remove valores falsy de um array
 */
export const compactFalsy = <T>(array: T[]): T[] => {
  return array.filter(Boolean);
};

/**
 * Remove valores vazios de um array
 */
export const compactEmpty = <T>(array: T[]): T[] => {
  return array.filter(item => {
    if (typeof item === 'string') {
      return item.trim().length > 0;
    }
    if (Array.isArray(item)) {
      return item.length > 0;
    }
    if (typeof item === 'object') {
      return Object.keys(item).length > 0;
    }
    return true;
  });
};

/**
 * Remove valores que não atendem a uma condição
 */
export const filter = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.filter(predicate);
};

/**
 * Remove valores que atendem a uma condição
 */
export const reject = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.filter(item => !predicate(item));
};

/**
 * Mapeia um array para outro formato
 */
export const map = <T, U>(array: T[], fn: (item: T) => U): U[] => {
  return array.map(fn);
};

/**
 * Mapeia um array para outro formato e remove valores nulos e undefined
 */
export const mapCompact = <T, U>(array: T[], fn: (item: T) => U | null | undefined): U[] => {
  return array.map(fn).filter((item): item is U => item !== null && item !== undefined);
};

/**
 * Mapeia um array para outro formato e remove valores falsy
 */
export const mapCompactFalsy = <T, U>(array: T[], fn: (item: T) => U): U[] => {
  return array.map(fn).filter(Boolean);
};

/**
 * Mapeia um array para outro formato e remove valores vazios
 */
export const mapCompactEmpty = <T, U>(array: T[], fn: (item: T) => U): U[] => {
  return array.map(fn).filter(item => {
    if (typeof item === 'string') {
      return item.trim().length > 0;
    }
    if (Array.isArray(item)) {
      return item.length > 0;
    }
    if (typeof item === 'object') {
      return Object.keys(item).length > 0;
    }
    return true;
  });
};

/**
 * Reduz um array a um único valor
 */
export const reduce = <T, U>(array: T[], fn: (acc: U, item: T) => U, initial: U): U => {
  return array.reduce(fn, initial);
};

/**
 * Reduz um array a um único valor da direita para a esquerda
 */
export const reduceRight = <T, U>(array: T[], fn: (acc: U, item: T) => U, initial: U): U => {
  return array.reduceRight(fn, initial);
};

/**
 * Agrupa um array por uma propriedade
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    const value = String(item[key]);
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Agrupa um array por uma função
 */
export const groupByFn = <T>(array: T[], fn: (item: T) => string): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    const value = fn(item);
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Conta a ocorrência de cada valor em um array
 */
export const countBy = <T>(array: T[], key: keyof T): Record<string, number> => {
  return array.reduce((acc, item) => {
    const value = String(item[key]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Conta a ocorrência de cada valor em um array baseado em uma função
 */
export const countByFn = <T>(array: T[], fn: (item: T) => string): Record<string, number> => {
  return array.reduce((acc, item) => {
    const value = fn(item);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Soma os valores de uma propriedade em um array
 */
export const sumBy = <T>(array: T[], key: keyof T): number => {
  return array.reduce((acc, item) => acc + Number(item[key]), 0);
};

/**
 * Soma os valores de uma função em um array
 */
export const sumByFn = <T>(array: T[], fn: (item: T) => number): number => {
  return array.reduce((acc, item) => acc + fn(item), 0);
};

/**
 * Calcula a média dos valores de uma propriedade em um array
 */
export const averageBy = <T>(array: T[], key: keyof T): number => {
  return array.reduce((acc, item) => acc + Number(item[key]), 0) / array.length;
};

/**
 * Calcula a média dos valores de uma função em um array
 */
export const averageByFn = <T>(array: T[], fn: (item: T) => number): number => {
  return array.reduce((acc, item) => acc + fn(item), 0) / array.length;
};

/**
 * Encontra o valor máximo de uma propriedade em um array
 */
export const maxBy = <T>(array: T[], key: keyof T): T | undefined => {
  return array.reduce((max, item) => {
    if (!max) return item;
    return Number(item[key]) > Number(max[key]) ? item : max;
  }, undefined as T | undefined);
};

/**
 * Encontra o valor máximo de uma função em um array
 */
export const maxByFn = <T>(array: T[], fn: (item: T) => number): T | undefined => {
  return array.reduce((max, item) => {
    if (!max) return item;
    return fn(item) > fn(max) ? item : max;
  }, undefined as T | undefined);
};

/**
 * Encontra o valor mínimo de uma propriedade em um array
 */
export const minBy = <T>(array: T[], key: keyof T): T | undefined => {
  return array.reduce((min, item) => {
    if (!min) return item;
    return Number(item[key]) < Number(min[key]) ? item : min;
  }, undefined as T | undefined);
};

/**
 * Encontra o valor mínimo de uma função em um array
 */
export const minByFn = <T>(array: T[], fn: (item: T) => number): T | undefined => {
  return array.reduce((min, item) => {
    if (!min) return item;
    return fn(item) < fn(min) ? item : min;
  }, undefined as T | undefined);
};

/**
 * Ordena um array por uma propriedade
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Ordena um array por uma função
 */
export const sortByFn = <T>(array: T[], fn: (item: T) => number | string, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = fn(a);
    const bValue = fn(b);
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Embaralha um array
 */
export const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

/**
 * Seleciona um elemento aleatório de um array
 */
export const sample = <T>(array: T[]): T | undefined => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Seleciona n elementos aleatórios de um array
 */
export const sampleSize = <T>(array: T[], size: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, size);
};

/**
 * Divide um array em chunks
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  return array.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(item);
    return acc;
  }, [] as T[][]);
};

/**
 * Aplica uma função a cada elemento de um array
 */
export const forEach = <T>(array: T[], fn: (item: T) => void): void => {
  array.forEach(fn);
};

/**
 * Aplica uma função a cada elemento de um array e retorna os resultados
 */
export const mapAsync = async <T, U>(array: T[], fn: (item: T) => Promise<U>): Promise<U[]> => {
  return Promise.all(array.map(fn));
};

/**
 * Filtra um array usando uma função assíncrona
 */
export const filterAsync = async <T>(array: T[], fn: (item: T) => Promise<boolean>): Promise<T[]> => {
  const results = await Promise.all(array.map(fn));
  return array.filter((_, index) => results[index]);
};

/**
 * Reduz um array usando uma função assíncrona
 */
export const reduceAsync = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U): Promise<U> => {
  let acc = initial;
  for (const item of array) {
    acc = await fn(acc, item);
  }
  return acc;
};

/**
 * Reduz um array da direita para a esquerda usando uma função assíncrona
 */
export const reduceRightAsync = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U): Promise<U> => {
  let acc = initial;
  for (let i = array.length - 1; i >= 0; i--) {
    acc = await fn(acc, array[i]);
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo
 */
export const forEachParallel = async <T>(array: T[], fn: (item: T) => Promise<void>): Promise<void> => {
  await Promise.all(array.map(fn));
};

/**
 * Aplica uma função a cada elemento de um array em série
 */
export const forEachSeries = async <T>(array: T[], fn: (item: T) => Promise<void>): Promise<void> => {
  for (const item of array) {
    await fn(item);
  }
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência
 */
export const forEachLimit = async <T>(array: T[], fn: (item: T) => Promise<void>, limit: number): Promise<void> => {
  const chunks = chunk(array, limit);
  for (const chunk of chunks) {
    await Promise.all(chunk.map(fn));
  }
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e retorna os resultados
 */
export const mapLimit = async <T, U>(array: T[], fn: (item: T) => Promise<U>, limit: number): Promise<U[]> => {
  const chunks = chunk(array, limit);
  const results: U[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e filtra os resultados
 */
export const filterLimit = async <T>(array: T[], fn: (item: T) => Promise<boolean>, limit: number): Promise<T[]> => {
  const chunks = chunk(array, limit);
  const results: T[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunk.filter((_, index) => chunkResults[index]));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e reduz os resultados
 */
export const reduceLimit = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(array, limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(item => fn(acc, item)));
    acc = chunkResults[chunkResults.length - 1];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e reduz os resultados da direita para a esquerda
 */
export const reduceRightLimit = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(array.reverse(), limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(item => fn(acc, item)));
    acc = chunkResults[chunkResults.length - 1];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e retorna os resultados em ordem
 */
export const mapOrdered = async <T, U>(array: T[], fn: (item: T) => Promise<U>, limit: number): Promise<U[]> => {
  const chunks = chunk(array, limit);
  const results: U[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e filtra os resultados em ordem
 */
export const filterOrdered = async <T>(array: T[], fn: (item: T) => Promise<boolean>, limit: number): Promise<T[]> => {
  const chunks = chunk(array, limit);
  const results: T[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunk.filter((_, index) => chunkResults[index]));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e reduz os resultados em ordem
 */
export const reduceOrdered = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(array, limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(item => fn(acc, item)));
    acc = chunkResults[chunkResults.length - 1];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e reduz os resultados da direita para a esquerda em ordem
 */
export const reduceRightOrdered = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(array.reverse(), limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(item => fn(acc, item)));
    acc = chunkResults[chunkResults.length - 1];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e retorna os resultados em ordem
 */
export const mapOrderedLimit = async <T, U>(array: T[], fn: (item: T) => Promise<U>, limit: number): Promise<U[]> => {
  const chunks = chunk(array, limit);
  const results: U[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e filtra os resultados em ordem
 */
export const filterOrderedLimit = async <T>(array: T[], fn: (item: T) => Promise<boolean>, limit: number): Promise<T[]> => {
  const chunks = chunk(array, limit);
  const results: T[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunk.filter((_, index) => chunkResults[index]));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e reduz os resultados em ordem
 */
export const reduceOrderedLimit = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(array, limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(item => fn(acc, item)));
    acc = chunkResults[chunkResults.length - 1];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um array em paralelo com um limite de concorrência e reduz os resultados da direita para a esquerda em ordem
 */
export const reduceRightOrderedLimit = async <T, U>(array: T[], fn: (acc: U, item: T) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(array.reverse(), limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(item => fn(acc, item)));
    acc = chunkResults[chunkResults.length - 1];
  }
  return acc;
}; 