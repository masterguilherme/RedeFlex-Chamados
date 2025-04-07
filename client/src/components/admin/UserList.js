import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'solicitante',
    company: ''
  });

  useEffect(() => {
    loadUsers();
    loadCompanies();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    }
  };

  const loadCompanies = async () => {
    try {
      const res = await axios.get('/api/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        userType: user.userType,
        company: user.company || ''
      });
    } else {
      setEditUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        userType: 'solicitante',
        company: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Se estiver editando e a senha estiver vazia, não envie a senha
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        await axios.put(`/api/users/${editUser.id}`, dataToSend);
      } else {
        await axios.post('/api/users', formData);
      }
      handleClose();
      loadUsers();
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        loadUsers();
      } catch (err) {
        console.error('Erro ao excluir usuário:', err);
      }
    }
  };

  // Função para obter o nome da empresa pelo ID
  const getCompanyName = (companyId) => {
    if (!companyId) return 'N/A';
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'N/A';
  };

  // Função para traduzir o tipo de usuário
  const translateUserType = (userType) => {
    switch (userType) {
      case 'admin':
        return 'Administrador';
      case 'solicitante':
        return 'Solicitante';
      case 'prestador':
        return 'Prestador';
      default:
        return userType;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Usuários</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{translateUserType(user.userType)}</TableCell>
                <TableCell>{getCompanyName(user.company)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required={!editUser}
              helperText={editUser ? "Deixe em branco para manter a senha atual" : ""}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="userType-label">Tipo de Usuário</InputLabel>
              <Select
                labelId="userType-label"
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="company-label">Empresa</InputLabel>
              <Select
                labelId="company-label"
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList; 