const { transporter, logger } = require('../config/email');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const Queue = require('bull');

// Configuração da fila de emails
const emailQueue = new Queue('email-queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// Cache de templates
const templateCache = new Map();

// Carrega um template
const loadTemplate = async (templateName) => {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  try {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    templateCache.set(templateName, template);
    return template;
  } catch (error) {
    logger.error(`Erro ao carregar template ${templateName}:`, error);
    throw error;
  }
};

// Envia um email
const sendEmail = async (options) => {
  const {
    to,
    subject,
    template,
    context,
    attachments = []
  } = options;

  try {
    // Carrega o template
    const templateFn = await loadTemplate(template);
    
    // Renderiza o conteúdo
    const html = templateFn(context);

    // Configura o email
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      attachments
    };

    // Envia o email
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email enviado com sucesso: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Erro ao enviar email:', error);
    throw error;
  }
};

// Adiciona um email à fila
const queueEmail = async (options) => {
  try {
    const job = await emailQueue.add(options);
    logger.info(`Email adicionado à fila: ${job.id}`);
    return job;
  } catch (error) {
    logger.error('Erro ao adicionar email à fila:', error);
    throw error;
  }
};

// Processa a fila de emails
emailQueue.process(async (job) => {
  try {
    await sendEmail(job.data);
  } catch (error) {
    logger.error(`Erro ao processar email da fila ${job.id}:`, error);
    throw error;
  }
});

// Tratamento de erros da fila
emailQueue.on('error', (error) => {
  logger.error('Erro na fila de emails:', error);
});

emailQueue.on('failed', (job, error) => {
  logger.error(`Falha no processamento do email ${job.id}:`, error);
});

// Métricas da fila
const getQueueMetrics = async () => {
  const [waiting, active, completed, failed] = await Promise.all([
    emailQueue.getWaitingCount(),
    emailQueue.getActiveCount(),
    emailQueue.getCompletedCount(),
    emailQueue.getFailedCount()
  ]);

  return {
    waiting,
    active,
    completed,
    failed
  };
};

module.exports = {
  sendEmail,
  queueEmail,
  getQueueMetrics
}; 