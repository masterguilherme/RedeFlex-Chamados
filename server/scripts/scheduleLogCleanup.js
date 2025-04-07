const cron = require('node-cron');
const logService = require('../services/logService');

// Configuração do agendamento
const scheduleConfig = {
  daily: process.env.LOG_CLEANUP_SCHEDULE || '0 0 * * *' // Todo dia à meia-noite
};

// Função para executar limpeza
const executeCleanup = async () => {
  try {
    const maxAge = parseInt(process.env.LOG_MAX_AGE_DAYS) || 30;
    await logService.cleanupOldLogs(maxAge);
    logService.logger.info('Limpeza de logs antigos concluída');
  } catch (error) {
    logService.logError(error);
  }
};

// Agenda limpeza diária
cron.schedule(scheduleConfig.daily, executeCleanup);

// Log de inicialização
logService.logger.info('Agendamento de limpeza de logs iniciado');
logService.logger.info('Configurações:', scheduleConfig);

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logService.logError(error);
});

process.on('unhandledRejection', (error) => {
  logService.logError(error);
}); 