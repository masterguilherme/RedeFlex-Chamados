/**
 * Utilitários para manipulação de objetos
 */

/**
 * Verifica se um valor é um objeto
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Verifica se um objeto está vazio
 */
export const isEmpty = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Verifica se um objeto contém uma chave
 */
export const hasKey = (obj: Record<string, unknown>, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * Verifica se um objeto contém todas as chaves
 */
export const hasAllKeys = (obj: Record<string, unknown>, keys: string[]): boolean => {
  return keys.every(key => hasKey(obj, key));
};

/**
 * Verifica se um objeto contém alguma das chaves
 */
export const hasAnyKey = (obj: Record<string, unknown>, keys: string[]): boolean => {
  return keys.some(key => hasKey(obj, key));
};

/**
 * Verifica se um objeto contém nenhuma das chaves
 */
export const hasNoneKey = (obj: Record<string, unknown>, keys: string[]): boolean => {
  return !keys.some(key => hasKey(obj, key));
};

/**
 * Verifica se um objeto contém um valor
 */
export const hasValue = (obj: Record<string, unknown>, value: unknown): boolean => {
  return Object.values(obj).includes(value);
};

/**
 * Verifica se um objeto contém todos os valores
 */
export const hasAllValues = (obj: Record<string, unknown>, values: unknown[]): boolean => {
  return values.every(value => hasValue(obj, value));
};

/**
 * Verifica se um objeto contém algum dos valores
 */
export const hasAnyValue = (obj: Record<string, unknown>, values: unknown[]): boolean => {
  return values.some(value => hasValue(obj, value));
};

/**
 * Verifica se um objeto contém nenhum dos valores
 */
export const hasNoneValue = (obj: Record<string, unknown>, values: unknown[]): boolean => {
  return !values.some(value => hasValue(obj, value));
};

/**
 * Verifica se um objeto contém valores duplicados
 */
export const hasDuplicates = (obj: Record<string, unknown>): boolean => {
  const values = Object.values(obj);
  return new Set(values).size !== values.length;
};

/**
 * Remove valores duplicados de um objeto
 */
export const unique = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  const seen = new Set();
  for (const [key, value] of Object.entries(obj)) {
    if (!seen.has(value)) {
      seen.add(value);
      result[key] = value;
    }
  }
  return result;
};

/**
 * Remove valores nulos e undefined de um objeto
 */
export const compact = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Remove valores falsy de um objeto
 */
export const compactFalsy = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Remove valores vazios de um objeto
 */
export const compactEmpty = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.trim().length > 0) {
      result[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      result[key] = value;
    } else if (isObject(value) && Object.keys(value).length > 0) {
      result[key] = value;
    } else if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Filtra um objeto por uma condição
 */
export const filter = (obj: Record<string, unknown>, predicate: (value: unknown, key: string) => boolean): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Filtra um objeto por uma condição e remove valores que não atendem
 */
export const reject = (obj: Record<string, unknown>, predicate: (value: unknown, key: string) => boolean): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Mapeia um objeto para outro formato
 */
export const map = <T>(obj: Record<string, unknown>, fn: (value: unknown, key: string) => T): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = fn(value, key);
  }
  return result;
};

/**
 * Mapeia um objeto para outro formato e remove valores nulos e undefined
 */
export const mapCompact = <T>(obj: Record<string, unknown>, fn: (value: unknown, key: string) => T | null | undefined): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(obj)) {
    const mapped = fn(value, key);
    if (mapped !== null && mapped !== undefined) {
      result[key] = mapped;
    }
  }
  return result;
};

/**
 * Mapeia um objeto para outro formato e remove valores falsy
 */
export const mapCompactFalsy = <T>(obj: Record<string, unknown>, fn: (value: unknown, key: string) => T): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(obj)) {
    const mapped = fn(value, key);
    if (mapped) {
      result[key] = mapped;
    }
  }
  return result;
};

/**
 * Mapeia um objeto para outro formato e remove valores vazios
 */
