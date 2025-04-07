/**
 * Utilitários para manipulação de números
 */

/**
 * Verifica se um valor é um número
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Verifica se um número é inteiro
 */
export const isInteger = (value: number): boolean => {
  return Number.isInteger(value);
};

/**
 * Verifica se um número é par
 */
export const isEven = (value: number): boolean => {
  return value % 2 === 0;
};

/**
 * Verifica se um número é ímpar
 */
export const isOdd = (value: number): boolean => {
  return value % 2 !== 0;
};

/**
 * Verifica se um número é positivo
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Verifica se um número é negativo
 */
export const isNegative = (value: number): boolean => {
  return value < 0;
};

/**
 * Verifica se um número é zero
 */
export const isZero = (value: number): boolean => {
  return value === 0;
};

/**
 * Verifica se um número está dentro de um intervalo
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Limita um número a um intervalo
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Arredonda um número para um número específico de casas decimais
 */
export const round = (value: number, decimals = 0): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Arredonda um número para baixo
 */
export const floor = (value: number): number => {
  return Math.floor(value);
};

/**
 * Arredonda um número para cima
 */
export const ceil = (value: number): number => {
  return Math.ceil(value);
};

/**
 * Calcula a média de um array de números
 */
export const average = (values: number[]): number => {
  return values.reduce((acc, val) => acc + val, 0) / values.length;
};

/**
 * Calcula a soma de um array de números
 */
export const sum = (values: number[]): number => {
  return values.reduce((acc, val) => acc + val, 0);
};

/**
 * Calcula o produto de um array de números
 */
export const product = (values: number[]): number => {
  return values.reduce((acc, val) => acc * val, 1);
};

/**
 * Encontra o menor valor em um array de números
 */
export const min = (values: number[]): number => {
  return Math.min(...values);
};

/**
 * Encontra o maior valor em um array de números
 */
export const max = (values: number[]): number => {
  return Math.max(...values);
};

/**
 * Calcula a mediana de um array de números
 */
export const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
};

/**
 * Calcula o desvio padrão de um array de números
 */
export const standardDeviation = (values: number[]): number => {
  const avg = average(values);
  const squareDiffs = values.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  return Math.sqrt(average(squareDiffs));
};

/**
 * Calcula a variância de um array de números
 */
export const variance = (values: number[]): number => {
  const avg = average(values);
  const squareDiffs = values.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  return average(squareDiffs);
};

/**
 * Gera um número aleatório entre min e max
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Gera um número inteiro aleatório entre min e max
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(random(min, max + 1));
};

/**
 * Formata um número como moeda
 */
export const formatCurrency = (value: number, locale = 'pt-BR', currency = 'BRL'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Formata um número como percentual
 */
export const formatPercent = (value: number, locale = 'pt-BR', decimals = 2): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formata um número com separadores de milhar
 */
export const formatNumber = (value: number, locale = 'pt-BR', decimals = 2): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Converte um número para formato compacto (K, M, B, T)
 */
export const formatCompact = (value: number, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
  }).format(value);
};

/**
 * Converte um número para formato de engenharia
 */
export const formatEngineering = (value: number, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'engineering',
  }).format(value);
};

/**
 * Converte um número para formato científico
 */
export const formatScientific = (value: number, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'scientific',
  }).format(value);
};

/**
 * Converte um número para formato de unidade
 */
export const formatUnit = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
  }).format(value);
};

/**
 * Converte um número para formato de unidade binária
 */
export const formatBinaryUnit = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'binary',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de comprimento
 */
export const formatLength = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de massa
 */
export const formatMass = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de volume
 */
export const formatVolume = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de área
 */
export const formatArea = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de velocidade
 */
export const formatSpeed = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de temperatura
 */
export const formatTemperature = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de tempo
 */
export const formatTime = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de frequência
 */
export const formatFrequency = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de pressão
 */
export const formatPressure = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de energia
 */
export const formatEnergy = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de potência
 */
export const formatPower = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de ângulo
 */
export const formatAngle = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de luminosidade
 */
export const formatLuminosity = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de dose
 */
export const formatDose = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de concentração
 */
export const formatConcentration = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de resistência
 */
export const formatResistance = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de condutância
 */
export const formatConductance = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de capacitância
 */
export const formatCapacitance = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de indutância
 */
export const formatInductance = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de tensão
 */
export const formatVoltage = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de corrente
 */
export const formatCurrent = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de carga
 */
export const formatCharge = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de fluxo
 */
export const formatFlux = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de densidade
 */
export const formatDensity = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de viscosidade
 */
export const formatViscosity = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de condutividade
 */
export const formatConductivity = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade
 */
export const formatPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade magnética
 */
export const formatMagneticPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade elétrica
 */
export const formatElectricPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade térmica
 */
export const formatThermalPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade acústica
 */
export const formatAcousticPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade óptica
 */
export const formatOpticalPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade química
 */
export const formatChemicalPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade biológica
 */
export const formatBiologicalPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade nuclear
 */
export const formatNuclearPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade gravitacional
 */
export const formatGravitationalPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade cósmica
 */
export const formatCosmicPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
};

/**
 * Converte um número para formato de unidade de permeabilidade universal
 */
export const formatUniversalPermeability = (value: number, unit: string, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value);
}; 