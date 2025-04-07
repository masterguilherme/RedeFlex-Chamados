import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useSolicitation } from '../../context/SolicitationContext';
import { TestSolicitation } from '../../types/test';

export const SolicitationList: React.FC = () => {
  const navigate = useNavigate();
  const { solicitations, getAll, error, loading } = useSolicitation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    getAll();
  }, [getAll]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const filteredSolicitations = solicitations.filter(solicitation => {
    const matchesSearch = solicitation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || solicitation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Solicitações</Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/solicitations/new')}
            >
              Nova Solicitação
            </Button>
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Buscar"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por título ou descrição"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilter}
                label="Status"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="in_progress">Em Andamento</MenuItem>
                <MenuItem value="completed">Concluído</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data de Criação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSolicitations.map((solicitation: TestSolicitation) => (
                    <TableRow
                      key={solicitation.id}
                      hover
                      onClick={() => navigate(`/solicitations/${solicitation.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{solicitation.id}</TableCell>
                      <TableCell>{solicitation.title}</TableCell>
                      <TableCell>{getStatusLabel(solicitation.status)}</TableCell>
                      <TableCell>
                        {new Date(solicitation.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSolicitations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Nenhuma solicitação encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}; 