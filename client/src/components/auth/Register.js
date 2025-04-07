import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

const Register = () => {
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    userType: 'solicitante'
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

  const { name, email, password, password2, userType } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('As senhas não coincidem');
    } else {
      register({
        name,
        email,
        password,
        userType
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Registro
        </Typography>
        <Typography variant="subtitle1">
          Crie sua conta
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
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={password}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirmar Senha"
              type="password"
              id="password2"
              autoComplete="new-password"
              value={password2}
              onChange={onChange}
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="userType-label">Tipo de Usuário</InputLabel>
              <Select
                labelId="userType-label"
                id="userType"
                name="userType"
                value={userType}
                onChange={onChange}
                label="Tipo de Usuário"
              >
                <MenuItem value="solicitante">Solicitante</MenuItem>
                <MenuItem value="prestador">Prestador</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Registrar
              </Button>
            </Box>
          </form>
        </Box>

        <Box mt={2}>
          <Typography variant="body2">
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 