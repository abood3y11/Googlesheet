import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  Add as AddIcon,
  List as ListIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                mr: 2,
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <BusinessIcon />
            </Avatar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'right'
              }}
            >
              نظام إدارة المشاريع
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              startIcon={<HomeIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                color: isActive('/') ? 'primary.main' : 'text.primary',
                bgcolor: isActive('/') ? 'primary.50' : 'transparent',
                '&:hover': {
                  bgcolor: 'primary.50',
                  color: 'primary.main'
                }
              }}
            >
              الرئيسية
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/projects')}
              startIcon={<DashboardIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                color: isActive('/projects') ? 'primary.main' : 'text.primary',
                bgcolor: isActive('/projects') ? 'primary.50' : 'transparent',
                '&:hover': {
                  bgcolor: 'primary.50',
                  color: 'primary.main'
                }
              }}
            >
              المشاريع
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/projects/new')}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              مشروع جديد
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          mt: 2,
          mb: 2,
          px: { xs: 1, sm: 2, md: 3 },
          maxWidth: '100% !important',
          width: '100vw',
          marginLeft: 0,
          marginRight: 0
        }}
      >
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          p: { xs: 1.5, sm: 2, md: 3 },
          minHeight: 'calc(100vh - 200px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: '100%'
        }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
