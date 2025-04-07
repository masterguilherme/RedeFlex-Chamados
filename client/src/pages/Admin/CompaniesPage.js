import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import {
  Container,
  Typography,
  Box,
  Button,
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
  CircularProgress
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';

const CompaniesPage = () => {
  const { companies, loading, error, getCompanies, addCompany, updateCompany, deleteCompany, clearErrors } = useCompany();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  const handleOpenDialog = (company = null) => {
    if (company) {
      setSelectedCompany(company);
      setFormData({
        name: company.name,
        cnpj: company.cnpj,
        address: company.address,
        phone: company.phone,
        email: company.email
      });
    } else {
      setSelectedCompany(null);
      setFormData({
        name: '',
        cnpj: '',
        address: '',
        phone: '',
        email: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCompany(null);
    setFormData({
      name: '',
      cnpj: '',
      address: '',
      phone: '',
      email: ''
    });
    clearErrors();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCompany) {
        await updateCompany(selectedCompany.id, formData);
      } else {
        await addCompany(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta empresa?')) {
      try {
        await deleteCompany(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Gerenciamento de Empresas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nova Empresa
          </Button>
        </Box>

        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.cnpj}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(company)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(company.id)}
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
          <DialogTitle>
            {selectedCompany ? 'Editar Empresa' : 'Nova Empresa'}
          </DialogTitle>
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
                name="cnpj"
                label="CNPJ"
                type="text"
                fullWidth
                value={formData.cnpj}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 14 }}
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
              <TextField
                margin="dense"
                name="phone"
                label="Telefone"
                type="text"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="address"
                label="Endereço"
                type="text"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {selectedCompany ? 'Salvar' : 'Criar'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CompaniesPage; 