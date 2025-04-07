import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography
} from '@material-ui/core';
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
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Admin = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Painel Administrativo
        </Typography>

        <Paper>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Usuários" />
            <Tab label="Empresas" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <UserList />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CompanyList />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Admin; 