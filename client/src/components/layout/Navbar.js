import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  ConfirmationNumber as TicketIcon,
  ExitToApp as LogoutIcon,
  Assessment as AssessmentIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    handleClose();
  };

  const menuItems = [
    {
      title: 'Logs',
      path: '/logs',
      icon: <StorageIcon />,
      roles: ['admin']
    },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de Chamados
        </Typography>

        {user ? (
          <Box display="flex" alignItems="center">
            <NotificationCenter />
            
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/')}
            >
              Dashboard
            </Button>

            <Button
              color="inherit"
              startIcon={<TicketIcon />}
              onClick={() => navigate('/tickets')}
            >
              Chamados
            </Button>

            {user.role === 'admin' && (
              <>
                <Button
                  color="inherit"
                  startIcon={<PeopleIcon />}
                  onClick={() => navigate('/users')}
                >
                  Usuários
                </Button>
                <Button
                  color="inherit"
                  startIcon={<BusinessIcon />}
                  onClick={() => navigate('/companies')}
                >
                  Empresas
                </Button>
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/reports/metrics"
                  title="Métricas"
                >
                  <AssessmentIcon />
                </IconButton>
              </>
            )}

            <IconButton
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.name.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                handleClose();
                navigate('/profile');
              }}>
                Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Sair
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/register')}
            >
              Registrar
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 