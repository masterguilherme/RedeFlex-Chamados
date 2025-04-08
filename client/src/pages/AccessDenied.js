import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';

const AccessDenied = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="error">
            Acesso Negado
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Você não tem permissão para acessar esta página.
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Por favor, entre em contato com o administrador do sistema se você acredita que isso é um erro.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AccessDenied; 