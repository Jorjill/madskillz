import React from 'react';
import { Box } from '@mui/material';
import Navigation from '../Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#0a1929' }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
          mt: 8, // Add margin top to account for the fixed AppBar
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#07203d',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
