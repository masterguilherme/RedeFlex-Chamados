const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const companyRoutes = require('./companies');
const ticketRoutes = require('./tickets');
const commentRoutes = require('./comments');
const ticketHistoryRoutes = require('./ticketHistory');
const notificationRoutes = require('./notifications');
const reportRoutes = require('./reports');
const backupRoutes = require('./backups');
const logRoutes = require('./logs');

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas privadas
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/tickets', ticketRoutes);
router.use('/comments', commentRoutes);
router.use('/ticket-history', ticketHistoryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);

// Rotas de backup
router.use('/backups', backupRoutes);
router.use('/logs', logRoutes);

module.exports = router; 