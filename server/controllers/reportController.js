const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Company = require('../models/Company');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const reportService = require('../services/reportService');
const Report = require('../models/Report');
const fs = require('fs');

// @desc    Gerar relatório de chamados por período
// @route   GET /api/reports/tickets
// @access  Private (Admin)
exports.getTicketsReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate, status, priority, companyId } = req.query;
    
    // Construir filtros para a consulta
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }
    
    if (companyId) {
      whereClause.companyId = companyId;
    }

    // Buscar chamados com os filtros aplicados
    const tickets = await Ticket.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: Company, attributes: ['id', 'name', 'cnpj'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calcular estatísticas
    const totalTickets = tickets.length;
    const ticketsByStatus = {};
    const ticketsByPriority = {};
    const ticketsByCompany = {};
    const ticketsByMonth = {};
    
    tickets.forEach(ticket => {
      // Contagem por status
      ticketsByStatus[ticket.status] = (ticketsByStatus[ticket.status] || 0) + 1;
      
      // Contagem por prioridade
      ticketsByPriority[ticket.priority] = (ticketsByPriority[ticket.priority] || 0) + 1;
      
      // Contagem por empresa
      if (ticket.company) {
        const companyName = ticket.company.name;
        ticketsByCompany[companyName] = (ticketsByCompany[companyName] || 0) + 1;
      }
      
      // Contagem por mês
      const month = new Date(ticket.createdAt).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      ticketsByMonth[month] = (ticketsByMonth[month] || 0) + 1;
    });

    // Calcular tempo médio de resolução
    const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolvido' && ticket.closedAt);
    let avgResolutionTime = 0;
    
    if (resolvedTickets.length > 0) {
      const totalResolutionTime = resolvedTickets.reduce((total, ticket) => {
        const resolutionTime = new Date(ticket.closedAt) - new Date(ticket.createdAt);
        return total + resolutionTime;
      }, 0);
      
      avgResolutionTime = totalResolutionTime / resolvedTickets.length;
    }

    res.json({
      totalTickets,
      ticketsByStatus,
      ticketsByPriority,
      ticketsByCompany,
      ticketsByMonth,
      avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60)), // Converter para horas
      tickets
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao gerar relatório de chamados' });
  }
};

// @desc    Gerar relatório de desempenho por prestador
// @route   GET /api/reports/performance
// @access  Private (Admin)
exports.getPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Construir filtros para a consulta
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Buscar todos os prestadores
    const providers = await User.findAll({
      where: { type: 'prestador' },
      attributes: ['id', 'name', 'email']
    });

    // Calcular métricas para cada prestador
    const performanceData = await Promise.all(providers.map(async (provider) => {
      // Buscar chamados atribuídos ao prestador
      const assignedTickets = await Ticket.findAll({
        where: {
          ...whereClause,
          assignedToId: provider.id
        }
      });

      const totalAssigned = assignedTickets.length;
      const resolvedTickets = assignedTickets.filter(ticket => ticket.status === 'resolvido');
      const totalResolved = resolvedTickets.length;
      
      // Calcular taxa de resolução
      const resolutionRate = totalAssigned > 0 ? (totalResolved / totalAssigned) * 100 : 0;
      
      // Calcular tempo médio de resolução
      let avgResolutionTime = 0;
      
      if (resolvedTickets.length > 0) {
        const totalResolutionTime = resolvedTickets.reduce((total, ticket) => {
          const resolutionTime = new Date(ticket.closedAt) - new Date(ticket.createdAt);
          return total + resolutionTime;
        }, 0);
        
        avgResolutionTime = totalResolutionTime / resolvedTickets.length;
      }

      // Contar chamados por prioridade
      const ticketsByPriority = {};
      assignedTickets.forEach(ticket => {
        ticketsByPriority[ticket.priority] = (ticketsByPriority[ticket.priority] || 0) + 1;
      });

      return {
        provider: {
          id: provider.id,
          name: provider.name,
          email: provider.email
        },
        totalAssigned,
        totalResolved,
        resolutionRate: Math.round(resolutionRate * 100) / 100,
        avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60)), // Converter para horas
        ticketsByPriority
      };
    }));

    res.json(performanceData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao gerar relatório de desempenho' });
  }
};

