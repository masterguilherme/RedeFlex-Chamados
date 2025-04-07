const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../config/email');
const { transporter } = require('../config/email');

class BackupService {
  constructor() {
    this.backupDir = path.join(__dirname, '../../backups');
    this.dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    };
  }

  // Cria o diretório de backups se não existir
  async ensureBackupDir() {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
    }
  }

  // Gera um nome de arquivo único para o backup
  generateBackupFilename(type) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${type}_${timestamp}.sql`;
  }

  // Executa o backup do banco de dados
  async backupDatabase() {
    try {
      await this.ensureBackupDir();
      const filename = this.generateBackupFilename('db');
      const filepath = path.join(this.backupDir, filename);

      // Comando para backup do PostgreSQL
      const command = `pg_dump -h ${this.dbConfig.host} -U ${this.dbConfig.user} -d ${this.dbConfig.database} -F c -f ${filepath}`;
      
      // Define a senha do banco como variável de ambiente
      process.env.PGPASSWORD = this.dbConfig.password;

      await execAsync(command);
      logger.info(`Backup do banco de dados criado com sucesso: ${filename}`);
      return filepath;
    } catch (error) {
      logger.error('Erro ao criar backup do banco de dados:', error);
      throw error;
    }
  }

  // Compacta um arquivo de backup
  async compressBackup(filepath) {
    try {
      const compressedFilepath = `${filepath}.gz`;
      const command = `gzip -9 ${filepath}`;
      await execAsync(command);
      logger.info(`Backup compactado com sucesso: ${compressedFilepath}`);
      return compressedFilepath;
    } catch (error) {
      logger.error('Erro ao compactar backup:', error);
      throw error;
    }
  }

  // Remove backups antigos
  async cleanupOldBackups(maxAge = 7) {
    try {
      const files = await fs.readdir(this.backupDir);
      const now = new Date();

      for (const file of files) {
        const filepath = path.join(this.backupDir, file);
        const stats = await fs.stat(filepath);
        const age = (now - stats.mtime) / (1000 * 60 * 60 * 24);

        if (age > maxAge) {
          await fs.unlink(filepath);
          logger.info(`Backup antigo removido: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Erro ao limpar backups antigos:', error);
      throw error;
    }
  }

  // Envia backup por email
  async sendBackupEmail(filepath, recipients) {
    try {
      const filename = path.basename(filepath);
      const fileSize = (await fs.stat(filepath)).size;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: recipients,
        subject: `Backup do Sistema - ${new Date().toLocaleDateString()}`,
        text: `Segue em anexo o backup do sistema gerado em ${new Date().toLocaleString()}`,
        attachments: [{
          filename,
          path: filepath
        }]
      });

      logger.info(`Backup enviado por email com sucesso: ${filename}`);
    } catch (error) {
      logger.error('Erro ao enviar backup por email:', error);
      throw error;
    }
  }

  // Restaura um backup do banco de dados
  async restoreDatabase(backupFile) {
    try {
      const command = `pg_restore -h ${this.dbConfig.host} -U ${this.dbConfig.user} -d ${this.dbConfig.database} -c ${backupFile}`;
      process.env.PGPASSWORD = this.dbConfig.password;
      
      await execAsync(command);
      logger.info(`Backup restaurado com sucesso: ${backupFile}`);
    } catch (error) {
      logger.error('Erro ao restaurar backup:', error);
      throw error;
    }
  }

  // Lista todos os backups disponíveis
  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = [];

      for (const file of files) {
        const filepath = path.join(this.backupDir, file);
        const stats = await fs.stat(filepath);
        
        backups.push({
          filename: file,
          path: filepath,
          size: stats.size,
          createdAt: stats.mtime,
          type: file.startsWith('db_') ? 'database' : 'files'
        });
      }

      return backups.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      logger.error('Erro ao listar backups:', error);
      throw error;
    }
  }

  // Verifica a integridade de um backup
  async verifyBackup(filepath) {
    try {
      const command = `pg_restore -l ${filepath}`;
      await execAsync(command);
      logger.info(`Backup verificado com sucesso: ${filepath}`);
      return true;
    } catch (error) {
      logger.error('Erro ao verificar backup:', error);
      return false;
    }
  }
}

module.exports = new BackupService(); 