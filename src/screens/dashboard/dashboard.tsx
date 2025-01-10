import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Note as NoteIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  getAllSkills,
  getAllNotes,
  getAllReferences,
  searchSkills,
  searchNotes,
  searchReferences,
} from '../../utils/offlineMode';
import { Skill, Note, Reference } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const skills = searchQuery ? searchSkills(searchQuery) : getAllSkills();
  const notes = searchQuery ? searchNotes(searchQuery) : getAllNotes();
  const references = searchQuery ? searchReferences(searchQuery) : getAllReferences();

  const skillsByLevel = {
    expert: skills.filter(skill => skill.proficiencyLevel === 'expert').length,
    advanced: skills.filter(skill => skill.proficiencyLevel === 'advanced').length,
    intermediate: skills.filter(skill => skill.proficiencyLevel === 'intermediate').length,
    beginner: skills.filter(skill => skill.proficiencyLevel === 'beginner').length,
  };

  const renderSkillCard = (skill: Skill) => (
    <Card key={skill.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {skill.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {skill.description}
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {skill.tags?.map(tag => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/skill/${skill.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  const renderNoteCard = (note: Note) => (
    <Card key={note.id}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {note.title}
        </Typography>
        <Typography variant="body2" noWrap>
          {note.content}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderReferenceCard = (reference: Reference) => (
    <Card key={reference.id}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {reference.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {reference.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={reference.url} target="_blank">
          Open Link
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/skill/new')}
          >
            Add Skill
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Overview */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {skills.length}
                  </Typography>
                  <Typography variant="body1">Total Skills</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary">
                    {notes.length}
                  </Typography>
                  <Typography variant="body1">Notes</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {references.length}
                  </Typography>
                  <Typography variant="body1">References</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {skillsByLevel.expert + skillsByLevel.advanced}
                  </Typography>
                  <Typography variant="body1">Advanced Skills</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Skills */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Recent Skills
          </Typography>
          <Grid container spacing={2}>
            {skills.slice(0, 6).map(skill => (
              <Grid item xs={12} sm={6} key={skill.id}>
                {renderSkillCard(skill)}
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Quick Access */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<NoteIcon />}
                  onClick={() => navigate('/notes/new')}
                >
                  New Note
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={() => navigate('/references/new')}
                >
                  Add Reference
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Recent Notes
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {notes.slice(0, 3).map(renderNoteCard)}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Recent References
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {references.slice(0, 3).map(renderReferenceCard)}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
