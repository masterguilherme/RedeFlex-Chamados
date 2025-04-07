const winston = require('winston');
const path = require('path');
const fs = require('fs').promises;
const { format } = winston;
const { combine, timestamp, printf, colorize, json } = format;

class LogService {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.maxLogSize = 10 * 1024 * 1024; // 10MB
    this.maxLogFiles = 5;
    this.initializeLogger();
  }

  // Inicializa o logger com diferentes transportes
  initializeLogger() {
    // Formato personalizado para logs
    const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    });

    // Configuração do logger
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(
        timestamp(),
        json()
      ),
      transports: [
        // Logs de erro
        new winston.transports.File({
          filename: path.join(this.logDir, 'error.log'),
          level: 'error',
          maxsize: this.maxLogSize,
          maxFiles: this.maxLogFiles,
          format: combine(
            timestamp(),
            logFormat
          )
        }),
        // Logs de acesso
        new winston.transports.File({
          filename: path.join(this.logDir, 'access.log'),
          level: 'info',
          maxsize: this.maxLogSize,
          maxFiles: this.maxLogFiles,
          format: combine(
            timestamp(),
            logFormat
          )
        }),
        // Logs de aplicação
        new winston.transports.File({
          filename: path.join(this.logDir, 'application.log'),
          maxsize: this.maxLogSize,
          maxFiles: this.maxLogFiles,
          format: combine(
            timestamp(),
            logFormat
          )
        })
      ]
    });

    // Adiciona console em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: combine(
          colorize(),
          timestamp(),
          logFormat
        )
      }));
    }
  }

  // Log de acesso HTTP
  logAccess(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id
    };

    this.logger.info('HTTP Access', logData);
  }

  // Log de erro
  logError(error, req = null) {
    const logData = {
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      }
    };

    if (req) {
      logData.request = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userId: req.user?.id
      };
    }

    this.logger.error('Application Error', logData);
  }

  // Log de operação do banco de dados
  logDatabase(operation, details) {
    const logData = {
      operation,
      ...details
    };

    this.logger.info('Database Operation', logData);
  }

  // Log de autenticação
  logAuth(action, userId, success, details = {}) {
    const logData = {
      action,
      userId,
      success,
      ...details
    };

    this.logger.info('Authentication', logData);
  }

  // Log de backup
  logBackup(action, details) {
    const logData = {
      action,
      ...details
    };

    this.logger.info('Backup Operation', logData);
  }

  // Log de email
  logEmail(action, details) {
    const logData = {
      action,
      ...details
    };

    this.logger.info('Email Operation', logData);
  }

  // Log de segurança
  logSecurity(action, details) {
    const logData = {
      action,
      ...details
    };

    this.logger.info('Security Event', logData);
  }

  // Obtém logs por tipo e período
  async getLogs(type, startDate, endDate, limit = 100) {
    try {
      const logFile = path.join(this.logDir, `${type}.log`);
      const logs = await this.readLogFile(logFile, startDate, endDate, limit);
      return logs;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  // Lê arquivo de log com filtros
  async readLogFile(filePath, startDate, endDate, limit) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      const logs = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => {
          if (!log) return false;
          const logDate = new Date(log.timestamp);
          return logDate >= startDate && logDate <= endDate;
        })
        .slice(-limit);

      return logs;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  // Obtém estatísticas de logs
  async getLogStats(type, period = '24h') {
    try {
      const logFile = path.join(this.logDir, `${type}.log`);
      const content = await fs.readFile(logFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      const now = new Date();
      const startDate = new Date(now - this.getPeriodMs(period));
      
      const logs = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => {
          if (!log) return false;
          const logDate = new Date(log.timestamp);
          return logDate >= startDate;
        });

      return {
        total: logs.length,
        byLevel: this.groupByLevel(logs),
        byHour: this.groupByHour(logs),
        errors: logs.filter(log => log.level === 'error').length
      };
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  // Agrupa logs por nível
  groupByLevel(logs) {
    return logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {});
  }

  // Agrupa logs por hora
  groupByHour(logs) {
    return logs.reduce((acc, log) => {
      const hour = new Date(log.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
  }

  // Converte período em milissegundos
  getPeriodMs(period) {
    const periods = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return periods[period] || periods['24h'];
  }

  // Limpa logs antigos
  async cleanupOldLogs(maxAge = 30) {
    try {
      const files = await fs.readdir(this.logDir);
      const now = new Date();

      for (const file of files) {
        const filePath = path.join(this.logDir, file);
        const stats = await fs.stat(filePath);
        const age = (now - stats.mtime) / (1000 * 60 * 60 * 24);

        if (age > maxAge) {
          await fs.unlink(filePath);
          this.logger.info('Old log file deleted', { file, age });
        }
      }
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}

module.exports = new LogService(); 