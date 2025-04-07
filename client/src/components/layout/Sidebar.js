import { Assessment as ReportsIcon } from '@material-ui/icons';

// Dentro do componente Sidebar, adicionar o item de menu para relatórios
{user && user.type === 'admin' && (
  <ListItem button component={Link} to="/reports">
    <ListItemIcon>
      <ReportsIcon />
    </ListItemIcon>
    <ListItemText primary="Relatórios" />
  </ListItem>
)} 