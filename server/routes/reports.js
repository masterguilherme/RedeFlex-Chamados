const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Validações
const reportValidation = [
  check('name', 'Nome é obrigatório').not().isEmpty(),
  check('type', 'Tipo inválido').isIn(['ticket', 'performance', 'satisfaction', 'custom']),
  check('format', 'Formato inválido').isIn(['csv', 'excel', 'pdf']),
  check('fields', 'Campos são obrigatórios').isArray(),
  check('fields.*.key', 'Chave do campo é obrigatória').not().isEmpty(),
  check('fields.*.label', 'Rótulo do campo é obrigatório').not().isEmpty()
];

const scheduleValidation = [
  check('schedule.frequency', 'Frequência inválida').isIn(['daily', 'weekly', 'monthly']),
  check('schedule.time', 'Horário inválido').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  check('schedule.recipients', 'Destinatários são obrigatórios').isArray(),
  check('schedule.recipients.*', 'Email inválido').isEmail()
];

// Rotas
router.get('/', reportController.getReports);
router.get('/:id', reportController.getReport);
router.post('/', [...reportValidation, ...scheduleValidation], reportController.createReport);
router.put('/:id', [...reportValidation, ...scheduleValidation], reportController.updateReport);
router.delete('/:id', reportController.deleteReport);
router.get('/:id/generate', reportController.generateReport);
router.get('/metrics', reportController.getReportMetrics);

module.exports = router; 