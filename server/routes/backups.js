const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const backupController = require('../controllers/backupController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Validação para criação de backup
const createBackupValidation = [
  body('compress').optional().isBoolean(),
  body('sendEmail').optional().isBoolean(),
  body('recipients').optional().isArray().withMessage('Recipientes devem ser um array de emails'),
  body('recipients.*').optional().isEmail().withMessage('Email inválido')
];

// Lista todos os backups
router.get('/', backupController.getBackups);

// Cria um novo backup
router.post('/', createBackupValidation, validate, backupController.createBackup);

// Restaura um backup
router.post('/:backupFile/restore', backupController.restoreBackup);

// Verifica a integridade de um backup
router.get('/:backupFile/verify', backupController.verifyBackup);

// Remove backups antigos
router.delete('/cleanup', backupController.cleanupBackups);

// Download de um backup
router.get('/:backupFile/download', backupController.downloadBackup);

module.exports = router; 