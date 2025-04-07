import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@material-ui/core';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@material-ui/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Função para traduzir o status do chamado
const translateStatus = (status) => {
  switch (status) {
    case 'aberto':
      return 'Aberto';
    case 'em_andamento':
      return 'Em Andamento';
    case 'aguardando_cliente':
      return 'Aguardando Cliente';
    case 'resolvido':
      return 'Resolvido';
    case 'fechado':
      return 'Fechado';
    default:
      return status;
  }
};

// Função para obter a cor do chip de status
const getStatusColor = (status) => {
  switch (status) {
    case 'aberto':
      return 'default';
    case 'em_andamento':
      return 'primary';
    case 'aguardando_cliente':
      return 'secondary';
    case 'resolvido':
      return 'primary';
    case 'fechado':
      return 'default';
    default:
      return 'default';
  }
};

// Função para traduzir a prioridade do chamado
const translatePriority = (priority) => {
  switch (priority) {
    case 'baixa':
      return 'Baixa';
    case 'media':
      return 'Média';
    case 'alta':
      return 'Alta';
    case 'urgente':
      return 'Urgente';
    default:
      return priority;
  }
};

// Função para obter a cor do chip de prioridade
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'baixa':
      return 'default';
    case 'media':
      return 'primary';
    case 'alta':
      return 'secondary';
    case 'urgente':
      return 'error';
    default:
      return 'default';
  }
};

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/tickets');
      setTickets(res.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar chamados:', err);
      setError('Não foi possível carregar os chamados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      try {
        await axios.delete(`/api/tickets/${id}`);
        loadTickets();
      } catch (err) {
        console.error('Erro ao excluir chamado:', err);
        alert('Erro ao excluir chamado. Tente novamente mais tarde.');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  // Filtrar tickets com base nos filtros
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography>Carregando chamados...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Chamados</Typography>
        <Button
          component={Link}
          to="/tickets/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Novo Chamado
        </Button>
      </Box>

      <Paper elevation={2} style={{ padding: 16, marginBottom: 16 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="aberto">Aberto</MenuItem>
                <MenuItem value="em_andamento">Em Andamento</MenuItem>
                <MenuItem value="aguardando_cliente">Aguardando Cliente</MenuItem>
                <MenuItem value="resolvido">Resolvido</MenuItem>
                <MenuItem value="fechado">Fechado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={priorityFilter}
                onChange={handlePriorityFilterChange}
                label="Prioridade"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="baixa">Baixa</MenuItem>
                <MenuItem value="media">Média</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="urgente">Urgente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filteredTickets.length === 0 ? (
        <Paper elevation={2} style={{ padding: 16, textAlign: 'center' }}>
          <Typography>Nenhum chamado encontrado.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Solicitante</TableCell>
                <TableCell>Atribuído a</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>
                    <Chip 
                      label={translateStatus(ticket.status)} 
                      color={getStatusColor(ticket.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={translatePriority(ticket.priority)} 
                      color={getPriorityColor(ticket.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{ticket.requester ? ticket.requester.name : 'N/A'}</TableCell>
                  <TableCell>{ticket.assignedTo ? ticket.assignedTo.name : 'Não atribuído'}</TableCell>
                  <TableCell>
                    <Tooltip title="Visualizar">
                      <IconButton 
                        component={Link} 
                        to={`/tickets/${ticket.id}`}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        component={Link} 
                        to={`/tickets/edit/${ticket.id}`}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {user.userType === 'admin' && (
                      <Tooltip title="Excluir">
                        <IconButton 
                          onClick={() => handleDelete(ticket.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TicketList; 