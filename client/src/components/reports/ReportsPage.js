import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Divider
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetApp as DownloadIcon } from '@material-ui/icons';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Função para traduzir o status do chamado
const translateStatus = (status) => {
  const statusMap = {
    'aberto': 'Aberto',
    'em_andamento': 'Em Andamento',
    'aguardando': 'Aguardando',
    'resolvido': 'Resolvido',
    'fechado': 'Fechado',
    'cancelado': 'Cancelado'
  };
  return statusMap[status] || status;
};

// Função para traduzir a prioridade do chamado
const translatePriority = (priority) => {
  const priorityMap = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta',
    'urgente': 'Urgente'
  };
  return priorityMap[priority] || priority;
};

// Componente para o relatório de chamados
const TicketsReport = ({ startDate, endDate, onDateChange, onExport }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      loadReport();
    }
  }, [startDate, endDate, statusFilter, priorityFilter, companyFilter]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/reports/tickets?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      
      if (statusFilter) url += `&status=${statusFilter}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;
      if (companyFilter) url += `&companyId=${companyFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar relatório');
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    let url = `/api/reports/export?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    
    if (statusFilter) url += `&status=${statusFilter}`;
    if (priorityFilter) url += `&priority=${priorityFilter}`;
    if (companyFilter) url += `&companyId=${companyFilter}`;

    onExport(url);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (!reportData) {
    return (
      <Box p={3}>
        <Typography variant="body1">
          Selecione um período para gerar o relatório.
        </Typography>
      </Box>
    );
  }

  // Preparar dados para os gráficos
  const statusData = Object.entries(reportData.ticketsByStatus).map(([status, count]) => ({
    name: translateStatus(status),
    value: count
  }));

  const priorityData = Object.entries(reportData.ticketsByPriority).map(([priority, count]) => ({
    name: translatePriority(priority),
    value: count
  }));

  const companyData = Object.entries(reportData.ticketsByCompany).map(([company, count]) => ({
    name: company,
    value: count
  }));

  const monthlyData = Object.entries(reportData.ticketsByMonth).map(([month, count]) => ({
    name: month,
    value: count
  }));

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Relatório de Chamados</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Exportar CSV
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} style={{ padding: '16px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Resumo
            </Typography>
            <Typography variant="body1">
              Total de Chamados: {reportData.totalTickets}
            </Typography>
            <Typography variant="body1">
              Tempo Médio de Resolução: {reportData.avgResolutionTime} horas
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} style={{ padding: '16px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Filtros
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="">Todos</option>
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="aguardando">Aguardando</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="fechado">Fechado</option>
                  <option value="cancelado">Cancelado</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Prioridade"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="">Todas</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Empresa"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="">Todas</option>
                  {/* Aqui seria necessário carregar as empresas do backend */}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} style={{ padding: '16px', height: '300px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Chamados por Status
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} style={{ padding: '16px', height: '300px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Chamados por Prioridade
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} style={{ padding: '16px', height: '300px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Chamados por Mês
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Chamados" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} style={{ padding: '16px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Lista de Chamados
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Prioridade</TableCell>
                    <TableCell>Solicitante</TableCell>
                    <TableCell>Atribuído para</TableCell>
                    <TableCell>Data de Criação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.tickets.slice(0, 10).map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{translateStatus(ticket.status)}</TableCell>
                      <TableCell>{translatePriority(ticket.priority)}</TableCell>
                      <TableCell>{ticket.requester ? ticket.requester.name : 'N/A'}</TableCell>
                      <TableCell>{ticket.assignedTo ? ticket.assignedTo.name : 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(ticket.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Componente para o relatório de desempenho
const PerformanceReport = ({ startDate, endDate, onDateChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      loadReport();
    }
  }, [startDate, endDate]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/reports/performance?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar relatório de desempenho');
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (!reportData) {
    return (
      <Box p={3}>
        <Typography variant="body1">
          Selecione um período para gerar o relatório de desempenho.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Relatório de Desempenho por Prestador
      </Typography>

      <Grid container spacing={3}>
        {reportData.map((provider) => (
          <Grid item xs={12} md={6} key={provider.provider.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {provider.provider.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {provider.provider.email}
                </Typography>
                <Divider style={{ margin: '12px 0' }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Total de Chamados: {provider.totalAssigned}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Chamados Resolvidos: {provider.totalResolved}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Taxa de Resolução: {provider.resolutionRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Tempo Médio de Resolução: {provider.avgResolutionTime} horas
                    </Typography>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Chamados por Prioridade
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(provider.ticketsByPriority).map(([priority, count]) => (
                      <Grid item xs={6} key={priority}>
                        <Typography variant="body2">
                          {translatePriority(priority)}: {count}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Componente principal de relatórios
const ReportsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExport = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Relatórios
        </Typography>

        <Paper elevation={2} style={{ marginBottom: '20px' }}>
          <Box p={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Data Inicial"
                  value={startDate}
                  onChange={setStartDate}
                  format="dd/MM/yyyy"
                  locale={ptBR}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Data Final"
                  value={endDate}
                  onChange={setEndDate}
                  format="dd/MM/yyyy"
                  locale={ptBR}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!startDate || !endDate}
                  onClick={() => {
                    if (tabValue === 0) {
                      // Recarregar relatório de chamados
                    } else {
                      // Recarregar relatório de desempenho
                    }
                  }}
                >
                  Gerar Relatório
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Paper elevation={2}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Relatório de Chamados" />
            <Tab label="Relatório de Desempenho" />
          </Tabs>

          <Box p={3}>
            {tabValue === 0 ? (
              <TicketsReport
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onExport={handleExport}
              />
            ) : (
              <PerformanceReport
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ReportsPage; 