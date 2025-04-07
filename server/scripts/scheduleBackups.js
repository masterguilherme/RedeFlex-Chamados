const cron = require('node-cron');
const backupService = require('../services/backupService');
const { logger } = require('../config/email');

// Configuração do agendamento
const scheduleConfig = {
  daily: process.env.BACKUP_SCHEDULE_DAILY || '0 0 * * *', // Todo dia à meia-noite
  weekly: process.env.BACKUP_SCHEDULE_WEEKLY || '0 0 * * 0', // Todo domingo à meia-noite
  monthly: process.env.BACKUP_SCHEDULE_MONTHLY || '0 0 1 * *' // Primeiro dia do mês à meia-noite
};

// Função para executar backup
const executeBackup = async (type) => {
  try {
    logger.info(`Iniciando backup ${type} agendado`);
    
    // Cria o backup
    const backupFile = await backupService.backupDatabase();
    
    // Compacta o backup
    const compressedFile = await backupService.compressBackup(backupFile);
    
    // Envia por email se configurado
    if (process.env.BACKUP_EMAIL_RECIPIENTS) {
      const recipients = process.env.BACKUP_EMAIL_RECIPIENTS.split(',');
      await backupService.sendBackupEmail(compressedFile, recipients);
    }
    
    logger.info(`Backup ${type} concluído com sucesso: ${compressedFile}`);
  } catch (error) {
    logger.error(`Erro ao executar backup ${type}:`, error);
  }
};

// Agenda backup diário
cron.schedule(scheduleConfig.daily, () => {
  executeBackup('diário');
});

// Agenda backup semanal
cron.schedule(scheduleConfig.weekly, () => {
  executeBackup('semanal');
});

// Agenda backup mensal
cron.schedule(scheduleConfig.monthly, () => {
  executeBackup('mensal');
});

// Limpa backups antigos semanalmente
cron.schedule('0 0 * * 0', async () => {
  try {
    const maxAge = parseInt(process.env.BACKUP_MAX_AGE_DAYS) || 30;
    await backupService.cleanupOldBackups(maxAge);
    logger.info('Limpeza de backups antigos concluída');
  } catch (error) {
    logger.error('Erro ao limpar backups antigos:', error);
  }
});

// Log de inicialização
logger.info('Agendamento de backups iniciado');
logger.info('Configurações:', scheduleConfig);

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado no agendamento de backups:', error);
});

process.on('unhandledRejection', (error) => {
  logger.error('Promessa rejeitada não tratada no agendamento de backups:', error);
}); 