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
  TextField
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import axios from 'axios';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await axios.get('/api/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  };

  const handleOpen = (company = null) => {
    if (company) {
      setEditCompany(company);
      setFormData({
        name: company.name,
        cnpj: company.cnpj,
        address: company.address,
        phone: company.phone,
        email: company.email
      });
    } else {
      setEditCompany(null);
      setFormData({
        name: '',
        cnpj: '',
        address: '',
        phone: '',
        email: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCompany(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCompany) {
        await axios.put(`/api/companies/${editCompany.id}`, formData);
      } else {
        await axios.post('/api/companies', formData);
      }
      handleClose();
      loadCompanies();
    } catch (err) {
      console.error('Erro ao salvar empresa:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await axios.delete(`/api/companies/${id}`);
        loadCompanies();
      } catch (err) {
        console.error('Erro ao excluir empresa:', err);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Empresas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nova Empresa
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.cnpj}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(company)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(company.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editCompany ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
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
              label="CNPJ"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ maxLength: 14 }}
            />
            <TextField
              fullWidth
              label="Endereço"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Telefone"
              name="phone"
              value={formData.phone}
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

export default CompanyList; 