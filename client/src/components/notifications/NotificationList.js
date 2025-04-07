import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction,
  IconButton, 
  Typography, 
  Badge, 
  Divider, 
  Box, 
  Button,
  CircularProgress,
  Alert
} from '@material-ui/core';
import { 
  Notifications as NotificationsIcon, 
  Info as InfoIcon, 
  CheckCircle as SuccessIcon, 
  Warning as WarningIcon, 
  Error as ErrorIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon
} from '@material-ui/icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHistory } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const NotificationList = () => {
  const { notifications, loading, error, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const history = useHistory();

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      history.push(notification.link);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <SuccessIcon color="primary" />;
      case 'warning':
        return <WarningIcon style={{ color: '#ff9800' }} />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
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
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <NotificationsIcon style={{ fontSize: 60, color: '#ccc' }} />
        <Typography variant="h6" color="textSecondary">
          Você não tem notificações
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h6">
          Notificações
        </Typography>
        <Button
          startIcon={<DoneAllIcon />}
          onClick={markAllAsRead}
          disabled={notifications.every(n => n.read)}
        >
          Marcar todas como lidas
        </Button>
      </Box>
      <Divider />
      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem 
              button 
              onClick={() => handleNotificationClick(notification)}
              style={{ 
                backgroundColor: notification.read ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                cursor: notification.link ? 'pointer' : 'default'
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" display="block" color="textSecondary">
                      {formatDate(notification.createdAt)}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => deleteNotification(notification.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default NotificationList; 