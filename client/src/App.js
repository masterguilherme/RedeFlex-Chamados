import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';

// Providers
import { AuthProvider } from './context/AuthContext';
import { SolicitationProvider } from './context/SolicitationContext';
import { TechnicianProvider } from './context/TechnicianContext';
import { CommentProvider } from './context/CommentContext';
import { AttachmentProvider } from './context/AttachmentContext';
import { NotificationProvider } from './context/NotificationContext';
import { CompanyProvider } from './context/CompanyContext';
import { UserProvider } from './context/UserContext';
import { TicketProvider } from './context/TicketContext';

// Routes
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AccessDenied from './pages/AccessDenied';
import AdminPage from './pages/Admin/AdminPage';
import ReportsPage from './components/reports/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import CompaniesPage from './pages/Admin/CompaniesPage';
import UsersPage from './pages/Admin/UsersPage';
import TicketsList from './pages/tickets/TicketsList';
import TicketDetails from './pages/tickets/TicketDetails';
import TicketForm from './pages/tickets/TicketForm';

import './App.css';

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UserProvider>
          <CompanyProvider>
            <SolicitationProvider>
              <TechnicianProvider>
                <CommentProvider>
                  <AttachmentProvider>
                    <NotificationProvider>
                      <TicketProvider>
                        <Router>
                          <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/access-denied" element={<AccessDenied />} />
                            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
                            <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
                            <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
                            <Route path="/admin/companies" element={<PrivateRoute><CompaniesPage /></PrivateRoute>} />
                            <Route path="/admin/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
                            <Route path="/tickets" element={<PrivateRoute><TicketsList /></PrivateRoute>} />
                            <Route path="/tickets/:id" element={<PrivateRoute><TicketDetails /></PrivateRoute>} />
                            <Route path="/tickets/new" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
                            <Route path="/tickets/edit/:id" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
                          </Routes>
                        </Router>
                      </TicketProvider>
                    </NotificationProvider>
                  </AttachmentProvider>
                </CommentProvider>
              </TechnicianProvider>
            </SolicitationProvider>
          </CompanyProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 