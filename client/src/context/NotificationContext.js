import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import { THEME } from '../utils/constants';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulando dados para demonstração
      const mockNotifications = [
        { id: 1, title: 'Novo chamado', message: 'Um novo chamado foi aberto', read: false, createdAt: new Date().toISOString() },
        { id: 2, title: 'Chamado atualizado', message: 'O chamado #123 foi atualizado', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, title: 'Chamado fechado', message: 'O chamado #456 foi fechado', read: false, createdAt: new Date(Date.now() - 172800000).toISOString() }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      
      return mockNotifications;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      setError(error.response?.data?.message || 'Erro ao buscar notificações');
      showSnackbar('Erro ao buscar notificações', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Atualizar localmente
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === id) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
      
      // Simulando chamada à API
      // await axios.put(`/api/notifications/${id}/read`);
      
      return true;
    } catch (error) {
      console.error(`Erro ao marcar notificação ${id} como lida:`, error);
      setError(error.response?.data?.message || 'Erro ao marcar notificação como lida');
      showSnackbar('Erro ao marcar notificação como lida', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Atualizar localmente
      const updatedNotifications = notifications.map(notification => {
        return { ...notification, read: true };
      });
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      // Simulando chamada à API
      // await axios.put('/api/notifications/read-all');
      
      showSnackbar('Todas as notificações foram marcadas como lidas', 'success');
      return true;
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      setError(error.response?.data?.message || 'Erro ao marcar todas notificações como lidas');
      showSnackbar('Erro ao marcar todas notificações como lidas', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Atualizar localmente
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      
      setNotifications(updatedNotifications);
      if (wasUnread) {
        setUnreadCount(prev => prev - 1);
      }
      
      // Simulando chamada à API
      // await axios.delete(`/api/notifications/${id}`);
      
      showSnackbar('Notificação excluída com sucesso', 'success');
      return true;
    } catch (error) {
      console.error(`Erro ao excluir notificação ${id}:`, error);
      setError(error.response?.data?.message || 'Erro ao excluir notificação');
      showSnackbar('Erro ao excluir notificação', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    showSnackbar
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 