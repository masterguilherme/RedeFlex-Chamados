const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Company = require('../models/Company');
const Report = require('../models/Report');

class ReportService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async generateTicketReport(filters) {
    const where = {
      active: true,
      ...filters
    };

    const tickets = await Ticket.findAll({
      where,
      include: [
        { model: User, as: 'createdByUser', attributes: ['name', 'email'] },
        { model: User, as: 'assignedToUser', attributes: ['name', 'email'] },
        { model: Company, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return tickets;
  }

  async generatePerformanceReport(filters) {
    const where = {
      active: true,
      ...filters
    };

    const tickets = await Ticket.findAll({
      where,
      include: [
        { model: User, as: 'assignedToUser', attributes: ['name', 'email'] }
      ]
    });

    const performance = tickets.reduce((acc, ticket) => {
      const provider = ticket.assignedToUser.name;
      if (!acc[provider]) {
        acc[provider] = {
          total: 0,
          resolved: 0,
          avgTime: 0,
          urgent: 0
        };
      }

      acc[provider].total++;
      if (ticket.status === 'fechado') {
        acc[provider].resolved++;
        const resolutionTime = new Date(ticket.closedAt) - new Date(ticket.createdAt);
        acc[provider].avgTime += resolutionTime;
      }
      if (ticket.priority === 'urgente') {
        acc[provider].urgent++;
      }

      return acc;
    }, {});

    return performance;
  }

  async generateExcelReport(data, fields) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    // Adiciona cabeçalhos
    worksheet.columns = fields.map(field => ({
      header: field.label,
      key: field.key,
      width: 15
    }));

    // Adiciona dados
    data.forEach(item => {
      worksheet.addRow(item);
    });

    // Gera arquivo temporário
    const tempPath = path.join(__dirname, '../temp', `report-${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(tempPath);

    return tempPath;
  }

  async generatePDFReport(data, fields) {
    const doc = new PDFDocument();
    const tempPath = path.join(__dirname, '../temp', `report-${Date.now()}.pdf`);
    doc.pipe(fs.createWriteStream(tempPath));

    // Adiciona cabeçalho
    doc.fontSize(16).text('Relatório', { align: 'center' });
    doc.moveDown();

    // Adiciona data
    doc.fontSize(12).text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`);
    doc.moveDown();

    // Adiciona tabela
    const tableTop = doc.y;
    let currentTop = tableTop;

    // Cabeçalhos da tabela
    fields.forEach((field, i) => {
      const x = i * 150;
      doc.text(field.label, x, currentTop);
    });

    currentTop += 20;

    // Dados da tabela
    data.forEach(item => {
      fields.forEach((field, i) => {
        const x = i * 150;
        doc.text(String(item[field.key] || ''), x, currentTop);
      });
      currentTop += 20;
    });

    doc.end();
    return tempPath;
  }

  async sendReportEmail(recipients, filePath, reportName) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipients.join(', '),
      subject: `Relatório: ${reportName}`,
      text: `Segue em anexo o relatório "${reportName}" gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.`,
      attachments: [{
        filename: path.basename(filePath),
        path: filePath
      }]
    };

    await this.transporter.sendMail(mailOptions);
  }

  async scheduleReport(report) {
    if (!report.schedule) return;

    const { frequency, time } = report.schedule;
    const cronExpression = this.getCronExpression(frequency, time);

    cron.schedule(cronExpression, async () => {
      try {
        const data = await this.generateReportData(report);
        const filePath = await this.generateReportFile(data, report);
        await this.sendReportEmail(report.recipients, filePath, report.name);
        
        // Atualiza última geração
        await Report.update(
          { lastGenerated: new Date() },
          { where: { id: report.id } }
        );
      } catch (error) {
        console.error('Erro ao gerar relatório agendado:', error);
      }
    });
  }

  getCronExpression(frequency, time) {
    const [hours, minutes] = time.split(':');
    
    switch (frequency) {
      case 'daily':
        return `${minutes} ${hours} * * *`;
      case 'weekly':
        return `${minutes} ${hours} * * 1`;
      case 'monthly':
        return `${minutes} ${hours} 1 * *`;
      default:
        return null;
    }
  }

  async generateReportData(report) {
    switch (report.type) {
      case 'ticket':
        return this.generateTicketReport(report.filters);
      case 'performance':
        return this.generatePerformanceReport(report.filters);
      case 'satisfaction':
        return this.generateSatisfactionReport(report.filters);
      default:
        throw new Error('Tipo de relatório não suportado');
    }
  }

  async generateReportFile(data, report) {
    switch (report.format) {
      case 'excel':
        return this.generateExcelReport(data, report.fields);
      case 'pdf':
        return this.generatePDFReport(data, report.fields);
      case 'csv':
        return this.generateCSVReport(data, report.fields);
      default:
        throw new Error('Formato de relatório não suportado');
    }
  }
}

module.exports = new ReportService(); 