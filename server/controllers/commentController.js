const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const notificationController = require('./notificationController');

// @route   GET api/tickets/:ticketId/comments
// @desc    Obter todos os comentários de um chamado
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { 
        ticket: req.params.ticketId,
        active: true
      },
      include: [
        {
          model: require('../models/User'),
          as: 'createdByUser',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   POST api/tickets/:ticketId/comments
// @desc    Adicionar um comentário a um chamado
// @access  Private
exports.createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content, isInternal } = req.body;
    const ticket = await Ticket.findByPk(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({ msg: 'Chamado não encontrado' });
    }

    const comment = await Comment.create({
      content,
      isInternal,
      ticket: ticket.id,
      createdBy: req.user.id
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: require('../models/User'),
          as: 'createdByUser',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(commentWithUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/tickets/:ticketId/comments/:id
// @desc    Atualizar um comentário
// @access  Private
exports.updateComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content } = req.body;
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comentário não encontrado' });
    }

    // Verificar se o comentário pertence ao chamado
    if (comment.ticket !== parseInt(req.params.ticketId)) {
      return res.status(400).json({ msg: 'Comentário não pertence a este chamado' });
    }

    // Apenas o autor pode editar o comentário
    if (comment.createdBy !== req.user.id) {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    await comment.update({ content });

    const updatedComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: require('../models/User'),
          as: 'createdByUser',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(updatedComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   DELETE api/tickets/:ticketId/comments/:id
// @desc    Desativar um comentário
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comentário não encontrado' });
    }

    // Verificar se o comentário pertence ao chamado
    if (comment.ticket !== parseInt(req.params.ticketId)) {
      return res.status(400).json({ msg: 'Comentário não pertence a este chamado' });
    }

    // Apenas o autor ou admin pode desativar o comentário
    if (comment.createdBy !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    // Desativar comentário (soft delete)
    await comment.update({ active: false });

    res.json({ msg: 'Comentário desativado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
}; 