export const mapCompactEmpty = <T>(obj: Record<string, unknown>, fn: (value: unknown, key: string) => T): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(obj)) {
    const mapped = fn(value, key);
    if (typeof mapped === 'string' && mapped.trim().length > 0) {
      result[key] = mapped;
    } else if (Array.isArray(mapped) && mapped.length > 0) {
      result[key] = mapped;
    } else if (isObject(mapped) && Object.keys(mapped).length > 0) {
      result[key] = mapped;
    } else if (mapped !== null && mapped !== undefined && mapped !== '') {
      result[key] = mapped;
    }
  }
  return result;
};

/**
 * Reduz um objeto a um único valor
 */
export const reduce = <T, U>(obj: Record<string, unknown>, fn: (acc: U, value: unknown, key: string) => U, initial: U): U => {
  let acc = initial;
  for (const [key, value] of Object.entries(obj)) {
    acc = fn(acc, value, key);
  }
  return acc;
};

/**
 * Reduz um objeto a um único valor da direita para a esquerda
 */
export const reduceRight = <T, U>(obj: Record<string, unknown>, fn: (acc: U, value: unknown, key: string) => U, initial: U): U => {
  let acc = initial;
  for (const [key, value] of Object.entries(obj).reverse()) {
    acc = fn(acc, value, key);
  }
  return acc;
};

/**
 * Agrupa um objeto por uma propriedade
 */
