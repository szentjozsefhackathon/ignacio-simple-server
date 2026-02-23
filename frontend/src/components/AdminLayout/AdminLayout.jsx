import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Container,
} from '@mui/material';
import {
  Category as CategoryIcon,
  Book as BookIcon,
  ListAlt as StepsIcon,
  CloudUpload as MediaIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
  { text: 'Kategóriák', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Imák', icon: <BookIcon />, path: '/admin/prayers' },
  { text: 'Lépések', icon: <StepsIcon />, path: '/admin/steps' },
  { text: 'Média', icon: <MediaIcon />, path: '/admin/media' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ fontWeight: 700, letterSpacing: 0.5 }}
          >
            ☥ Ignáci imák - Admin CMS
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            bgcolor: '#FAFAFA',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List sx={{ px: 1 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate('/')}
                sx={{
                  borderRadius: 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Főoldal" primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
