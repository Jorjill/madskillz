import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { isOfflineMode, setOfflineMode } from '../../utils/offlineMode';

const Settings: React.FC = () => {
  const { signOut } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [settings, setSettings] = useState({
    offline: isOfflineMode(),
    emailNotifications: true,
    darkMode: false,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      if (setting === 'offline') {
        setOfflineMode(newSettings.offline);
      }
      return newSettings;
    });
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would delete the user's account
    setShowDeleteConfirm(false);
    signOut();
  };

  const handleClearData = () => {
    localStorage.clear();
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings updated successfully!
        </Alert>
      )}

      <Paper elevation={3}>
        <List>
          <ListItem>
            <ListItemText
              primary="Offline Mode"
              secondary="Enable to use the app without an internet connection"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.offline}
                onChange={() => handleSettingChange('offline')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive updates about your skills and learning progress"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.emailNotifications}
                onChange={() => handleSettingChange('emailNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary="Switch between light and dark theme"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={() => handleSettingChange('darkMode')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClearData}
          >
            Clear Local Data
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
