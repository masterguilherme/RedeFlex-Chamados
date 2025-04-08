import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import NotificationList from '../components/notifications/NotificationList';

const NotificationsPage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4 }}>
        <NotificationList />
      </Paper>
    </Container>
  );
};

export default NotificationsPage; 