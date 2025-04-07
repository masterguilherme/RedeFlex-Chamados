const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const {
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
} = require('./middleware/security');
require('dotenv').config();

// Inicializar app
const app = express();

// Middlewares de segurança
app.use(helmet()); // Adiciona headers de segurança
app.use(xss()); // Proteção contra XSS
app.use(hpp()); // Proteção contra HTTP Parameter Pollution
app.use(mongoSanitize()); // Sanitização de dados MongoDB
app.use(compression()); // Compressão de resposta
app.use(cors()); // Configuração CORS
app.use(express.json({ limit: '10kb' })); // Limite de tamanho do body
app.use(morgan('dev')); // Logging

// Rate limiting global
app.use('/api/', limiter);

// Middlewares de validação
app.use(sanitizeData);
app.use(validateDataTypes);
app.use(validateDataSize);
app.use(validateAllowedChars);

// Diretório para uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
const ticketRoutes = require('./routes/tickets');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets/:ticketId/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', require('./routes/reports'));

// Rota padrão
app.get('/', (req, res) => {
  res.json({ msg: 'Bem-vindo à API do Sistema de Gerenciamento de Chamados' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); 