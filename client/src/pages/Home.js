import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Typography, Container, Box, Paper, Grid } from '@material-ui/core';

const Home = () => {
  const { user } = useContext(AuthContext);

  // Conteúdo específico baseado no tipo de usuário
  const renderUserContent = () => {
    switch (user?.userType) {
      case 'admin':
        return (
          <Box mt={3}>
            <Typography variant="h6">Painel do Administrador</Typography>
            <Typography variant="body1">
              Bem-vindo ao painel administrativo. Aqui você pode gerenciar usuários, 
              empresas e configurações do sistema.
            </Typography>
          </Box>
        );
      case 'solicitante':
        return (
          <Box mt={3}>
            <Typography variant="h6">Painel do Solicitante</Typography>
            <Typography variant="body1">
              Bem-vindo ao seu painel. Aqui você pode abrir novos chamados e 
              acompanhar o status dos seus chamados existentes.
            </Typography>
          </Box>
        );
      case 'prestador':
        return (
          <Box mt={3}>
            <Typography variant="h6">Painel do Prestador</Typography>
            <Typography variant="body1">
              Bem-vindo ao seu painel. Aqui você pode visualizar e gerenciar 
              os chamados atribuídos a você.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box mt={3}>
            <Typography variant="body1">
              Bem-vindo ao Sistema de Gerenciamento de Chamados.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5">
                Bem-vindo, {user?.name}!
              </Typography>
              {renderUserContent()}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Resumo de Chamados</Typography>
              <Typography variant="body2">
                Esta seção mostrará um resumo dos chamados quando implementarmos o módulo de chamados.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Atividades Recentes</Typography>
              <Typography variant="body2">
                Esta seção mostrará as atividades recentes quando implementarmos o módulo de chamados.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 