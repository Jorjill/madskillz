import React from 'react';
import { Button, Typography, Box, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartLine, FaBrain, FaTrophy, FaCheck 
} from 'react-icons/fa';
import './Landing.less';

// Add Plus Jakarta Sans font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const Landing: React.FC = () => {
  const navigate = useNavigate();



  const features = [
    {
      icon: <FaChartLine />,
      title: 'Progress Tracking',
      description: 'Monitor your skill development'
    },
    {
      icon: <FaBrain />,
      title: 'Smart Learning',
      description: 'AI-powered recommendations'
    },
    {
      icon: <FaTrophy />,
      title: 'Achievement System',
      description: 'Earn badges and rewards'
    }
  ];

  const pricingPlans = [
    {
      title: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 5 skills',
        'Basic progress tracking'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined'
    },
    {
      title: 'Pro',
      price: '$1',
      period: 'per month',
      features: [
        'Unlimited skills',
        'Advanced analytics',
        'AI generated quizzes'
      ],
      buttonText: 'Upgrade Now',
      buttonVariant: 'contained',
      highlighted: true
    }
  ];

  return (
    <div className="landing-page" style={{ backgroundColor: '#0a0e27', minHeight: '100vh' }}>
      <Container maxWidth="lg" className="content">
        <nav className="nav-bar">
          <div className="logo-container animate-fade-in">
            <img src="https://i.ibb.co/rHqPDg4/mskillz-removebg-preview.png" alt="MadSkillz Logo" className="logo-image" />
          </div>
          <div className="animate-fade-in">
            <Button
              variant="outlined"
              className="sign-in-button"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </nav>

        <div className="hero-section animate-fade-up">
          <Typography variant="h1" className="title">
            Level Up Your Skills
            <span className="highlight"> Master Your Craft</span>
          </Typography>
          
          <Typography variant="h5" className="subtitle">
            Track and improve your skills with personalized insights.
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
        </div>

        <Box className="benefits-section">
          <Typography variant="h2" className="section-title" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <div className={`animate-fade-up delay-${index}`}>
                  <Box className="benefit-card">
                    <div className="benefit-icon">{feature.icon}</div>
                    <div className="benefit-content">
                      <Typography variant="h6">{feature.title}</Typography>
                      <Typography>{feature.description}</Typography>
                    </div>
                  </Box>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className="pricing-section">
          <Typography variant="h2" className="section-title" gutterBottom>
            Choose Your Plan
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div className={`animate-fade-up delay-${index}`}>
                  <Box className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
                    <Typography variant="h4" className="plan-title">
                      {plan.title}
                    </Typography>
                    <Typography variant="h3" className="plan-price">
                      {plan.price}
                    </Typography>
                    {plan.period && (
                      <Typography className="plan-period">
                        {plan.period}
                      </Typography>
                    )}
                    <ul className="feature-list">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>
                          <FaCheck className="check-icon" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={plan.buttonVariant as 'outlined' | 'contained'} 
                      className="action-button"
                      disabled={false}
                    >
                      {plan.buttonText}
                    </Button>
                  </Box>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>



        <Box className="footer-credit" textAlign="center">
          <Typography variant="body2">
            Made by Jorjill 2025
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Landing;
