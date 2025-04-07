import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useReports } from '../../contexts/ReportContext';

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string(),
  type: yup.string().required('Tipo é obrigatório'),
  format: yup.string().required('Formato é obrigatório'),
  fields: yup.array().of(
    yup.object().shape({
      key: yup.string().required('Chave é obrigatória'),
      label: yup.string().required('Rótulo é obrigatório')
    })
  ),
  schedule: yup.object().shape({
    frequency: yup.string().when('scheduled', {
      is: true,
      then: yup.string().required('Frequência é obrigatória'),
      otherwise: yup.string()
    }),
    time: yup.string().when('scheduled', {
      is: true,
      then: yup.string().required('Horário é obrigatório'),
      otherwise: yup.string()
    }),
    recipients: yup.array().of(
      yup.string().email('Email inválido')
    ).when('scheduled', {
      is: true,
      then: yup.array().min(1, 'Pelo menos um destinatário é obrigatório'),
      otherwise: yup.array()
    })
  })
});

const ReportForm = ({ report, onClose }) => {
  const { createReport, updateReport } = useReports();
  const [scheduled, setScheduled] = useState(false);
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldForm, setFieldForm] = useState({ key: '', label: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: report || {
      name: '',
      description: '',
      type: '',
      format: '',
      fields: [],
      schedule: {
        frequency: '',
        time: '',
        recipients: []
      }
    }
  });

  useEffect(() => {
    if (report) {
      setScheduled(!!report.schedule);
    }
  }, [report]);

  const handleAddField = () => {
    const fields = watch('fields') || [];
    if (editingField) {
      const updatedFields = fields.map(field =>
        field.key === editingField.key ? fieldForm : field
      );
      setValue('fields', updatedFields);
    } else {
      setValue('fields', [...fields, fieldForm]);
    }
    setOpenFieldDialog(false);
    setEditingField(null);
    setFieldForm({ key: '', label: '' });
  };

  const handleDeleteField = (key) => {
    const fields = watch('fields').filter(field => field.key !== key);
    setValue('fields', fields);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldForm(field);
    setOpenFieldDialog(true);
  };

  const onSubmit = async (data) => {
    try {
      if (report) {
        await updateReport(report.id, data);
      } else {
        await createReport(data);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição"
            multiline
            rows={3}
            {...register('description')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Tipo</InputLabel>
            <Select {...register('type')} label="Tipo">
              <MenuItem value="ticket">Chamados</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
              <MenuItem value="satisfaction">Satisfação</MenuItem>
              <MenuItem value="custom">Personalizado</MenuItem>
            </Select>
            {errors.type && (
              <Typography color="error" variant="caption">
                {errors.type.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.format}>
            <InputLabel>Formato</InputLabel>
            <Select {...register('format')} label="Formato">
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
            {errors.format && (
              <Typography color="error" variant="caption">
                {errors.format.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Campos</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setOpenFieldDialog(true)}
            >
              Adicionar Campo
            </Button>
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {watch('fields')?.map((field) => (
              <Chip
                key={field.key}
                label={`${field.label} (${field.key})`}
                onDelete={() => handleDeleteField(field.key)}
                deleteIcon={<DeleteIcon />}
                onClick={() => handleEditField(field)}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
              />
            }
            label="Agendar Relatório"
          />
        </Grid>

        {scheduled && (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.schedule?.frequency}>
                <InputLabel>Frequência</InputLabel>
                <Select
                  {...register('schedule.frequency')}
                  label="Frequência"
                >
                  <MenuItem value="daily">Diário</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                  <MenuItem value="monthly">Mensal</MenuItem>
                </Select>
                {errors.schedule?.frequency && (
                  <Typography color="error" variant="caption">
                    {errors.schedule.frequency.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="time"
                label="Horário"
                InputLabelProps={{ shrink: true }}
                {...register('schedule.time')}
                error={!!errors.schedule?.time}
                helperText={errors.schedule?.time?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destinatários (separados por vírgula)"
                {...register('schedule.recipients')}
                error={!!errors.schedule?.recipients}
                helperText={errors.schedule?.recipients?.message}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Dialog open={openFieldDialog} onClose={() => setOpenFieldDialog(false)}>
        <DialogTitle>
          {editingField ? 'Editar Campo' : 'Novo Campo'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              fullWidth
              label="Chave"
              value={fieldForm.key}
              onChange={(e) => setFieldForm({ ...fieldForm, key: e.target.value })}
            />
            <TextField
              fullWidth
              label="Rótulo"
              value={fieldForm.label}
              onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFieldDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddField} variant="contained">
            {editingField ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          {report ? 'Atualizar' : 'Criar'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReportForm; 