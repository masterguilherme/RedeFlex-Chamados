import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Divider
} from '@material-ui/core';
import UserList from '../../components/admin/UserList';
import CompanyList from '../../components/admin/CompanyList';

// Componente para o painel de abas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Função para acessibilidade das abas
function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Painel Administrativo
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Gerencie usuários e empresas do sistema
        </Typography>
        
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="painel administrativo"
          >
            <Tab label="Usuários" {...a11yProps(0)} />
            <Tab label="Empresas" {...a11yProps(1)} />
          </Tabs>
          
          <Divider />
          
          <TabPanel value={tabValue} index={0}>
            <UserList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CompanyList />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPage; 