const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Validações
const notificationValidation = [
  check('title', 'Título é obrigatório').not().isEmpty(),
  check('message', 'Mensagem é obrigatória').not().isEmpty(),
  check('type', 'Tipo inválido').isIn(['ticket', 'comment', 'warning', 'success', 'info']),
  check('userId', 'ID do usuário é obrigatório').isInt()
];

// Rotas
router.get('/', notificationController.getNotifications);
router.get('/unread', notificationController.getUnreadNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.post('/', notificationValidation, notificationController.createNotification);
router.post('/bulk', notificationValidation, notificationController.createNotificationForUsers);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router; 