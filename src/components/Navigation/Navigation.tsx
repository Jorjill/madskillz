import React, { useState, useCallback, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Person,
  Settings,
  ExitToApp,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { useDispatch } from 'react-redux';
import { deselectSkill } from '../../slices/skillsSlice';
import { resetQuizState } from '../../slices/quizSlice';
import './Navigation.less';

const Navigation: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Memoize event handlers
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleHome = useCallback(() => {
    dispatch(deselectSkill());
    dispatch(resetQuizState());
    navigate('/home');
  }, [dispatch, navigate]);

  const handleProfile = useCallback(() => {
    handleClose();
    navigate('/profile');
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    handleClose();
    navigate('/dashboard');
  }, [navigate]);

  const handleSettings = useCallback(() => {
    handleClose();
    navigate('/settings');
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      handleClose();
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [signOut, navigate]);

  // Memoize menu paper props
  const menuPaperProps = useMemo(() => ({
    sx: {
      width: '200px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      mt: 1.5,
    }
  }), []);

  // Memoize avatar display text
  const avatarText = useMemo(() => 
    user?.displayName?.[0] || user?.email?.[0], 
    [user?.displayName, user?.email]
  );

  return (
    <div className="navigation-wrapper">
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={handleHome}
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MadSkillz
          </Typography>

          <Box>
            <IconButton
              onClick={handleClick}
              size="large"
              sx={{ color: 'white' }}
            >
              <Avatar 
                sx={{ width: 32, height: 32 }}
                src={user?.photoURL || undefined}
              >
                {avatarText}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={menuPaperProps}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleDashboard}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
});

export default Navigation;
