import React from 'react';
import { Container, Paper, Typography } from '@material-ui/core';
import NotificationList from '../components/notifications/NotificationList';

const NotificationsPage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ marginTop: '2rem' }}>
        <NotificationList />
      </Paper>
    </Container>
  );
};

export default NotificationsPage; 