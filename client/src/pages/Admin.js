import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import UserList from '../components/admin/UserList';
import CompanyList from '../components/admin/CompanyList';

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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Painel Administrativo
        </Typography>
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="painel administrativo"
          >
            <Tab label="Usuários" {...a11yProps(0)} />
            <Tab label="Empresas" {...a11yProps(1)} />
          </Tabs>
          
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

export default Admin; 