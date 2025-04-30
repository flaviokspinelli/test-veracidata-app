import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/auth/login');
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100vw">
      <Header />
      <Box
        component="main"
        flex={1}
        overflow="auto"
        bgcolor="#f5f7fa"
        py={4}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