export const groupBy = <T>(obj: Record<string, T>, key: keyof T): Record<string, T[]> => {
  return reduce(obj, (acc, value, k) => {
    const groupKey = String(value[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(value);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Agrupa um objeto por uma função
 */
export const groupByFn = <T>(obj: Record<string, T>, fn: (value: T) => string): Record<string, T[]> => {
  return reduce(obj, (acc, value, k) => {
    const groupKey = fn(value);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(value);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Conta a ocorrência de cada valor em um objeto
 */
export const countBy = <T>(obj: Record<string, T>, key: keyof T): Record<string, number> => {
  return reduce(obj, (acc, value, k) => {
    const countKey = String(value[key]);
    acc[countKey] = (acc[countKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Conta a ocorrência de cada valor em um objeto baseado em uma função
 */
export const countByFn = <T>(obj: Record<string, T>, fn: (value: T) => string): Record<string, number> => {
  return reduce(obj, (acc, value, k) => {
    const countKey = fn(value);
    acc[countKey] = (acc[countKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Soma os valores de uma propriedade em um objeto
 */
export const sumBy = <T>(obj: Record<string, T>, key: keyof T): number => {
  return reduce(obj, (acc, value, k) => acc + Number(value[key]), 0);
};

/**
 * Soma os valores de uma função em um objeto
 */
export const sumByFn = <T>(obj: Record<string, T>, fn: (value: T) => number): number => {
  return reduce(obj, (acc, value, k) => acc + fn(value), 0);
};

/**
 * Calcula a média dos valores de uma propriedade em um objeto
 */
export const averageBy = <T>(obj: Record<string, T>, key: keyof T): number => {
  const values = Object.values(obj);
  return values.reduce((acc, value) => acc + Number(value[key]), 0) / values.length;
};

/**
 * Calcula a média dos valores de uma função em um objeto
 */
export const averageByFn = <T>(obj: Record<string, T>, fn: (value: T) => number): number => {
  const values = Object.values(obj);
  return values.reduce((acc, value) => acc + fn(value), 0) / values.length;
};

/**
 * Encontra o valor máximo de uma propriedade em um objeto
 */
export const maxBy = <T>(obj: Record<string, T>, key: keyof T): T | undefined => {
  return Object.values(obj).reduce((max, value) => {
    if (!max) return value;
    return Number(value[key]) > Number(max[key]) ? value : max;
  }, undefined as T | undefined);
};

/**
 * Encontra o valor máximo de uma função em um objeto
 */
export const maxByFn = <T>(obj: Record<string, T>, fn: (value: T) => number): T | undefined => {
  return Object.values(obj).reduce((max, value) => {
    if (!max) return value;
    return fn(value) > fn(max) ? value : max;
  }, undefined as T | undefined);
};

/**
 * Encontra o valor mínimo de uma propriedade em um objeto
 */
export const minBy = <T>(obj: Record<string, T>, key: keyof T): T | undefined => {
  return Object.values(obj).reduce((min, value) => {
    if (!min) return value;
    return Number(value[key]) < Number(min[key]) ? value : min;
  }, undefined as T | undefined);
};

/**
 * Encontra o valor mínimo de uma função em um objeto
 */
export const minByFn = <T>(obj: Record<string, T>, fn: (value: T) => number): T | undefined => {
  return Object.values(obj).reduce((min, value) => {
    if (!min) return value;
    return fn(value) < fn(min) ? value : min;
  }, undefined as T | undefined);
};

/**
 * Ordena um objeto por uma propriedade
 */
export const sortBy = <T>(obj: Record<string, T>, key: keyof T, order: 'asc' | 'desc' = 'asc'): Record<string, T> => {
  const entries = Object.entries(obj);
  entries.sort(([, a], [, b]) => {
    const aValue = a[key];
    const bValue = b[key];
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return Object.fromEntries(entries);
};

/**
 * Ordena um objeto por uma função
 */
export const sortByFn = <T>(obj: Record<string, T>, fn: (value: T) => number | string, order: 'asc' | 'desc' = 'asc'): Record<string, T> => {
  const entries = Object.entries(obj);
  entries.sort(([, a], [, b]) => {
    const aValue = fn(a);
    const bValue = fn(b);
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return Object.fromEntries(entries);
};

/**
 * Embaralha um objeto
 */
export const shuffle = <T>(obj: Record<string, T>): Record<string, T> => {
  const entries = Object.entries(obj);
  entries.sort(() => Math.random() - 0.5);
  return Object.fromEntries(entries);
};

/**
 * Seleciona um elemento aleatório de um objeto
 */
export const sample = <T>(obj: Record<string, T>): T | undefined => {
  const values = Object.values(obj);
  return values[Math.floor(Math.random() * values.length)];
};

/**
 * Seleciona n elementos aleatórios de um objeto
 */
export const sampleSize = <T>(obj: Record<string, T>, size: number): Record<string, T> => {
  const entries = Object.entries(obj);
  entries.sort(() => Math.random() - 0.5);
  return Object.fromEntries(entries.slice(0, size));
};

/**
 * Divide um objeto em chunks
 */
export const chunk = <T>(obj: Record<string, T>, size: number): Record<string, T>[] => {
  const entries = Object.entries(obj);
  const chunks: Record<string, T>[] = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return chunks;
};

/**
 * Aplica uma função a cada elemento de um objeto
 */
export const forEach = <T>(obj: Record<string, T>, fn: (value: T, key: string) => void): void => {
  for (const [key, value] of Object.entries(obj)) {
    fn(value, key);
  }
};

/**
 * Aplica uma função a cada elemento de um objeto e retorna os resultados
 */
export const mapAsync = async <T, U>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<U>): Promise<Record<string, U>> => {
  const entries = await Promise.all(Object.entries(obj).map(async ([key, value]) => [key, await fn(value, key)]));
  return Object.fromEntries(entries);
};

/**
 * Filtra um objeto usando uma função assíncrona
 */
export const filterAsync = async <T>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<boolean>): Promise<Record<string, T>> => {
  const entries = await Promise.all(Object.entries(obj).map(async ([key, value]) => [key, value, await fn(value, key)]));
  return Object.fromEntries(entries.filter(([, , keep]) => keep).map(([key, value]) => [key, value]));
};

/**
 * Reduz um objeto usando uma função assíncrona
 */
export const reduceAsync = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U): Promise<U> => {
  let acc = initial;
  for (const [key, value] of Object.entries(obj)) {
    acc = await fn(acc, value, key);
  }
  return acc;
};

/**
 * Reduz um objeto da direita para a esquerda usando uma função assíncrona
 */
export const reduceRightAsync = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U): Promise<U> => {
  let acc = initial;
  for (const [key, value] of Object.entries(obj).reverse()) {
    acc = await fn(acc, value, key);
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo
 */
export const forEachParallel = async <T>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<void>): Promise<void> => {
  await Promise.all(Object.entries(obj).map(([key, value]) => fn(value, key)));
};

/**
 * Aplica uma função a cada elemento de um objeto em série
 */
export const forEachSeries = async <T>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<void>): Promise<void> => {
  for (const [key, value] of Object.entries(obj)) {
    await fn(value, key);
  }
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência
 */
export const forEachLimit = async <T>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<void>, limit: number): Promise<void> => {
  const chunks = chunk(obj, limit);
  for (const chunk of chunks) {
    await Promise.all(Object.entries(chunk).map(([key, value]) => fn(value, key)));
  }
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e retorna os resultados
 */
export const mapLimit = async <T, U>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<U>, limit: number): Promise<Record<string, U>> => {
  const chunks = chunk(obj, limit);
  const results: Record<string, U> = {};
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, await fn(value, key)]));
    Object.assign(results, Object.fromEntries(chunkResults));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e filtra os resultados
 */
export const filterLimit = async <T>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<boolean>, limit: number): Promise<Record<string, T>> => {
  const chunks = chunk(obj, limit);
  const results: Record<string, T> = {};
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(value, key)]));
    Object.assign(results, Object.fromEntries(chunkResults.filter(([, , keep]) => keep).map(([key, value]) => [key, value])));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e reduz os resultados
 */
export const reduceLimit = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(obj, limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(acc, value, key)]));
    acc = chunkResults[chunkResults.length - 1][2];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e reduz os resultados da direita para a esquerda
 */
export const reduceRightLimit = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(obj, limit);
  let acc = initial;
  for (const chunk of chunks.reverse()) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(acc, value, key)]));
    acc = chunkResults[chunkResults.length - 1][2];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e retorna os resultados em ordem
 */
export const mapOrdered = async <T, U>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<U>, limit: number): Promise<Record<string, U>> => {
  const chunks = chunk(obj, limit);
  const results: Record<string, U> = {};
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, await fn(value, key)]));
    Object.assign(results, Object.fromEntries(chunkResults));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e filtra os resultados em ordem
 */
export const filterOrdered = async <T>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<boolean>, limit: number): Promise<Record<string, T>> => {
  const chunks = chunk(obj, limit);
  const results: Record<string, T> = {};
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(value, key)]));
    Object.assign(results, Object.fromEntries(chunkResults.filter(([, , keep]) => keep).map(([key, value]) => [key, value])));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e reduz os resultados em ordem
 */
export const reduceOrdered = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(obj, limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(acc, value, key)]));
    acc = chunkResults[chunkResults.length - 1][2];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e reduz os resultados da direita para a esquerda em ordem
 */
