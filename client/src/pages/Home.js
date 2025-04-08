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
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const userModules = [
    {
      title: 'Meus Chamados',
      description: 'Visualizar e gerenciar seus chamados',
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      path: '/tickets'
    },
    {
      title: 'Notificações',
      description: 'Visualizar suas notificações',
      icon: <NotificationsIcon fontSize="large" color="primary" />,
      path: '/notifications'
    },
    {
      title: 'Perfil',
      description: 'Gerenciar suas informações pessoais',
      icon: <PersonIcon fontSize="large" color="primary" />,
      path: '/profile'
    }
  ];

  // Adicionar módulo de administração se o usuário for admin
  if (currentUser?.role === 'admin') {
    userModules.push({
      title: 'Administração',
      description: 'Acessar o painel administrativo',
      icon: <HomeIcon fontSize="large" color="primary" />,
      path: '/admin'
    });
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HomeIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
            <Typography variant="h4" component="h1">
              Bem-vindo ao Sistema de Chamados
            </Typography>
          </Box>
          <Typography variant="body1">
            Olá, {currentUser?.name || 'Usuário'}! Este é o sistema de gerenciamento de chamados da RedeFlex.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {userModules.map((module, index) => (
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

export default Home; 