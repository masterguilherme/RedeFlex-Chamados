import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Comment as CommentIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useTicket } from '../../contexts/TicketContext';
import { useAuth } from '../../contexts/AuthContext';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTicket, updateTicket, deleteTicket, getTicketComments, addComment, getTicketHistory } = useTicket();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      const ticketData = await getTicket(id);
      if (ticketData) {
        setTicket(ticketData);
        const commentsData = await getTicketComments(id);
        setComments(commentsData);
        const historyData = await getTicketHistory(id);
        setHistory(historyData);
      }
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os dados do chamado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicket(id, { ...ticket, status: newStatus });
      loadTicketData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      try {
        await deleteTicket(id);
        navigate('/tickets');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddComment = async () => {
    try {
      await addComment(id, {
        content: newComment,
        isInternal: false
      });
      setNewComment('');
      setShowCommentDialog(false);
      loadTicketData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      aberto: 'success',
      em_andamento: 'warning',
      aguardando: 'info',
      fechado: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      aberto: 'Aberto',
      em_andamento: 'Em Andamento',
      aguardando: 'Aguardando',
      fechado: 'Fechado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !ticket) {
    return (
      <Container>
        <Typography color="error">{error || 'Chamado não encontrado'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/tickets')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Chamado #{ticket.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">{ticket.title}</Typography>
              <Box>
                <Tooltip title="Editar">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/tickets/${id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton color="error" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Typography variant="body1" paragraph>
              {ticket.description}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Categoria
                </Typography>
                <Typography variant="body1">{ticket.category}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Prioridade
                </Typography>
                <Typography variant="body1">{ticket.priority}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={getStatusLabel(ticket.status)}
                    color={getStatusColor(ticket.status)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Data de Criação
                </Typography>
                <Typography variant="body1">
                  {new Date(ticket.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Comentários</Typography>
              <Button
                variant="outlined"
                startIcon={<CommentIcon />}
                onClick={() => setShowCommentDialog(true)}
              >
                Novo Comentário
              </Button>
            </Box>

            <List>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{comment.createdByUser.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.createdByUser.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {comment.content}
                          </Typography>
                          <br />
                          {new Date(comment.createdAt).toLocaleString()}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Histórico</Typography>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setShowHistoryDialog(true)}
              >
                Ver Histórico
              </Button>
            </Box>

            <List>
              {history.slice(0, 5).map((entry) => (
                <ListItem key={entry.id}>
                  <ListItemText
                    primary={`${entry.changedByUser.name} alterou ${entry.field}`}
                    secondary={`${entry.oldValue} → ${entry.newValue}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ações Rápidas
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {ticket.status !== 'fechado' && (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleStatusChange('fechado')}
                >
                  Fechar Chamado
                </Button>
              )}
              {ticket.status === 'aberto' && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleStatusChange('em_andamento')}
                >
                  Iniciar Atendimento
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={showCommentDialog} onClose={() => setShowCommentDialog(false)}>
        <DialogTitle>Novo Comentário</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comentário"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCommentDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddComment} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Histórico de Alterações</DialogTitle>
        <DialogContent>
          <List>
            {history.map((entry) => (
              <ListItem key={entry.id}>
                <ListItemText
                  primary={`${entry.changedByUser.name} alterou ${entry.field}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {entry.oldValue} → {entry.newValue}
                      </Typography>
                      <br />
                      {new Date(entry.createdAt).toLocaleString()}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistoryDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketDetails; 