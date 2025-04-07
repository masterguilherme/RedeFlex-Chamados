const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por janela
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos'
});

// Configuração do rate limiting para autenticação
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // limite de 5 tentativas de login
  message: 'Muitas tentativas de login, tente novamente em 1 hora'
});

// Middleware para sanitização de dados
const sanitizeData = (req, res, next) => {
  // Sanitizar dados do corpo da requisição
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitizar dados dos parâmetros de query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
};

// Middleware para validação de tipos de dados
const validateDataTypes = (req, res, next) => {
  const validateField = (value, type) => {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^\+?[\d\s-()]{10,}$/.test(value);
      case 'cnpj':
        return /^\d{14}$/.test(value.replace(/\D/g, ''));
      case 'date':
        return !isNaN(Date.parse(value));
      case 'number':
        return !isNaN(Number(value));
      default:
        return true;
    }
  };

  // Validar campos específicos do corpo da requisição
  if (req.body) {
    const validationRules = {
      email: ['email'],
      phone: ['phone'],
      cnpj: ['cnpj'],
      dueDate: ['date'],
      priority: ['number']
    };

    for (const [field, types] of Object.entries(validationRules)) {
      if (req.body[field] && !types.every(type => validateField(req.body[field], type))) {
        return res.status(400).json({
          message: `Campo ${field} inválido`
        });
      }
    }
  }

  next();
};

// Middleware para validação de tamanho de dados
const validateDataSize = (req, res, next) => {
  const maxSizes = {
    title: 100,
    description: 1000,
    email: 100,
    phone: 20,
    cnpj: 14,
    name: 100
  };

  if (req.body) {
    for (const [field, maxSize] of Object.entries(maxSizes)) {
      if (req.body[field] && req.body[field].length > maxSize) {
        return res.status(400).json({
          message: `Campo ${field} excede o tamanho máximo permitido`
        });
      }
    }
  }

  next();
};

// Middleware para validação de caracteres permitidos
const validateAllowedChars = (req, res, next) => {
  const allowedChars = {
    name: /^[a-zA-ZÀ-ÿ\s-]+$/,
    title: /^[a-zA-ZÀ-ÿ0-9\s-.,!?()]+$/,
    description: /^[a-zA-ZÀ-ÿ0-9\s-.,!?()\n]+$/
  };

  if (req.body) {
    for (const [field, pattern] of Object.entries(allowedChars)) {
      if (req.body[field] && !pattern.test(req.body[field])) {
        return res.status(400).json({
          message: `Campo ${field} contém caracteres não permitidos`
        });
      }
    }
  }

  next();
};

module.exports = {
  helmet,
  limiter,
  authLimiter,
  xss,
  hpp,
  mongoSanitize,
  sanitizeData,
  validateDataTypes,
  validateDataSize,
  validateAllowedChars
}; 