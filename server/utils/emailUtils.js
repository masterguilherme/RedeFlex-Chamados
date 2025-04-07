const { logger } = require('../config/email');

// Formata uma lista de emails
const formatEmailList = (emails) => {
  if (!emails) return [];
  if (Array.isArray(emails)) return emails;
  return emails.split(',').map(email => email.trim());
};

// Valida um endereço de email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valida uma lista de emails
const validateEmailList = (emails) => {
  const emailList = formatEmailList(emails);
  return emailList.every(validateEmail);
};

// Remove emails duplicados
const removeDuplicateEmails = (emails) => {
  const emailList = formatEmailList(emails);
  return [...new Set(emailList)];
};

// Formata o assunto do email
const formatSubject = (subject, prefix = '') => {
  if (prefix) {
    return `[${prefix}] ${subject}`;
  }
  return subject;
};

// Gera um ID único para o email
const generateEmailId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Formata o tamanho do anexo
const formatAttachmentSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Valida o tamanho do anexo
const validateAttachmentSize = (bytes, maxSize = 10 * 1024 * 1024) => {
  if (bytes > maxSize) {
    throw new Error(`Anexo muito grande. Tamanho máximo permitido: ${formatAttachmentSize(maxSize)}`);
  }
  return true;
};

// Formata o nome do arquivo anexo
const formatAttachmentName = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
};

// Gera um nome de arquivo único
const generateUniqueFilename = (originalFilename) => {
  const extension = originalFilename.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${random}.${extension}`;
};

// Formata o contexto do email
const formatEmailContext = (context) => {
  return {
    ...context,
    currentYear: new Date().getFullYear(),
    timestamp: new Date().toISOString()
  };
};

// Log de tentativa de envio
const logEmailAttempt = (emailData, success = true) => {
  const logData = {
    timestamp: new Date().toISOString(),
    to: emailData.to,
    subject: emailData.subject,
    template: emailData.template,
    success,
    messageId: emailData.messageId
  };

  if (success) {
    logger.info('Tentativa de envio de email bem-sucedida', logData);
  } else {
    logger.error('Falha na tentativa de envio de email', logData);
  }
};

module.exports = {
  formatEmailList,
  validateEmail,
  validateEmailList,
  removeDuplicateEmails,
  formatSubject,
  generateEmailId,
  formatAttachmentSize,
  validateAttachmentSize,
  formatAttachmentName,
  generateUniqueFilename,
  formatEmailContext,
  logEmailAttempt
}; 