import React, { useEffect } from 'react';
import { Button, Typography, Box, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartLine, FaBrain, FaTrophy, FaRocket,
  FaLightbulb, FaCheck 
} from 'react-icons/fa';
import './Landing.less';

// Add Plus Jakarta Sans font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const Landing: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const stars = Array.from({ length: 50 }).map(() => ({
      size: Math.random() * 2 + 1,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));

    const canvas = document.getElementById('starCanvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          stars.forEach(star => {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            star.y = (star.y + 0.2) % canvas.height;
          });
          requestAnimationFrame(animate);
        };
        animate();
      }
    }
  }, []);

  const features = [
    {
      icon: <FaChartLine />,
      title: 'Progress Tracking',
      description: 'Monitor your skill development with detailed analytics and insights'
    },
    {
      icon: <FaBrain />,
      title: 'Smart Learning',
      description: 'AI-powered recommendations to optimize your learning path'
    },
    {
      icon: <FaTrophy />,
      title: 'Achievement System',
      description: 'Earn badges and rewards as you reach new milestones'
    },
    {
      icon: <FaRocket />,
      title: 'Skill Boosters',
      description: 'Access specialized tools and resources to accelerate growth'
    }
  ];

  const journeySteps = [
    {
      icon: <FaLightbulb />,
      title: 'Choose Your Skills',
      description: 'Select from our vast library of skills or create your own custom skill paths.',
      color: '#FFD700'
    },
    {
      icon: <FaChartLine />,
      title: 'Track Progress',
      description: 'Monitor your growth with advanced analytics and milestone tracking.',
      color: '#65877a'
    },
    {
      icon: <FaBrain />,
      title: 'Learn & Practice',
      description: 'Access curated resources and AI-generated quizzes to enhance your skills.',
      color: '#9C27B0'
    },
    {
      icon: <FaRocket />,
      title: 'Master Skills',
      description: 'Achieve mastery through consistent practice and expert guidance.',
      color: '#FF4081'
    }
  ];

  const pricingPlans = [
    {
      title: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 5 skills',
        'Manual quiz creation',
        'Basic progress tracking',
        'Community support'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined'
    },
    {
      title: 'Pro',
      price: '$1',
      period: 'per month',
      features: [
        'Everything in Free plan',
        'Unlimited skills',
        'Advanced progress tracking',
        'Advanced analytics',
        'AI generated quizzes'
      ],
      buttonText: 'Upgrade Now',
      buttonVariant: 'contained',
      highlighted: true
    },
    {
      title: 'Ultimate',
      price: 'Coming Soon',
      period: '',
      features: [
        'Everything in Pro plan',
        'AI powered chatbot assistant',
        'AI powered skill generation',
        'Automated learning materials',
        'Personalized curriculum'
      ],
      buttonText: 'Join Waitlist',
      buttonVariant: 'outlined',
      comingSoon: true
    }
  ];

  return (
    <div className="landing-page">
      <canvas id="starCanvas" className="star-canvas" />
      <div className="background-effects">
        <div className="cosmic-background" />
        <div className="galaxy" />
        <div className="nebula" />
        <div className="star-field" />
        <div className="meteor-shower">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="meteor" style={{ animationDelay: `${i * 2}s` }} />
          ))}
        </div>
        <div className="aurora" />
      </div>
      
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
            Unleash your potential with MadSkillz - The AI-powered platform that transforms
            skill development through personalized tracking, analytics, and actionable insights.
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
            Why Choose MadSkillz?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
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

        <Box className="journey-section">
          <Typography variant="h2" className="section-title" gutterBottom>
            Your Learning Journey
          </Typography>
          <Typography variant="h6" className="section-subtitle" gutterBottom>
            Four simple steps to skill mastery
          </Typography>
          
          <Box className="journey-path">
            <div className="path-line"></div>
            <Grid container spacing={4}>
              {journeySteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <div className={`journey-card animate-fade-up delay-${index}`}>
                    <div className="step-number">{index + 1}</div>
                    <div className="icon-wrapper" style={{ background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)` }}>
                      <div className="icon-background" style={{ color: step.color }}>
                        {step.icon}
                      </div>
                    </div>
                    <Typography variant="h5" className="step-title">
                      {step.title}
                    </Typography>
                    <Typography className="step-description">
                      {step.description}
                    </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        <Box className="pricing-section">
          <Typography variant="h2" className="section-title" gutterBottom>
            Choose Your Plan
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div className={`animate-fade-up delay-${index}`}>
                  <Box className={`pricing-card ${plan.highlighted ? 'highlighted' : ''} ${plan.comingSoon ? 'coming-soon' : ''}`}>
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
                      disabled={plan.comingSoon}
                    >
                      {plan.buttonText}
                    </Button>
                  </Box>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className="cta-section">
          <div className="animate-fade-up">
            <Typography variant="h2">
              Ready to Start Your Journey?
            </Typography>
            <Typography variant="h5" className="subtitle">
              Join thousands of users who are already mastering their skills
            </Typography>
            <Button
              variant="contained"
              className="get-started-button"
              onClick={() => navigate('/login')}
            >
              Get Started Now
            </Button>
          </div>
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
