const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const logController = require('../controllers/logController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Validação para consulta de logs
const getLogsValidation = [
  query('type').optional().isIn(['application', 'access', 'error']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('limit').optional().isInt({ min: 1, max: 1000 })
];

// Validação para estatísticas
const getStatsValidation = [
  query('type').optional().isIn(['application', 'access', 'error']),
  query('period').optional().isIn(['1h', '24h', '7d', '30d'])
];

// Validação para limpeza de logs
const cleanupValidation = [
  body('maxAge').optional().isInt({ min: 1, max: 365 })
];

// Validação para exportação
const exportValidation = [
  query('type').optional().isIn(['application', 'access', 'error']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('format').optional().isIn(['csv', 'xlsx', 'pdf', 'json'])
];

// Obtém logs
router.get('/', getLogsValidation, validate, logController.getLogs);

// Obtém estatísticas
router.get('/stats', getStatsValidation, validate, logController.getLogStats);

// Limpa logs antigos
router.post('/cleanup', cleanupValidation, validate, logController.cleanupLogs);

// Exporta logs
router.get('/export', exportValidation, validate, logController.exportLogs);

module.exports = router; 