import React from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Landing.less';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="background-effects">
        <div className="cosmic-background" />
        <div className="galaxy" />
        <div className="nebula" />
        <div className="star-field" />
        <div className="meteor-shower">
          <div className="meteor" />
          <div className="meteor" />
          <div className="meteor" />
        </div>
        <div className="aurora" />
      </div>
      
      <Container maxWidth="lg" className="content">
        <nav className="nav-bar">
          <Typography variant="h4" className="logo">
            MadSkillz
          </Typography>
          <Button
            variant="outlined"
            className="sign-in-button"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </nav>

        <Box className="hero-section">
          <Typography variant="h1" className="title">
            Master Your Skills
            <span className="highlight"> Track Your Growth</span>
          </Typography>
          
          <Typography variant="h5" className="subtitle">
            Your personal skill development companion. Track progress, set goals,
            and visualize your journey to mastery.
          </Typography>

          <Box className="cta-buttons">
            <Button
              variant="contained"
              className="get-started-button"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              className="learn-more-button"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        <Box className="features-section" id="features">
          <Box className="feature-card">
            <div className="feature-icon skill-tracking" />
            <Typography variant="h6">Skill Tracking</Typography>
            <Typography>
              Track your progress across multiple skills with detailed metrics and insights
            </Typography>
          </Box>

          <Box className="feature-card">
            <div className="feature-icon progress-viz" />
            <Typography variant="h6">Progress Visualization</Typography>
            <Typography>
              Beautiful charts and graphs to visualize your growth over time
            </Typography>
          </Box>

          <Box className="feature-card">
            <div className="feature-icon goal-setting" />
            <Typography variant="h6">Goal Setting</Typography>
            <Typography>
              Set and track goals with smart reminders and achievement tracking
            </Typography>
          </Box>
        </Box>

        <Box className="stats-section">
          <Box className="stat-item">
            <Typography variant="h3">10k+</Typography>
            <Typography>Active Users</Typography>
          </Box>
          <Box className="stat-item">
            <Typography variant="h3">50k+</Typography>
            <Typography>Skills Tracked</Typography>
          </Box>
          <Box className="stat-item">
            <Typography variant="h3">95%</Typography>
            <Typography>Success Rate</Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Landing;
