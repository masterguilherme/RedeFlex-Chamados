import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Container
} from '@material-ui/core';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@material-ui/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CommentSection from './CommentSection';

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

// Função para formatar a data
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const TicketDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    loadTicket();
    loadComments();
  }, [id]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/tickets/${id}`);
      setTicket(res.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar chamado:', err);
      setError('Não foi possível carregar o chamado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await axios.get(`/api/tickets/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tickets/${id}`);
      history.push('/tickets');
    } catch (err) {
      console.error('Erro ao excluir chamado:', err);
      alert('Erro ao excluir chamado. Tente novamente mais tarde.');
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setCommentLoading(true);
      await axios.post(`/api/tickets/${id}/comments`, { content: comment });
      setComment('');
      loadComments();
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      alert('Erro ao adicionar comentário. Tente novamente mais tarde.');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
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

  if (!ticket) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography>Chamado não encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Detalhes do Chamado</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => history.push('/tickets')}
            style={{ marginRight: 8 }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => history.push(`/tickets/edit/${id}`)}
            style={{ marginRight: 8 }}
          >
            Editar
          </Button>
          {user.userType === 'admin' && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteDialog(true)}
            >
              Excluir
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} style={{ padding: 24, marginBottom: 24 }}>
            <Typography variant="h6" gutterBottom>
              {ticket.title}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip 
                label={translateStatus(ticket.status)} 
                color={getStatusColor(ticket.status)}
                size="small"
              />
              <Chip 
                label={translatePriority(ticket.priority)} 
                color={getPriorityColor(ticket.priority)}
                size="small"
              />
              <Chip 
                label={ticket.category} 
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Descrição
            </Typography>
            <Typography variant="body1" paragraph>
              {ticket.description}
            </Typography>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Solicitante
                </Typography>
                <Typography variant="body1">
                  {ticket.requester ? ticket.requester.name : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Atribuído a
                </Typography>
                <Typography variant="body1">
                  {ticket.assignedTo ? ticket.assignedTo.name : 'Não atribuído'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Empresa
                </Typography>
                <Typography variant="body1">
                  {ticket.company ? ticket.company.name : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Data de Vencimento
                </Typography>
                <Typography variant="body1">
                  {ticket.dueDate ? formatDate(ticket.dueDate) : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Criado em
                </Typography>
                <Typography variant="body1">
                  {formatDate(ticket.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Última atualização
                </Typography>
                <Typography variant="body1">
                  {formatDate(ticket.updatedAt)}
                </Typography>
              </Grid>
              
              {ticket.closedAt && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fechado em
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(ticket.closedAt)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
          
          <Paper elevation={2} style={{ padding: 24 }}>
            <Typography variant="h6" gutterBottom>
              Comentários
            </Typography>
            
            {comments.length === 0 ? (
              <Typography variant="body2" color="textSecondary" paragraph>
                Nenhum comentário ainda.
              </Typography>
            ) : (
              <Box mb={3}>
                {comments.map((comment) => (
                  <Box key={comment.id} mb={2} p={2} bgcolor="#f5f5f5" borderRadius={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2">
                        {comment.user ? comment.user.name : 'Usuário desconhecido'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            
            <Box display="flex" alignItems="flex-start">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Adicione um comentário..."
                value={comment}
                onChange={handleCommentChange}
                multiline
                rows={2}
                style={{ marginRight: 8 }}
              />
              <Tooltip title="Enviar comentário">
                <IconButton 
                  color="primary" 
                  onClick={handleAddComment}
                  disabled={!comment.trim() || commentLoading}
                >
                  {commentLoading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} style={{ padding: 24 }}>
            <Typography variant="h6" gutterBottom>
              Histórico
            </Typography>
            
            <Typography variant="body2" color="textSecondary" paragraph>
              Histórico de alterações será implementado em uma versão futura.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Adicionar a seção de comentários após os detalhes do chamado */}
      <CommentSection ticketId={id} user={user} />
      
      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketDetails; 