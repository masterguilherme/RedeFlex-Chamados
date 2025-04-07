const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth } = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// @route   GET api/tickets/:ticketId/comments
// @desc    Obter todos os comentários de um chamado
// @access  Private
router.get('/:ticketId/comments', auth, commentController.getComments);

// @route   POST api/tickets/:ticketId/comments
// @desc    Adicionar um comentário a um chamado
// @access  Private
router.post(
  '/:ticketId/comments',
  [
    auth,
    [
      check('content', 'O conteúdo do comentário é obrigatório').not().isEmpty(),
      check('isInternal', 'O campo isInternal deve ser um booleano').isBoolean()
    ]
  ],
  commentController.createComment
);

// @route   PUT api/tickets/:ticketId/comments/:id
// @desc    Atualizar um comentário
// @access  Private
router.put(
  '/:ticketId/comments/:id',
  [
    auth,
    [
      check('content', 'O conteúdo do comentário é obrigatório').not().isEmpty()
    ]
  ],
  commentController.updateComment
);

// @route   DELETE api/tickets/:ticketId/comments/:id
// @desc    Desativar um comentário
// @access  Private
router.delete('/:ticketId/comments/:id', auth, commentController.deleteComment);

module.exports = router; 