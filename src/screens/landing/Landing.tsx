import React, { useEffect } from 'react';
import { Button, Typography, Box, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartLine, FaBrain, FaTrophy, FaRocket,
  FaLightbulb, FaUsers, FaChartBar, FaCog
} from 'react-icons/fa';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import './Landing.less';

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

  const testimonials = [
    {
      text: "MadSkillz transformed my learning journey. The AI-powered recommendations helped me focus on the right skills at the right time. I've seen a 40% improvement in my productivity!",
      author: "Sarah Chen",
      role: "Full Stack Developer",
      company: "TechCorp"
    },
    {
      text: "The visualization tools and progress tracking features are game-changers. I can clearly see my growth and identify areas that need attention. It's like having a personal skill coach.",
      author: "Michael Rodriguez",
      role: "UX Designer",
      company: "DesignHub"
    },
    {
      text: "As a team leader, MadSkillz helps me track my team's skill development effectively. The insights and analytics are invaluable for planning training and growth strategies.",
      author: "Emma Thompson",
      role: "Engineering Manager",
      company: "InnovateTech"
    }
  ];

  const timelineItems = [
    {
      icon: <FaLightbulb />,
      title: 'Set Your Goals',
      description: 'Define clear objectives and create your personalized skill roadmap'
    },
    {
      icon: <FaUsers />,
      title: 'Join Communities',
      description: 'Connect with like-minded individuals and share experiences'
    },
    {
      icon: <FaChartBar />,
      title: 'Track Progress',
      description: 'Monitor your growth with detailed analytics and insights'
    },
    {
      icon: <FaCog />,
      title: 'Optimize & Adapt',
      description: 'Fine-tune your learning path based on performance data'
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
            <img src="src/assets/mskillz.png" alt="MadSkillz Logo" className="logo-image" />
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
          <Typography variant="h2" className="section-title">
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

        <Box className="timeline-section">
          <Typography variant="h2" className="section-title">
            Your Journey
          </Typography>
          <Timeline position="alternate">
            {timelineItems.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <div className={`animate-scale delay-${index}`}>
                    <TimelineDot className="timeline-dot">
                      {item.icon}
                    </TimelineDot>
                  </div>
                  {index < timelineItems.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <div className={`animate-fade-${index % 2 === 0 ? 'right' : 'left'} delay-${index}`}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography>{item.description}</Typography>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>

        <Box className="testimonials-section">
          <Typography variant="h2" className="section-title">
            Success Stories
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div className={`animate-fade-up delay-${index}`}>
                  <Box className="testimonial-card">
                    <div className="quote">"</div>
                    <Typography className="testimonial-text">
                      {testimonial.text}
                    </Typography>
                    <Box className="testimonial-author">
                      <div className="author-avatar" />
                      <div>
                        <Typography variant="h6">{testimonial.author}</Typography>
                        <Typography className="role">{testimonial.role}</Typography>
                        <Typography className="company">{testimonial.company}</Typography>
                      </div>
                    </Box>
                  </Box>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className="features-comparison">
          <Typography variant="h2" className="section-title">
            Features That Set Us Apart
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <div className="animate-fade-right">
                <Box className="comparison-card free">
                  <Typography variant="h5" className="plan-title">Free Plan</Typography>
                  <ul className="features-list">
                    <li>
                      <span className="feature-name">Basic Skill Tracking</span>
                      <span className="feature-detail">Track up to 5 skills simultaneously</span>
                    </li>
                    <li>
                      <span className="feature-name">Progress Visualization</span>
                      <span className="feature-detail">Essential charts and progress indicators</span>
                    </li>
                    <li>
                      <span className="feature-name">Community Access</span>
                      <span className="feature-detail">Join skill-based discussion groups</span>
                    </li>
                    <li>
                      <span className="feature-name">Limited Analytics</span>
                      <span className="feature-detail">Basic progress reports and insights</span>
                    </li>
                  </ul>
                  <Button
                    variant="outlined"
                    className="plan-button"
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                  </Button>
                </Box>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="animate-fade-left">
                <Box className="comparison-card pro">
                  <div className="pro-badge">PRO</div>
                  <Typography variant="h5" className="plan-title">Pro Plan</Typography>
                  <ul className="features-list">
                    <li>
                      <span className="feature-name">Advanced AI Insights</span>
                      <span className="feature-detail">Personalized recommendations and deep learning analysis</span>
                    </li>
                    <li>
                      <span className="feature-name">Unlimited Skill Tracking</span>
                      <span className="feature-detail">Track unlimited skills with detailed progression paths</span>
                    </li>
                    <li>
                      <span className="feature-name">Team Collaboration</span>
                      <span className="feature-detail">Share progress and collaborate with team members</span>
                    </li>
                    <li>
                      <span className="feature-name">Custom Dashboards</span>
                      <span className="feature-detail">Create personalized views and reporting layouts</span>
                    </li>
                    <li>
                      <span className="feature-name">Priority Support</span>
                      <span className="feature-detail">24/7 dedicated support with 1-hour response time</span>
                    </li>
                    <li>
                      <span className="feature-name">API Access</span>
                      <span className="feature-detail">Full access to MadSkillz API for custom integrations</span>
                    </li>
                  </ul>
                  <Button
                    variant="contained"
                    className="plan-button"
                    onClick={() => navigate('/login')}
                  >
                    Try Pro Free
                  </Button>
                </Box>
              </div>
            </Grid>
          </Grid>
        </Box>

        <Box className="stats-section">
          {[
            { value: '10k+', label: 'Active Users' },
            { value: '50k+', label: 'Skills Tracked' },
            { value: '95%', label: 'Success Rate' },
            { value: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <div key={index} className={`animate-fade-up delay-${index} stat-item`}>
              <Typography variant="h3">{stat.value}</Typography>
              <Typography>{stat.label}</Typography>
            </div>
          ))}
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
