const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const ticketHistoryController = require('../controllers/ticketHistoryController');

// @route   GET api/tickets/:ticketId/history
// @desc    Obter o histórico de mudanças de um chamado
// @access  Private
router.get('/:ticketId/history', auth, ticketHistoryController.getTicketHistory);

// @route   POST api/tickets/:ticketId/history
// @desc    Registrar uma mudança no histórico do chamado
// @access  Private
router.post(
  '/:ticketId/history',
  [
    auth,
    [
      check('field', 'O campo que foi alterado é obrigatório').not().isEmpty(),
      check('changeType', 'O tipo de mudança é obrigatório').isIn(['create', 'update', 'delete', 'status_change', 'assignment'])
    ]
  ],
  ticketHistoryController.createHistoryEntry
);

// @route   GET api/tickets/:ticketId/history/:id
// @desc    Obter uma entrada específica do histórico
// @access  Private
router.get('/:ticketId/history/:id', auth, ticketHistoryController.getHistoryEntry);

module.exports = router; 