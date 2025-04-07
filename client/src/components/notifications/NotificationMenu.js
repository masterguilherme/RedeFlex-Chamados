import React, { useState } from 'react';
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Divider, 
  Button,
  CircularProgress
} from '@material-ui/core';
import { Notifications as NotificationsIcon } from '@material-ui/icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHistory } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, loading, loadUnreadNotifications, markAsRead } = useNotifications();
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    loadUnreadNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    if (notification.link) {
      history.push(notification.link);
    }
    
    handleClose();
  };

  const handleViewAll = () => {
    history.push('/notifications');
    handleClose();
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 350,
          },
        }}
      >
        <Box p={2}>
          <Typography variant="h6">Notificações</Typography>
        </Box>
        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box p={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Você não tem notificações não lidas
            </Typography>
          </Box>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <MenuItem 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification)}
                style={{ 
                  whiteSpace: 'normal',
                  display: 'block',
                  padding: '12px 16px'
                }}
              >
                <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatDate(notification.createdAt)}
                </Typography>
              </MenuItem>
            ))}
            
            {notifications.length > 5 && (
              <Box p={1} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  +{notifications.length - 5} notificações não mostradas
                </Typography>
              </Box>
            )}
            
            <Divider />
            <Box p={1} textAlign="center">
              <Button 
                color="primary" 
                onClick={handleViewAll}
                fullWidth
              >
                Ver todas as notificações
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu; 