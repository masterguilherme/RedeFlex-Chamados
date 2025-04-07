const logService = require('../services/logService');
const { validationResult } = require('express-validator');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const path = require('path');
const fs = require('fs').promises;

// Obtém logs por tipo
exports.getLogs = async (req, res) => {
  try {
    const { type = 'application', startDate, endDate, limit } = req.query;
    
    const logs = await logService.getLogs(
      type,
      new Date(startDate),
      new Date(endDate),
      parseInt(limit)
    );

    res.json(logs);
  } catch (error) {
    logService.logError(error, req);
    res.status(500).json({ error: 'Erro ao obter logs' });
  }
};

// Obtém estatísticas de logs
exports.getLogStats = async (req, res) => {
  try {
    const { type = 'application', period = '24h' } = req.query;
    
    const stats = await logService.getLogStats(type, period);
    res.json(stats);
  } catch (error) {
    logService.logError(error, req);
    res.status(500).json({ error: 'Erro ao obter estatísticas de logs' });
  }
};

// Limpa logs antigos
exports.cleanupLogs = async (req, res) => {
  try {
    const { maxAge = 30 } = req.body;
    
    await logService.cleanupOldLogs(maxAge);
    res.json({ message: 'Logs antigos removidos com sucesso' });
  } catch (error) {
    logService.logError(error, req);
    res.status(500).json({ error: 'Erro ao limpar logs' });
  }
};

// Middleware para log de acesso
exports.logAccess = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logService.logAccess(req, res, duration);
  });
  
  next();
};

// Middleware para log de erros
exports.logError = (error, req, res, next) => {
  logService.logError(error, req);
  next(error);
};

// Exporta logs
exports.exportLogs = async (req, res) => {
  try {
    const { type = 'application', startDate, endDate, format = 'csv' } = req.query;
    
    const logs = await logService.getLogs(type, new Date(startDate), new Date(endDate));

    switch (format.toLowerCase()) {
      case 'csv':
        const parser = new Parser({
          fields: ['timestamp', 'level', 'message']
        });
        const csv = parser.parse(logs);
        res.header('Content-Type', 'text/csv');
        res.attachment(`logs_${type}_${new Date().toISOString().split('T')[0]}.csv`);
        return res.send(csv);

      case 'xlsx':
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Logs');
        
        worksheet.columns = [
          { header: 'Data/Hora', key: 'timestamp' },
          { header: 'Nível', key: 'level' },
          { header: 'Mensagem', key: 'message' },
          { header: 'Detalhes', key: 'metadata' }
        ];

        logs.forEach(log => {
          worksheet.addRow({
            timestamp: new Date(log.timestamp).toLocaleString(),
            level: log.level,
            message: log.message,
            metadata: JSON.stringify(log.metadata)
          });
        });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment(`logs_${type}_${new Date().toISOString().split('T')[0]}.xlsx`);
        return workbook.xlsx.write(res);

      case 'pdf':
        const doc = new PDFDocument();
        res.header('Content-Type', 'application/pdf');
        res.attachment(`logs_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
        doc.pipe(res);

        // Cabeçalho
        doc.fontSize(16).text('Relatório de Logs', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Tipo: ${type}`);
        doc.text(`Período: ${new Date(startDate).toLocaleDateString()} a ${new Date(endDate).toLocaleDateString()}`);
        doc.moveDown();

        // Tabela
        let y = doc.y;
        const rowHeight = 20;
        const columns = {
          timestamp: { x: 50, width: 150 },
          level: { x: 200, width: 80 },
          message: { x: 280, width: 270 }
        };

        // Cabeçalho da tabela
        doc.font('Helvetica-Bold');
        doc.text('Data/Hora', columns.timestamp.x, y);
        doc.text('Nível', columns.level.x, y);
        doc.text('Mensagem', columns.message.x, y);
        y += rowHeight;

        // Dados
        doc.font('Helvetica');
        logs.forEach(log => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
          doc.text(new Date(log.timestamp).toLocaleString(), columns.timestamp.x, y, {
            width: columns.timestamp.width
          });
          doc.text(log.level, columns.level.x, y, {
            width: columns.level.width
          });
          doc.text(log.message, columns.message.x, y, {
            width: columns.message.width
          });
          y += rowHeight;
        });

        doc.end();
        return;

      case 'json':
        res.header('Content-Type', 'application/json');
        res.attachment(`logs_${type}_${new Date().toISOString().split('T')[0]}.json`);
        return res.json(logs);

      default:
        return res.status(400).json({ error: 'Formato não suportado' });
    }
  } catch (error) {
    logService.logError(error, req);
    res.status(500).json({ error: 'Erro ao exportar logs' });
  }
}; 