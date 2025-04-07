import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSolicitation } from '../../context/SolicitationContext';
import { TestSolicitation } from '../../types/test';

export const SolicitationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, update, updateStatus, remove, error, loading } = useSolicitation();
  const [solicitation, setSolicitation] = useState<TestSolicitation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<TestSolicitation>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadSolicitation = async () => {
      try {
        const data = await getById(Number(id));
        setSolicitation(data);
        setFormData(data);
      } catch (err) {
        console.error('Erro ao carregar solicitação:', err);
      }
    };

    if (id) {
      loadSolicitation();
    }
  }, [id, getById]);

  const handleStatusChange = async (newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await updateStatus(Number(id), newStatus);
      setSolicitation(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await update(Number(id), formData);
      setIsEditing(false);
      const updatedData = await getById(Number(id));
      setSolicitation(updatedData);
    } catch (err) {
      console.error('Erro ao atualizar solicitação:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await remove(Number(id));
      navigate('/solicitations');
    } catch (err) {
      console.error('Erro ao excluir solicitação:', err);
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

  if (!solicitation) {
    return (
      <Container>
        <Typography>Solicitação não encontrada</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Detalhes da Solicitação
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={solicitation.status}
                onChange={(e) => handleStatusChange(e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled')}
                label="Status"
              >
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="in_progress">Em Andamento</MenuItem>
                <MenuItem value="completed">Concluído</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título"
              name="title"
              value={isEditing ? formData.title : solicitation.title}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              multiline
              rows={4}
              value={isEditing ? formData.description : solicitation.description}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              {isEditing ? (
                <>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button variant="contained" onClick={handleSubmit}>
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outlined" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>
                    Excluir
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 