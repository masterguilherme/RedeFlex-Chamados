const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const { auth } = require('../config/auth');

// @route   GET api/tickets
// @desc    Obter todos os chamados
// @access  Private
router.get('/', auth, ticketController.getTickets);

// @route   GET api/tickets/:id
// @desc    Obter chamado por ID
// @access  Private
router.get('/:id', auth, ticketController.getTicket);

// @route   POST api/tickets
// @desc    Criar um chamado
// @access  Private
router.post(
  '/',
  [
    auth,
    check('title', 'Título é obrigatório').not().isEmpty(),
    check('description', 'Descrição é obrigatória').not().isEmpty(),
    check('category', 'Categoria é obrigatória').not().isEmpty()
  ],
  ticketController.createTicket
);

// @route   PUT api/tickets/:id
// @desc    Atualizar um chamado
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('title', 'Título é obrigatório').not().isEmpty(),
    check('description', 'Descrição é obrigatória').not().isEmpty(),
    check('category', 'Categoria é obrigatória').not().isEmpty()
  ],
  ticketController.updateTicket
);

// @route   DELETE api/tickets/:id
// @desc    Excluir um chamado
// @access  Private/Admin
router.delete('/:id', auth, ticketController.deleteTicket);

module.exports = router; 