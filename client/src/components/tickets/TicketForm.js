import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Divider
} from '@material-ui/core';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TicketForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'media',
    status: 'aberto',
    companyId: '',
    assignedToId: '',
    dueDate: ''
  });

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCompanies();
    if (isEditMode) {
      loadTicket();
    }
    if (user.userType === 'admin') {
      loadUsers();
    }
  }, [id, user.userType]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/tickets/${id}`);
      const ticket = res.data;
      
      setFormData({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        companyId: ticket.companyId || '',
        assignedToId: ticket.assignedToId || '',
        dueDate: ticket.dueDate ? new Date(ticket.dueDate).toISOString().split('T')[0] : ''
      });
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar chamado:', err);
      setError('Não foi possível carregar o chamado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro do campo quando o usuário digita
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Título é obrigatório';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Categoria é obrigatória';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await axios.put(`/api/tickets/${id}`, formData);
      } else {
        await axios.post('/api/tickets', formData);
      }
      
      history.push('/tickets');
    } catch (err) {
      console.error('Erro ao salvar chamado:', err);
      setError('Não foi possível salvar o chamado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          {isEditMode ? 'Editar Chamado' : 'Novo Chamado'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => history.push('/tickets')}
        >
          Voltar
        </Button>
      </Box>

      {error && (
        <Paper elevation={2} style={{ padding: 16, marginBottom: 16, backgroundColor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Paper elevation={2} style={{ padding: 24 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Categoria"
                name="category"
                value={formData.category}
                onChange={handleChange}
                variant="outlined"
                error={!!formErrors.category}
                helperText={formErrors.category}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Prioridade</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Prioridade"
                >
                  <MenuItem value="baixa">Baixa</MenuItem>
                  <MenuItem value="media">Média</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="urgente">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {(user.userType === 'admin' || isEditMode) && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="aberto">Aberto</MenuItem>
                    <MenuItem value="em_andamento">Em Andamento</MenuItem>
                    <MenuItem value="aguardando_cliente">Aguardando Cliente</MenuItem>
                    <MenuItem value="resolvido">Resolvido</MenuItem>
                    <MenuItem value="fechado">Fechado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {user.userType === 'admin' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Empresa</InputLabel>
                  <Select
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    label="Empresa"
                  >
                    <MenuItem value="">Nenhuma</MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {user.userType === 'admin' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Atribuído a</InputLabel>
                  <Select
                    name="assignedToId"
                    value={formData.assignedToId}
                    onChange={handleChange}
                    label="Atribuído a"
                  >
                    <MenuItem value="">Não atribuído</MenuItem>
                    {users
                      .filter(user => user.userType === 'prestador')
                      .map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Vencimento"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TicketForm; 