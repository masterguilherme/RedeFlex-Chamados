import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Box, Button } from '@material-ui/core';

const AccessDenied = () => {
  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" color="error" gutterBottom>
          Acesso Negado
        </Typography>
        <Typography variant="body1" paragraph>
          Você não tem permissão para acessar esta página.
        </Typography>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          color="primary"
        >
          Voltar para a página inicial
        </Button>
      </Box>
    </Container>
  );
};

export default AccessDenied; 