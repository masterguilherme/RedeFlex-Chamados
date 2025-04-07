import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTechnician, Technician } from '../../context/TechnicianContext';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

const TechnicianDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, update, updateStatus, error, loading } = useTechnician();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Technician>>({});

  useEffect(() => {
    const loadTechnician = async () => {
      try {
        const data = await getById(Number(id));
        setTechnician(data);
        setFormData(data);
      } catch (err) {
        console.error('Erro ao carregar técnico:', err);
      }
    };

    if (id) {
      loadTechnician();
    }
  }, [id, getById]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus(Number(id), newStatus);
      setTechnician(prev => prev ? { ...prev, status: newStatus } : null);
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
      setTechnician(updatedData);
    } catch (err) {
      console.error('Erro ao atualizar técnico:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este técnico?')) {
      navigate('/technicians');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!technician) {
    return (
      <Container>
        <Alert severity="info">Técnico não encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Detalhes do Técnico
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={technician.status}
                onChange={(e) => handleStatusChange(e.target.value as string)}
                label="Status"
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={isEditing ? formData.name : technician.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={isEditing ? formData.email : technician.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              name="phone"
              value={isEditing ? formData.phone : technician.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Endereço"
              name="address"
              value={isEditing ? formData.address : technician.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Especialização</InputLabel>
              <Select
                name="specialization"
                value={isEditing ? formData.specialization : technician.specialization}
                onChange={handleInputChange}
                label="Especialização"
                disabled={!isEditing}
              >
                <MenuItem value="hardware">Hardware</MenuItem>
                <MenuItem value="software">Software</MenuItem>
                <MenuItem value="rede">Rede</MenuItem>
              </Select>
            </FormControl>
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
                  <Button variant="contained" color="error" onClick={handleDelete}>
                    Excluir
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TechnicianDetails; 