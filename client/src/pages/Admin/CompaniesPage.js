import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [currentCompany, setCurrentCompany] = useState({
    id: null,
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Simulando dados para demonstração
      const mockCompanies = [
        { id: 1, name: 'Empresa A', cnpj: '12.345.678/0001-90', email: 'contato@empresaa.com', phone: '(11) 1234-5678', address: 'Rua A, 123' },
        { id: 2, name: 'Empresa B', cnpj: '98.765.432/0001-10', email: 'contato@empresab.com', phone: '(11) 8765-4321', address: 'Rua B, 456' },
        { id: 3, name: 'Empresa C', cnpj: '45.678.901/0001-23', email: 'contato@empresac.com', phone: '(11) 4567-8901', address: 'Rua C, 789' }
      ];
      setCompanies(mockCompanies);
    } catch (err) {
      setError('Erro ao carregar empresas');
      showSnackbar('Erro ao carregar empresas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (company = null) => {
    if (company) {
      setCurrentCompany(company);
    } else {
      setCurrentCompany({
        id: null,
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        address: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCompany = () => {
    try {
      if (currentCompany.id) {
        // Atualizar empresa existente
        const updatedCompanies = companies.map(company => 
          company.id === currentCompany.id ? currentCompany : company
        );
        setCompanies(updatedCompanies);
        showSnackbar('Empresa atualizada com sucesso', 'success');
      } else {
        // Adicionar nova empresa
        const newCompany = {
          ...currentCompany,
          id: Date.now() // Simulando um ID único
        };
        setCompanies([...companies, newCompany]);
        showSnackbar('Empresa adicionada com sucesso', 'success');
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar('Erro ao salvar empresa', 'error');
    }
  };

  const handleDeleteCompany = (id) => {
    try {
      const updatedCompanies = companies.filter(company => company.id !== id);
      setCompanies(updatedCompanies);
      showSnackbar('Empresa removida com sucesso', 'success');
    } catch (err) {
      showSnackbar('Erro ao remover empresa', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Empresas
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              label="Buscar empresas"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Nova Empresa
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Typography>Carregando...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.cnpj}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell>{company.address}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleOpenDialog(company)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton onClick={() => handleDeleteCompany(company.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhuma empresa encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Dialog para adicionar/editar empresa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentCompany.id ? 'Editar Empresa' : 'Nova Empresa'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome da Empresa"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCompany.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="cnpj"
            label="CNPJ"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCompany.cnpj}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={currentCompany.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Telefone"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCompany.phone}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="address"
            label="Endereço"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCompany.address}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveCompany} color="primary" variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CompaniesPage; 