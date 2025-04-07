const NotificationService = require('../services/notificationService');
const { validationResult } = require('express-validator');

// @route   GET api/notifications
// @desc    Obter todas as notificações do usuário
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    console.error('Erro ao buscar notificações:', err);
    res.status(500).json({ msg: 'Erro ao buscar notificações' });
  }
};

// @route   GET api/notifications/unread
// @desc    Obter notificações não lidas do usuário
// @access  Private
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getUnreadNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    console.error('Erro ao buscar notificações não lidas:', err);
    res.status(500).json({ msg: 'Erro ao buscar notificações não lidas' });
  }
};

// @route   POST api/notifications
// @desc    Criar uma nova notificação
// @access  Private
exports.createNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const notification = await NotificationService.createNotification({
      ...req.body,
      userId: req.body.userId || req.user.id
    });
    res.json(notification);
  } catch (err) {
    console.error('Erro ao criar notificação:', err);
    res.status(500).json({ msg: 'Erro ao criar notificação' });
  }
};

// @route   POST api/notifications/bulk
// @desc    Criar notificações para múltiplos usuários
// @access  Private
exports.createNotificationForUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const notifications = await NotificationService.createNotificationForUsers(req.body);
    res.json(notifications);
  } catch (err) {
    console.error('Erro ao criar notificações em massa:', err);
    res.status(500).json({ msg: 'Erro ao criar notificações em massa' });
  }
};

// @route   PUT api/notifications/:id/read
// @desc    Marcar uma notificação como lida
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id,
      req.user.id
    );
    res.json(notification);
  } catch (err) {
    if (err.message === 'Notificação não encontrada') {
      return res.status(404).json({ msg: 'Notificação não encontrada' });
    }
    console.error('Erro ao marcar notificação como lida:', err);
    res.status(500).json({ msg: 'Erro ao marcar notificação como lida' });
  }
};

// @route   PUT api/notifications/read-all
// @desc    Marcar todas as notificações do usuário como lidas
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const updatedCount = await NotificationService.markAllAsRead(req.user.id);
    res.json({ 
      msg: 'Todas as notificações foram marcadas como lidas',
      updatedCount
    });
  } catch (err) {
    console.error('Erro ao marcar todas as notificações como lidas:', err);
    res.status(500).json({ msg: 'Erro ao marcar todas as notificações como lidas' });
  }
};

// @route   DELETE api/notifications/:id
// @desc    Excluir uma notificação
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await NotificationService.deleteNotification(
      req.params.id,
      req.user.id
    );

    if (!deleted) {
      return res.status(404).json({ msg: 'Notificação não encontrada' });
    }

    res.json({ msg: 'Notificação removida' });
  } catch (err) {
    console.error('Erro ao excluir notificação:', err);
    res.status(500).json({ msg: 'Erro ao excluir notificação' });
  }
}; 