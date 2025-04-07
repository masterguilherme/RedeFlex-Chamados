const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const TicketHistory = require('../models/TicketHistory');
const { validationResult } = require('express-validator');
const notificationController = require('./notificationController');

// @route   GET api/tickets
// @desc    Obter todos os chamados
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { active: true },
      include: [
        {
          model: require('../models/User'),
          as: 'assignedToUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/User'),
          as: 'createdByUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/Company'),
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/tickets/:id
// @desc    Obter um chamado específico
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: require('../models/User'),
          as: 'assignedToUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/User'),
          as: 'createdByUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/Company'),
          attributes: ['id', 'name']
        },
        {
          model: Comment,
          where: { active: true },
          include: [
            {
              model: require('../models/User'),
              as: 'createdByUser',
              attributes: ['id', 'name', 'email']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });
    
    if (!ticket) {
      return res.status(404).json({ msg: 'Chamado não encontrado' });
    }
    
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   POST api/tickets
// @desc    Criar um novo chamado
// @access  Private
exports.createTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, priority, category, company, dueDate } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      company,
      dueDate,
      createdBy: req.user.id
    });

    // Registrar histórico
    await TicketHistory.create({
      ticket: ticket.id,
      field: 'create',
      changeType: 'create',
      changedBy: req.user.id
    });

    const ticketWithRelations = await Ticket.findByPk(ticket.id, {
      include: [
        {
          model: require('../models/User'),
          as: 'assignedToUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/User'),
          as: 'createdByUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/Company'),
          attributes: ['id', 'name']
        }
      ]
    });

    // Adicionar notificação para o usuário que criou o chamado
    await notificationController.createNotification(
      req.user.id,
      'Chamado criado',
      `Seu chamado "${ticket.title}" foi criado com sucesso.`,
      'success',
      `/tickets/${ticket.id}`
    );

    // Adicionar notificação para administradores
    const admins = await User.findAll({
      where: { type: 'admin' },
      attributes: ['id']
    });

    if (admins.length > 0) {
      const adminIds = admins.map(admin => admin.id);
      await notificationController.createNotificationForUsers(
        adminIds,
        'Novo chamado',
        `Um novo chamado "${ticket.title}" foi criado por ${req.user.name}.`,
        'info',
        `/tickets/${ticket.id}`
      );
    }

    res.json(ticketWithRelations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/tickets/:id
// @desc    Atualizar um chamado
// @access  Private
exports.updateTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, status, priority, category, assignedTo, dueDate } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: 'Chamado não encontrado' });
    }

    // Registrar alterações no histórico
    const changes = [];
    if (title && title !== ticket.title) {
      changes.push({
        field: 'title',
        oldValue: ticket.title,
        newValue: title,
        changeType: 'update'
      });
    }
    if (status && status !== ticket.status) {
      changes.push({
        field: 'status',
        oldValue: ticket.status,
        newValue: status,
        changeType: 'status_change'
      });
    }
    if (assignedTo && assignedTo !== ticket.assignedTo) {
      changes.push({
        field: 'assignedTo',
        oldValue: ticket.assignedTo,
        newValue: assignedTo,
        changeType: 'assignment'
      });
    }

    // Atualizar chamado
    await ticket.update({
      title,
      description,
      status,
      priority,
      category,
      assignedTo,
      dueDate
    });

    // Registrar histórico de alterações
    if (changes.length > 0) {
      await TicketHistory.bulkCreate(
        changes.map(change => ({
          ...change,
          ticket: ticket.id,
          changedBy: req.user.id
        }))
      );
    }

    const updatedTicket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: require('../models/User'),
          as: 'assignedToUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/User'),
          as: 'createdByUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: require('../models/Company'),
          attributes: ['id', 'name']
        }
      ]
    });

    // Verificar se o status foi alterado
    if (req.body.status && req.body.status !== ticket.status) {
      // Notificar o solicitante sobre a mudança de status
      await notificationController.createNotification(
        ticket.requesterId,
        'Status do chamado atualizado',
        `O status do seu chamado "${ticket.title}" foi alterado para ${req.body.status}.`,
        'info',
        `/tickets/${ticket.id}`
      );
    }

    // Verificar se o prestador foi alterado
    if (req.body.assignedTo && req.body.assignedTo !== ticket.assignedTo) {
      // Notificar o novo prestador
      await notificationController.createNotification(
        req.body.assignedTo,
        'Chamado atribuído',
        `Um chamado "${ticket.title}" foi atribuído a você.`,
        'info',
        `/tickets/${ticket.id}`
      );
    }

    res.json(updatedTicket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   DELETE api/tickets/:id
// @desc    Desativar um chamado
// @access  Private
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: 'Chamado não encontrado' });
    }

    // Registrar histórico
    await TicketHistory.create({
      ticket: ticket.id,
      field: 'delete',
      changeType: 'delete',
      changedBy: req.user.id
    });

    // Desativar chamado (soft delete)
    await ticket.update({ active: false });

    res.json({ msg: 'Chamado desativado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   POST api/tickets/assign
// @desc    Atribuir um chamado
// @access  Private
exports.assignTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.body;

  try {
    // Verificar se o chamado existe
    const ticket = await Ticket.findByPk(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ msg: 'Chamado não encontrado' });
    }

    // Verificar permissão
    if (req.user.userType !== 'admin' && 
        req.user.userType !== 'prestador' && 
        ticket.requesterId !== req.user.id) {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    // Atribuir chamado
    await ticket.update({ assignedToId: userId });

    // Notificar o prestador atribuído
    await notificationController.createNotification(
      userId,
      'Chamado atribuído',
      `Um chamado "${ticket.title}" foi atribuído a você.`,
      'info',
      `/tickets/${ticket.id}`
    );

    // Notificar o solicitante
    await notificationController.createNotification(
      ticket.requesterId,
      'Prestador atribuído',
      `Um prestador foi atribuído ao seu chamado "${ticket.title}".`,
      'info',
      `/tickets/${ticket.id}`
    );

    res.json({ msg: 'Chamado atribuído com sucesso' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Chamado não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
}; 