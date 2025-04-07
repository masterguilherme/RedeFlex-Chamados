// Função para construir URL com query params
export const buildUrl = (baseUrl: string, params: Record<string, any>): string => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
};

// Função para extrair query params de uma URL
export const getQueryParams = (url: string): Record<string, string> => {
  const searchParams = new URL(url).searchParams;
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

// Função para atualizar query params de uma URL
export const updateQueryParams = (
  url: string,
  params: Record<string, any>
): string => {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      urlObj.searchParams.delete(key);
    } else {
      urlObj.searchParams.set(key, String(value));
    }
  });
  return urlObj.toString();
};

// Função para remover query params de uma URL
export const removeQueryParams = (url: string, params: string[]): string => {
  const urlObj = new URL(url);
  params.forEach((param) => urlObj.searchParams.delete(param));
  return urlObj.toString();
};

// Função para verificar se uma URL é válida
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Função para normalizar uma URL
export const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    return url;
  }
};

// Função para obter o domínio de uma URL
export const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

// Função para obter o caminho de uma URL
export const getPath = (url: string): string => {
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
};

// Função para obter o protocolo de uma URL
export const getProtocol = (url: string): string => {
  try {
    return new URL(url).protocol;
  } catch {
    return '';
  }
};

// Função para obter a porta de uma URL
export const getPort = (url: string): string => {
  try {
    return new URL(url).port;
  } catch {
    return '';
  }
};

// Função para obter o hash de uma URL
export const getHash = (url: string): string => {
  try {
    return new URL(url).hash;
  } catch {
    return '';
  }
};

// Função para obter o usuário de uma URL
export const getUsername = (url: string): string => {
  try {
    return new URL(url).username;
  } catch {
    return '';
  }
};

// Função para obter a senha de uma URL
export const getPassword = (url: string): string => {
  try {
    return new URL(url).password;
  } catch {
    return '';
  }
};

// Função para obter a origem de uma URL
export const getOrigin = (url: string): string => {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
};

// Função para obter a string de busca de uma URL
export const getSearch = (url: string): string => {
  try {
    return new URL(url).search;
  } catch {
    return '';
  }
};

// Função para obter os parâmetros de busca de uma URL
export const getSearchParams = (url: string): URLSearchParams => {
  try {
    return new URL(url).searchParams;
  } catch {
    return new URLSearchParams();
  }
}; 