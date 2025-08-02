import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Chip, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../AuthProvider';
import { getAllSkills, getAllNotes, getAllReferences } from '../../utils/offlineMode';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const skills = getAllSkills();
  const notes = getAllNotes();
  const references = getAllReferences();

  const skillsByLevel = {
    expert: skills.filter(skill => skill.proficiencyLevel === 'expert'),
    advanced: skills.filter(skill => skill.proficiencyLevel === 'advanced'),
    intermediate: skills.filter(skill => skill.proficiencyLevel === 'intermediate'),
    beginner: skills.filter(skill => skill.proficiencyLevel === 'beginner'),
  };

  const renderSkillSection = (level: keyof typeof skillsByLevel, color: string) => (
    <Box mb={2}>
      <Typography variant="h6" gutterBottom>
        {level.charAt(0).toUpperCase() + level.slice(1)} Skills
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {skillsByLevel[level].map((skill) => (
          <Chip
            key={skill.id}
            label={skill.name}
            style={{ backgroundColor: color, color: '#fff' }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={user?.photoURL || undefined}
            >
              {user?.displayName?.[0] || user?.email?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user?.displayName || 'Anonymous User'}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Member since: {new Date(user?.metadata?.creationTime || Date.now()).toLocaleDateString()}
                </Typography>
              </Box>
              <Button startIcon={<EditIcon />} variant="outlined">
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Skills Overview
            </Typography>
            {renderSkillSection('expert', '#2e7d32')}
            {renderSkillSection('advanced', '#1976d2')}
            {renderSkillSection('intermediate', '#ed6c02')}
            {renderSkillSection('beginner', '#d32f2f')}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
            <Box>
              <Typography variant="body1">
                Total Skills: {skills.length}
              </Typography>
              <Typography variant="body1">
                Notes Created: {notes.length}
              </Typography>
              <Typography variant="body1">
                References Saved: {references.length}
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Coming soon...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
