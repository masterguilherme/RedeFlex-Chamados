import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Assignment as TicketIcon,
  Person as UserIcon,
  Business as CompanyIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTickets } from '../contexts/TicketContext';
import { useCompanies } from '../contexts/CompanyContext';
import { useUsers } from '../contexts/UserContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { tickets, loading: ticketsLoading } = useTickets();
  const { companies, loading: companiesLoading } = useCompanies();
  const { users, loading: usersLoading } = useUsers();

  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    urgentTickets: 0,
    averageResponseTime: 0,
    totalUsers: 0,
    totalCompanies: 0
  });

  useEffect(() => {
    if (tickets && companies && users) {
      const now = new Date();
      const responseTimes = tickets
        .filter(ticket => ticket.status !== 'aberto')
        .map(ticket => {
          const created = new Date(ticket.createdAt);
          const updated = new Date(ticket.updatedAt);
          return (updated - created) / (1000 * 60 * 60); // Tempo em horas
        });

      setStats({
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'aberto').length,
        urgentTickets: tickets.filter(t => t.priority === 'urgente').length,
        averageResponseTime: responseTimes.length > 0 
          ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
          : 0,
        totalUsers: users.length,
        totalCompanies: companies.length
      });
    }
  }, [tickets, companies, users]);

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TicketIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total de Chamados</Typography>
            </Box>
            <Typography variant="h4">{stats.totalTickets}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <WarningIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Chamados Urgentes</Typography>
            </Box>
            <Typography variant="h4">{stats.urgentTickets}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <UserIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total de Usuários</Typography>
            </Box>
            <Typography variant="h4">{stats.totalUsers}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CompanyIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total de Empresas</Typography>
            </Box>
            <Typography variant="h4">{stats.totalCompanies}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSolicitanteDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TicketIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Meus Chamados</Typography>
            </Box>
            <Typography variant="h4">
              {tickets.filter(t => t.createdBy === user.id).length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <WarningIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Chamados Abertos</Typography>
            </Box>
            <Typography variant="h4">
              {tickets.filter(t => t.createdBy === user.id && t.status === 'aberto').length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Tempo Médio de Resposta</Typography>
            </Box>
            <Typography variant="h4">{stats.averageResponseTime}h</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPrestadorDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TicketIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Chamados Atribuídos</Typography>
            </Box>
            <Typography variant="h4">
              {tickets.filter(t => t.assignedTo === user.id).length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <WarningIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Chamados Urgentes</Typography>
            </Box>
            <Typography variant="h4">
              {tickets.filter(t => t.assignedTo === user.id && t.priority === 'urgente').length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Chamados Resolvidos</Typography>
            </Box>
            <Typography variant="h4">
              {tickets.filter(t => t.assignedTo === user.id && t.status === 'fechado').length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRecentActivity = () => {
    const recentTickets = tickets
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    return (
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Atividades Recentes
        </Typography>
        <List>
          {recentTickets.map((ticket) => (
            <React.Fragment key={ticket.id}>
              <ListItem>
                <ListItemIcon>
                  <TicketIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={ticket.title}
                  secondary={`Status: ${ticket.status} | Prioridade: ${ticket.priority}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );
  };

  if (ticketsLoading || companiesLoading || usersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'solicitante' && renderSolicitanteDashboard()}
      {user.role === 'prestador' && renderPrestadorDashboard()}
      
      {renderRecentActivity()}
    </Box>
  );
};

export default Dashboard; 