const nodemailer = require('nodemailer');
const winston = require('winston');

// Configuração do logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/email-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/email.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Configuração do transportador SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Validação da configuração
const validateConfig = () => {
  const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Configurações de email ausentes: ${missingVars.join(', ')}`);
  }
};

// Teste de conexão
const testConnection = async () => {
  try {
    await transporter.verify();
    logger.info('Conexão SMTP estabelecida com sucesso');
    return true;
  } catch (error) {
    logger.error('Erro ao conectar ao servidor SMTP:', error);
    return false;
  }
};

module.exports = {
  transporter,
  logger,
  validateConfig,
  testConnection
}; 