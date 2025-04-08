import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const adminModules = [
    {
      title: 'Usuários',
      description: 'Gerenciar usuários do sistema',
      icon: <PeopleIcon fontSize="large" color="primary" />,
      path: '/admin/users'
    },
    {
      title: 'Empresas',
      description: 'Gerenciar empresas cadastradas',
      icon: <BusinessIcon fontSize="large" color="primary" />,
      path: '/admin/companies'
    },
    {
      title: 'Chamados',
      description: 'Visualizar todos os chamados',
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      path: '/tickets'
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios e visualizar métricas',
      icon: <BarChartIcon fontSize="large" color="primary" />,
      path: '/reports'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DashboardIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
            <Typography variant="h4" component="h1">
              Painel Administrativo
            </Typography>
          </Box>
          <Typography variant="body1">
            Bem-vindo ao painel administrativo, {currentUser?.name || 'Administrador'}. Aqui você pode gerenciar todos os aspectos do sistema.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {adminModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                  {module.icon}
                  <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(module.path)}
                  >
                    Acessar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPage; 