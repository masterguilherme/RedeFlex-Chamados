const backupService = require('../services/backupService');
const { logger } = require('../config/email');
const path = require('path');
const fs = require('fs');

// Lista todos os backups disponíveis
exports.getBackups = async (req, res) => {
  try {
    const backups = await backupService.listBackups();
    res.json(backups);
  } catch (error) {
    logger.error('Erro ao listar backups:', error);
    res.status(500).json({ error: 'Erro ao listar backups' });
  }
};

// Cria um novo backup
exports.createBackup = async (req, res) => {
  try {
    const { compress = true, sendEmail = false, recipients } = req.body;

    // Cria o backup do banco de dados
    const backupFile = await backupService.backupDatabase();

    // Compacta o backup se solicitado
    const finalFile = compress ? await backupService.compressBackup(backupFile) : backupFile;

    // Envia por email se solicitado
    if (sendEmail && recipients) {
      await backupService.sendBackupEmail(finalFile, recipients);
    }

    // Remove backups antigos
    await backupService.cleanupOldBackups();

    res.json({ 
      message: 'Backup criado com sucesso',
      file: finalFile
    });
  } catch (error) {
    logger.error('Erro ao criar backup:', error);
    res.status(500).json({ error: 'Erro ao criar backup' });
  }
};

// Restaura um backup
exports.restoreBackup = async (req, res) => {
  try {
    const { backupFile } = req.params;

    // Verifica a integridade do backup
    const isValid = await backupService.verifyBackup(backupFile);
    if (!isValid) {
      return res.status(400).json({ error: 'Backup inválido ou corrompido' });
    }

    // Restaura o backup
    await backupService.restoreDatabase(backupFile);

    res.json({ message: 'Backup restaurado com sucesso' });
  } catch (error) {
    logger.error('Erro ao restaurar backup:', error);
    res.status(500).json({ error: 'Erro ao restaurar backup' });
  }
};

// Verifica a integridade de um backup
exports.verifyBackup = async (req, res) => {
  try {
    const { backupFile } = req.params;
    const isValid = await backupService.verifyBackup(backupFile);
    
    res.json({ 
      isValid,
      message: isValid ? 'Backup válido' : 'Backup inválido ou corrompido'
    });
  } catch (error) {
    logger.error('Erro ao verificar backup:', error);
    res.status(500).json({ error: 'Erro ao verificar backup' });
  }
};

// Remove backups antigos
exports.cleanupBackups = async (req, res) => {
  try {
    const { maxAge = 7 } = req.body;
    await backupService.cleanupOldBackups(maxAge);
    
    res.json({ message: 'Backups antigos removidos com sucesso' });
  } catch (error) {
    logger.error('Erro ao limpar backups:', error);
    res.status(500).json({ error: 'Erro ao limpar backups' });
  }
};

// Download de um backup
exports.downloadBackup = async (req, res) => {
  try {
    const { backupFile } = req.params;
    const filepath = path.join(backupService.backupDir, backupFile);

    // Verifica se o arquivo existe
    await fs.access(filepath);

    // Envia o arquivo
    res.download(filepath);
  } catch (error) {
    logger.error('Erro ao baixar backup:', error);
    res.status(404).json({ error: 'Backup não encontrado' });
  }
}; 