// @desc    Exportar dados de chamados para CSV
// @route   GET /api/reports/export
// @access  Private (Admin)
exports.exportTickets = async (req, res) => {
  try {
    const { startDate, endDate, status, priority, companyId } = req.query;
    
    // Construir filtros para a consulta
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }
    
    if (companyId) {
      whereClause.companyId = companyId;
    }

    // Buscar chamados com os filtros aplicados
    const tickets = await Ticket.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: Company, attributes: ['id', 'name', 'cnpj'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Converter para formato CSV
    const csvHeader = 'ID,Título,Descrição,Status,Prioridade,Categoria,Solicitante,Atribuído para,Empresa,Data de Criação,Data de Fechamento\n';
    
    const csvRows = tickets.map(ticket => {
      const requesterName = ticket.requester ? ticket.requester.name : 'N/A';
      const assignedToName = ticket.assignedTo ? ticket.assignedTo.name : 'N/A';
      const companyName = ticket.company ? ticket.company.name : 'N/A';
      const createdAt = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString('pt-BR') : 'N/A';
      const closedAt = ticket.closedAt ? new Date(ticket.closedAt).toLocaleString('pt-BR') : 'N/A';
      
      // Escapar aspas e vírgulas no conteúdo
      const escapedDescription = ticket.description.replace(/"/g, '""');
      
      return `${ticket.id},"${ticket.title}","${escapedDescription}",${ticket.status},${ticket.priority},${ticket.category},${requesterName},${assignedToName},${companyName},${createdAt},${closedAt}`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    // Configurar cabeçalhos para download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=chamados.csv');
    
    res.send(csvContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao exportar dados de chamados' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: {
        active: true,
        createdBy: req.user.id
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(reports);
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    res.status(500).json({ message: 'Erro ao buscar relatórios' });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      where: {
        id: req.params.id,
        active: true,
        createdBy: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    res.json(report);
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    res.status(500).json({ message: 'Erro ao buscar relatório' });
  }
};

exports.createReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const report = await Report.create({
      ...req.body,
      createdBy: req.user.id
    });

    // Se o relatório tiver agendamento, configura o agendamento
    if (report.schedule) {
      await reportService.scheduleReport(report);
    }

    res.status(201).json(report);
  } catch (error) {
    console.error('Erro ao criar relatório:', error);
    res.status(500).json({ message: 'Erro ao criar relatório' });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const report = await Report.findOne({
      where: {
        id: req.params.id,
        active: true,
        createdBy: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    await report.update(req.body);

    // Se o agendamento foi alterado, atualiza o agendamento
    if (req.body.schedule) {
      await reportService.scheduleReport(report);
    }

    res.json(report);
  } catch (error) {
    console.error('Erro ao atualizar relatório:', error);
    res.status(500).json({ message: 'Erro ao atualizar relatório' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      where: {
        id: req.params.id,
        active: true,
        createdBy: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    await report.update({ active: false });
    res.json({ message: 'Relatório removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover relatório:', error);
    res.status(500).json({ message: 'Erro ao remover relatório' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      where: {
        id: req.params.id,
        active: true,
        createdBy: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Relatório não encontrado' });
    }

    const data = await reportService.generateReportData(report);
    const filePath = await reportService.generateReportFile(data, report);

    // Envia o arquivo como resposta
    res.download(filePath, `report-${Date.now()}.${report.format}`, (err) => {
      if (err) {
        console.error('Erro ao enviar arquivo:', err);
      }
      // Remove o arquivo temporário após o envio
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erro ao remover arquivo temporário:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
};

exports.getReportMetrics = async (req, res) => {
  try {
    const metrics = await reportService.generatePerformanceReport(req.query);
    res.json(metrics);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    res.status(500).json({ message: 'Erro ao buscar métricas' });
  }
}; 