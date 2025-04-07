import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useCompany } from '../../context/CompanyContext';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

const UsersPage = () => {
  const { users, loading: usersLoading, error: usersError, getUsers, updateUser, deleteUser, clearErrors } = useUser();
  const { companies, getCompanies } = useCompany();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    company: '',
    active: true
  });

  useEffect(() => {
    getUsers();
    getCompanies();
  }, [getUsers, getCompanies]);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      userType: user.userType,
      company: user.company || '',
      active: user.active
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      userType: '',
      company: '',
      active: true
    });
    clearErrors();
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, formData);
      handleCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este usuário?')) {
      try {
        await deleteUser(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (usersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Usuários
        </Typography>

        {usersError && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {usersError}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.userType === 'admin' && 'Administrador'}
                    {user.userType === 'solicitante' && 'Solicitante'}
                    {user.userType === 'prestador' && 'Prestador'}
                  </TableCell>
                  <TableCell>
                    {user.Company ? user.Company.name : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Editar Usuário</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Nome"
                type="text"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Tipo de Usuário</InputLabel>
                <Select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="solicitante">Solicitante</MenuItem>
                  <MenuItem value="prestador">Prestador</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Empresa</InputLabel>
                <Select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Ativo"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Salvar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UsersPage; 