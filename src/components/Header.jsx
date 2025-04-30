import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    navigate('/auth/login')
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              letterSpacing: 1,
            }}
          >
            Desafio Técnico
          </Typography>

          <Box>
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