export const reduceRightOrdered = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(obj, limit);
  let acc = initial;
  for (const chunk of chunks.reverse()) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(acc, value, key)]));
    acc = chunkResults[chunkResults.length - 1][2];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e retorna os resultados em ordem
 */
export const mapOrderedLimit = async <T, U>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<U>, limit: number): Promise<Record<string, U>> => {
  const chunks = chunk(obj, limit);
  const results: Record<string, U> = {};
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, await fn(value, key)]));
    Object.assign(results, Object.fromEntries(chunkResults));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e filtra os resultados em ordem
 */
export const filterOrderedLimit = async <T>(obj: Record<string, T>, fn: (value: T, key: string) => Promise<boolean>, limit: number): Promise<Record<string, T>> => {
  const chunks = chunk(obj, limit);
  const results: Record<string, T> = {};
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(value, key)]));
    Object.assign(results, Object.fromEntries(chunkResults.filter(([, , keep]) => keep).map(([key, value]) => [key, value])));
  }
  return results;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e reduz os resultados em ordem
 */
export const reduceOrderedLimit = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(obj, limit);
  let acc = initial;
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(acc, value, key)]));
    acc = chunkResults[chunkResults.length - 1][2];
  }
  return acc;
};

/**
 * Aplica uma função a cada elemento de um objeto em paralelo com um limite de concorrência e reduz os resultados da direita para a esquerda em ordem
 */
export const reduceRightOrderedLimit = async <T, U>(obj: Record<string, T>, fn: (acc: U, value: T, key: string) => Promise<U>, initial: U, limit: number): Promise<U> => {
  const chunks = chunk(obj, limit);
  let acc = initial;
  for (const chunk of chunks.reverse()) {
    const chunkResults = await Promise.all(Object.entries(chunk).map(async ([key, value]) => [key, value, await fn(acc, value, key)]));
    acc = chunkResults[chunkResults.length - 1][2];
  }
  return acc;
}; 