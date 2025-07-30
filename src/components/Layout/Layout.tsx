import React from 'react';
import { Box } from '@mui/material';
import Navigation from '../Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0a1929' }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Add margin top to account for the fixed AppBar
          width: '100%',
          backgroundColor: '#07203d',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
