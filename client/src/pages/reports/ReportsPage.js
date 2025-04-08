import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';
import ReportForm from './ReportForm';
import ReportMetrics from './ReportMetrics';

const ReportsPage = () => {
  const { reports, loading, error, deleteReport, generateReport } = useReports();
  const { user } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openMetrics, setOpenMetrics] = useState(false);

  const handleOpenForm = (report = null) => {
    setSelectedReport(report);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedReport(null);
    setOpenForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este relatório?')) {
      try {
        await deleteReport(id);
      } catch (error) {
        console.error('Erro ao remover relatório:', error);
      }
    }
  };

  const handleGenerate = async (id) => {
    try {
      const blob = await generateReport(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${Date.now()}.${reports.find(r => r.id === id).format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Relatórios</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={() => setOpenMetrics(true)}
            sx={{ mr: 2 }}
          >
            Métricas
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Novo Relatório
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6">{report.name}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {report.description}
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={report.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={report.format.toUpperCase()}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                    {report.schedule && (
                      <Typography variant="body2" color="textSecondary">
                        Agendado: {report.schedule.frequency} às {report.schedule.time}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleGenerate(report.id)}
                      title="Gerar relatório"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenForm(report)}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(report.id)}
                      title="Remover"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedReport ? 'Editar Relatório' : 'Novo Relatório'}
        </DialogTitle>
        <DialogContent>
          <ReportForm
            report={selectedReport}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openMetrics}
        onClose={() => setOpenMetrics(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Métricas e KPIs</DialogTitle>
        <DialogContent>
          <ReportMetrics />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReportsPage; 