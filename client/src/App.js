import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SolicitationProvider } from './context/SolicitationContext';
import { TechnicianProvider } from './context/TechnicianContext';
import { CommentProvider } from './context/CommentContext';
import { AttachmentProvider } from './context/AttachmentContext';
import { NotificationProvider } from './context/NotificationContext';
import { CompanyProvider } from './context/CompanyContext';
import { UserProvider } from './context/UserContext';
import { TicketProvider } from './contexts/TicketContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AccessDenied from './pages/AccessDenied';
import AdminPage from './pages/Admin/AdminPage';
import ReportsPage from './components/reports/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import CompaniesPage from './pages/admin/CompaniesPage';
import UsersPage from './pages/admin/UsersPage';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import TicketsList from './pages/tickets/TicketsList';
import TicketDetails from './pages/tickets/TicketDetails';
import TicketForm from './pages/tickets/TicketForm';
import ReportMetrics from './pages/reports/ReportMetrics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <SolicitationProvider>
            <TechnicianProvider>
              <CommentProvider>
                <AttachmentProvider>
                  <CompanyProvider>
                    <UserProvider>
                      <TicketProvider>
                        <Router>
                          <Navbar />
                          <div className="container">
                            <Routes>
                              <Route 
                                path="/" 
                                element={
                                  <PrivateRoute 
                                    component={Home} 
                                    allowedTypes={['admin', 'solicitante', 'prestador']} 
                                  />
                                } 
                              />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/acesso-negado" element={<AccessDenied />} />
                              <Route 
                                path="/admin" 
                                element={
                                  <PrivateRoute 
                                    component={AdminPage} 
                                    allowedTypes={['admin']} 
                                  />
                                } 
                              />
                              <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
                              <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
                              <Route 
                                path="/admin/companies" 
                                element={
                                  <PrivateRoute 
                                    component={CompaniesPage} 
                                    allowedTypes={['admin']} 
                                  />
                                } 
                              />
                              <Route 
                                path="/admin/users" 
                                element={
                                  <PrivateRoute 
                                    component={UsersPage} 
                                    allowedTypes={['admin']} 
                                  />
                                } 
                              />
                              <Route
                                path="/tickets"
                                element={
                                  <PrivateRoute
                                    allowedRoles={['admin', 'solicitante', 'prestador']}
                                  >
                                    <TicketsList />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/tickets/new"
                                element={
                                  <PrivateRoute
                                    allowedRoles={['admin', 'solicitante']}
                                  >
                                    <TicketForm />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/tickets/:id"
                                element={
                                  <PrivateRoute
                                    allowedRoles={['admin', 'solicitante', 'prestador']}
                                  >
                                    <TicketDetails />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/tickets/:id/edit"
                                element={
                                  <PrivateRoute
                                    allowedRoles={['admin', 'solicitante']}
                                  >
                                    <TicketForm />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/reports/metrics"
                                element={
                                  <PrivateRoute>
                                    <ReportMetrics />
                                  </PrivateRoute>
                                }
                              />
                            </Routes>
                          </div>
                        </Router>
                      </TicketProvider>
                    </UserProvider>
                  </CompanyProvider>
                </AttachmentProvider>
              </CommentProvider>
            </TechnicianProvider>
          </SolicitationProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 