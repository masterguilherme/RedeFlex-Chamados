import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { TextField, Button, Typography, Container, Box, Alert } from '@material-ui/core';

const Login = () => {
  const { login, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      setAlert(error);
      clearErrors();
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography variant="subtitle1">
          Acesse sua conta
        </Typography>

        {alert && (
          <Box mt={2}>
            <Alert severity="error">{alert}</Alert>
          </Box>
        )}

        <Box mt={3}>
          <form onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
            />
            <Box mt={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Entrar
              </Button>
            </Box>
          </form>
        </Box>

        <Box mt={2}>
          <Typography variant="body2">
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 