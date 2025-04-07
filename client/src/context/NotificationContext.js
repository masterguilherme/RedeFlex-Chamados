import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@material-ui/core';
import { THEME } from '../utils/constants';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const showSuccess = (message) => {
    showNotification(message, 'success');
  };

  const showError = (message) => {
    showNotification(message, 'error');
  };

  const showWarning = (message) => {
    showNotification(message, 'warning');
  };

  const showInfo = (message) => {
    showNotification(message, 'info');
  };

  const handleClose = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return THEME.SUCCESS_COLOR;
      case 'error':
        return THEME.ERROR_COLOR;
      case 'warning':
        return THEME.WARNING_COLOR;
      case 'info':
        return THEME.INFO_COLOR;
      default:
        return THEME.PRIMARY_COLOR;
    }
  };

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          style={{
            backgroundColor: getSeverityColor(notification.severity),
            color: '#fff',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};

export default NotificationContext; 