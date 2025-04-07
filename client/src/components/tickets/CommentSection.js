import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CommentSection = ({ ticketId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários');
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar comentário');
      }

      setNewComment('');
      await loadComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) return;

    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir comentário');
      }

      await loadComments();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={2} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Comentários
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Digite seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Comentar'}
          </Button>
        </Box>
      </form>

      <List>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" component="span">
                      {comment.user.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(comment.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </Typography>
                  </Box>
                }
                secondary={comment.content}
              />
              {(user.id === comment.userId || user.type === 'admin') && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
            {index < comments.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {comments.length === 0 && (
          <Typography variant="body2" color="textSecondary" align="center">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default CommentSection; 