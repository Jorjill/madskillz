import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../state/store';
import {
  Box,
  Grid,
  Typography,
  Card,
  Paper,
  Tooltip,
  LinearProgress,
  Container
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents,
  Speed,
  Grade,
  Psychology,
  Whatshot,
  LocalFireDepartment,
  WorkspacePremium,
  MilitaryTech,
  TrendingUp,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import { useSpring, animated, config } from 'react-spring';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import { customColors } from '../../theme/colors';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { RootState } from '../../state/store';
import { quizResultsThunks } from '../../slices/quizResultsSlice';

interface Achievement {
  title: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

interface StatsNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px ${customColors.primary}33; }
  50% { box-shadow: 0 0 20px ${customColors.primary}66; }
  100% { box-shadow: 0 0 5px ${customColors.primary}33; }
`;

const BaseMotionCard = motion.create(Card);
const BaseMotionPaper = motion.create(Paper);

const MotionCard = styled(BaseMotionCard)`
  &:hover {
    animation: ${glowAnimation} 2s infinite;
  }
`;

const MotionPaper = styled(BaseMotionPaper)`
  &:hover {
    animation: ${glowAnimation} 2s infinite;
  }
`;

const StatsNumber: React.FC<StatsNumberProps> = ({ value, suffix = '', duration = 2 }) => {
  useSpring({
    from: { number: 0 },
    to: { number: value },
    config: config.molasses,
  });

  return (
    <animated.div style={{ fontSize: '2rem', color: customColors.primary }}>
      <CountUp end={value} duration={duration} suffix={suffix} />
    </animated.div>
  );
};


const calculateStreaks = (quizResults: any[]) => {
  if (!quizResults?.length) return { currentStreak: 0, maxStreak: 0 };

  const sortedResults = [...quizResults]
    .sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  let currentStreak = 1;
  let maxStreak = 1;
  let lastQuizDate = new Date(sortedResults[0].created_at).toDateString();

  for (let i = 1; i < sortedResults.length; i++) {
    const dayDiff = Math.abs(
      (new Date(lastQuizDate).getTime() - new Date(sortedResults[i].created_at).getTime()) 
      / (1000 * 3600 * 24)
    );
    
    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
    lastQuizDate = new Date(sortedResults[i].created_at).toDateString();
  }

  return { currentStreak, maxStreak };
};

const calculatePerformanceTrendsData = (quizResults: any[]) => {
  if (!quizResults?.length) return [];

  interface TrendData {
    scores: number[];
    passCount: number;
    totalCount: number;
  }

  const trends: Record<string, TrendData> = quizResults.reduce((acc, result) => {
    const date = new Date(result.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { scores: [], passCount: 0, totalCount: 0 };
    }
    acc[date].scores.push((result.correct_answers / result.total_questions) * 100);
    acc[date].passCount += result.status === 'PASS' ? 1 : 0;
    acc[date].totalCount += 1;
    return acc;
  }, {} as Record<string, TrendData>);

  return Object.entries(trends).map(([date, data]) => ({
    date,
    avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
    passRate: (data.passCount / data.totalCount) * 100
  }));
};


const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const controls = useAnimation();
  const quizResults = useSelector((state: RootState) => state.quizResults.results);

  useEffect(() => {
    void dispatch(quizResultsThunks.fetchResults());
  }, [dispatch]);

  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
    };
    sequence();
  }, [controls]);

  const { currentStreak, maxStreak } = useMemo(() => 
    calculateStreaks(quizResults), [quizResults]
  );

  const averageScore = useMemo(() => 
    quizResults?.length ? Math.round(
      quizResults.reduce((acc, result) => 
        acc + (result.correct_answers / result.total_questions) * 100, 0
      ) / quizResults.length
    ) : 0, [quizResults]
  );

  const skillMasteryData = useMemo(() => {
    if (!quizResults?.length) return [];

    const skillStats: Record<string, {
      correctAnswers: number,
      totalQuestions: number,
      attempts: number,
      passCount: number
    }> = {};

    quizResults.forEach(result => {
      if (!skillStats[result.skill]) {
        skillStats[result.skill] = {
          correctAnswers: 0,
          totalQuestions: 0,
          attempts: 0,
          passCount: 0
        };
      }
      
      skillStats[result.skill].correctAnswers += result.correct_answers;
      skillStats[result.skill].totalQuestions += result.total_questions;
      skillStats[result.skill].attempts += 1;
      if (result.status === 'PASS') {
        skillStats[result.skill].passCount += 1;
      }
    });

    const skillsData = Object.entries(skillStats)
      .map(([skill, data]) => {
        const passRate = (data.passCount / data.attempts) * 100;
        const isMastered = data.correctAnswers >= 1000 && passRate >= 80;
        
        const questionsWeight = Math.min(data.totalQuestions, 1000) / 1000 * 40;
        const passRateWeight = passRate * 0.6;
        const rating = passRateWeight + questionsWeight;

        const masteryProgress = Math.min(
          100,
          Math.min(
            (data.correctAnswers / 1000) * 100,
            passRate
          )
        );

        return {
          skill,
          correctAnswers: data.correctAnswers,
          totalQuestions: data.totalQuestions,
          passRate,
          masteryLevel: masteryProgress,
          isMastered,
          rating
        };
      })
      .sort((a, b) => b.rating - a.rating);

    return skillsData;
  }, [quizResults]);

  const performanceTrends = useMemo(() => 
    calculatePerformanceTrendsData(quizResults), [quizResults]
  );

  const achievements: Achievement[] = useMemo(() => {
    const achievements: Achievement[] = [];

    // Streak Achievements
    if (currentStreak >= 2) achievements.push({ 
      title: 'Momentum', 
      icon: <LocalFireDepartment sx={{ fontSize: 40 }} />,
      description: '2+ day streak',
      color: '#FF9800'
    });

    if (currentStreak >= 5) achievements.push({ 
      title: 'On Fire', 
      icon: <Whatshot sx={{ fontSize: 40 }} />,
      description: '5+ day streak',
      color: '#FF5722'
    });

    if (currentStreak >= 10) achievements.push({ 
      title: 'Unstoppable', 
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      description: '10+ day streak',
      color: '#F44336'
    });

    if (currentStreak >= 30) achievements.push({ 
      title: 'Monthly Master', 
      icon: <MilitaryTech sx={{ fontSize: 40 }} />,
      description: '30+ day streak',
      color: '#E91E63'
    });

    if (currentStreak >= 100) achievements.push({ 
      title: 'Centurion', 
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      description: '100+ day streak',
      color: '#9C27B0'
    });

    // Question Count Achievements
    const totalQuestions = skillMasteryData.reduce((sum, skill) => sum + skill.totalQuestions, 0);
    
    if (totalQuestions >= 100) achievements.push({
      title: 'Century',
      icon: <Psychology sx={{ fontSize: 40 }} />,
      description: '100+ questions answered',
      color: '#2196F3'
    });

    if (totalQuestions >= 500) achievements.push({
      title: 'Scholar',
      icon: <Grade sx={{ fontSize: 40 }} />,
      description: '500+ questions answered',
      color: '#03A9F4'
    });

    if (totalQuestions >= 1000) achievements.push({
      title: 'Knowledge Seeker',
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      description: '1000+ questions answered',
      color: '#00BCD4'
    });

    if (totalQuestions >= 5000) achievements.push({
      title: 'Grand Scholar',
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      description: '5000+ questions answered',
      color: '#009688'
    });

    // Skill Rating Achievements
    const highestRatedSkill = skillMasteryData[0]; // Already sorted by rating
    if (highestRatedSkill && highestRatedSkill.rating >= 70) achievements.push({
      title: 'Rising Star',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      description: 'Achieve 70+ rating in any skill',
      color: '#4CAF50'
    });

    if (highestRatedSkill && highestRatedSkill.rating >= 85) achievements.push({
      title: 'Expert',
      icon: <Psychology sx={{ fontSize: 40 }} />,
      description: 'Achieve 85+ rating in any skill',
      color: '#8BC34A'
    });

    if (highestRatedSkill && highestRatedSkill.rating >= 95) achievements.push({
      title: 'Grandmaster',
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      description: 'Achieve 95+ rating in any skill',
      color: '#CDDC39'
    });

    // Mastery Achievements
    const masteredSkills = skillMasteryData.filter(skill => skill.isMastered).length;
    
    if (masteredSkills >= 1) achievements.push({
      title: 'First Mastery',
      icon: <Grade sx={{ fontSize: 40 }} />,
      description: 'Master your first skill (1000+ correct answers, 80%+ pass rate)',
      color: '#FFC107'
    });

    if (masteredSkills >= 3) achievements.push({
      title: 'Triple Threat',
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      description: 'Master 3+ skills',
      color: '#FF9800'
    });

    if (masteredSkills >= 5) achievements.push({
      title: 'Polymath',
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      description: 'Master 5+ skills',
      color: '#FF5722'
    });

    // Perfect Score Achievements
    const consecutivePerfectScores = quizResults.reduce((acc, curr, i, arr) => {
      if (i === 0 && curr.correct_answers === curr.total_questions) return 1;
      if (curr.correct_answers === curr.total_questions && 
          arr[i-1]?.correct_answers === arr[i-1]?.total_questions) {
        return acc + 1;
      }
      return curr.correct_answers === curr.total_questions ? 1 : 0;
    }, 0);

    if (consecutivePerfectScores >= 3) achievements.push({
      title: 'Perfect Streak',
      icon: <Grade sx={{ fontSize: 40 }} />,
      description: '3+ consecutive perfect scores',
      color: '#795548'
    });

    return achievements;
  }, [currentStreak, skillMasteryData, quizResults]);

  const learningVelocity = useMemo(() => {
    if (!quizResults || quizResults.length < 2) return { velocity: 0, trend: 'neutral' };

    const recentScores = [...quizResults]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(q => (q.correct_answers / q.total_questions) * 100);

    const averageRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const averageOverall = quizResults.reduce((acc, q) => 
      acc + (q.correct_answers / q.total_questions) * 100, 0) / quizResults.length;

    return {
      velocity: averageRecent - averageOverall,
      trend: averageRecent > averageOverall ? 'improving' : 'declining'
    };
  }, [quizResults]);

  const studyPatterns = useMemo(() => {
    if (!quizResults || quizResults.length === 0) return [];

    const hourCounts = new Array(24).fill(0);
    quizResults.forEach(quiz => {
      const hour = new Date(quiz.created_at).getHours();
      hourCounts[hour]++;
    });

    return hourCounts.map((count, hour) => ({
      hour: hour.toString().padStart(2, '0') + ':00',
      count
    }));
  }, [quizResults]);

  const cardVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0,
      rotateX: -15
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        mass: 0.8
      }
    }
  };

  const chartVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 1
      }
    }
  };

  return (
    <Box className="dashboard-container">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  color: customColors.text,
                  textShadow: `0 0 10px ${customColors.primary}33`,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  mb: 4
                }}
              >
                Performance Analytics
              </Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div variants={cardVariants}>
              <MotionPaper
                sx={{ 
                  p: 3, 
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  mb: 3
                }}
              >
                <Typography variant="h5" sx={{ color: customColors.text, mb: 2 }}>
                  Achievements Unlocked
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                    >
                      <Tooltip 
                        title={achievement.description}
                        placement="top"
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            width: 80,
                            height: 80,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1) rotate(5deg)',
                            }
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              bgcolor: `${achievement.color}22`,
                              border: `2px solid ${achievement.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: achievement.color,
                              animation: `${glowAnimation} 2s ease-in-out infinite`
                            }}
                          >
                            {achievement.icon}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: -25,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              color: achievement.color,
                              width: '100%',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {achievement.title}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </motion.div>
                  ))}
                </Box>
              </MotionPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div variants={cardVariants}>
              <MotionCard
                sx={{ 
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  p: 3
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: customColors.text, mb: 3 }}>
                  Skills Ranking
                </Typography>
                {skillMasteryData.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box sx={{ mb: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ color: customColors.text }}>
                          #{index + 1} {skill.skill}
                        </Typography>
                        <Typography variant="h6" sx={{ color: customColors.primary }}>
                          {skill.rating.toFixed(1)}
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'relative', mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={skill.rating}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: `${customColors.primary}22`,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: customColors.primary,
                              borderRadius: 5,
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.875rem'
                      }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Grade sx={{ fontSize: '1rem', color: customColors.primary }} />
                            <Typography variant="caption">
                              Pass Rate: {skill.passRate.toFixed(1)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CheckCircleIcon sx={{ fontSize: '1rem', color: customColors.success }} />
                            <Typography variant="caption">
                              Questions: {skill.totalQuestions}
                            </Typography>
                          </Box>
                        </Box>
                        <Tooltip title="Rating = (Pass Rate × 0.6) + (Questions ÷ 1000 × 40)" placement="top">
                          <InfoIcon sx={{ fontSize: '1rem', color: customColors.text, cursor: 'help' }} />
                        </Tooltip>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </MotionCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div variants={cardVariants}>
              <MotionPaper
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <LocalFireDepartment sx={{ fontSize: 40, color: customColors.primary }} />
                <Typography variant="h6" sx={{ color: customColors.text }}>Current Streak</Typography>
                <StatsNumber value={currentStreak} suffix=" days" />
              </MotionPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div variants={cardVariants}>
              <MotionPaper
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <EmojiEvents sx={{ fontSize: 40, color: customColors.primary }} />
                <Typography variant="h6" sx={{ color: customColors.text }}>Best Streak</Typography>
                <StatsNumber value={maxStreak} suffix=" days" />
              </MotionPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div variants={cardVariants}>
              <MotionPaper
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <Speed sx={{ fontSize: 40, color: customColors.primary }} />
                <Typography variant="h6" sx={{ color: customColors.text }}>Average Score</Typography>
                <Box sx={{ width: 100, height: 100, margin: 'auto' }}>
                  <CircularProgressbar
                    value={averageScore}
                    text={`${averageScore}%`}
                    styles={buildStyles({
                      textColor: customColors.text,
                      pathColor: customColors.primary,
                      trailColor: customColors.border
                    })}
                  />
                </Box>
              </MotionPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div variants={cardVariants}>
              <MotionPaper
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <Grade sx={{ fontSize: 40, color: customColors.primary }} />
                <Typography variant="h6" sx={{ color: customColors.text }}>Skills Mastered</Typography>
                <StatsNumber 
                  value={skillMasteryData.filter(skill => skill.isMastered).length} 
                  suffix={` / ${skillMasteryData.length}`}
                />
                <Typography variant="caption" sx={{ color: customColors.text, display: 'block', mt: 1 }}>
                  Requires 1000+ correct answers and 80%+ pass rate
                </Typography>
              </MotionPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={cardVariants}>
              <MotionCard
                sx={{ 
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  p: 3
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: customColors.text }}>
                  Learning Velocity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ 
                    color: learningVelocity.trend === 'improving' ? customColors.primary : customColors.danger,
                    mr: 1,
                    fontSize: '2rem'
                  }} />
                  <Typography variant="h4" sx={{ 
                    color: learningVelocity.trend === 'improving' ? customColors.primary : customColors.danger 
                  }}>
                    {learningVelocity.velocity > 0 ? '+' : ''}{learningVelocity.velocity.toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: customColors.text }}>
                  Your recent performance compared to overall average
                </Typography>
              </MotionCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={cardVariants}>
              <MotionCard
                sx={{ 
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  p: 3
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: customColors.text }}>
                  Study Pattern Analysis
                </Typography>
                <Box height={200}>
                  <ResponsiveContainer>
                    <AreaChart data={studyPatterns}>
                      <CartesianGrid strokeDasharray="3 3" stroke={customColors.border} />
                      <XAxis 
                        dataKey="hour" 
                        stroke={customColors.text}
                        tick={{ fill: customColors.text }}
                      />
                      <YAxis 
                        stroke={customColors.text}
                        tick={{ fill: customColors.text }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: customColors.backgroundDark,
                          border: `1px solid ${customColors.border}`,
                          color: customColors.text
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={customColors.primary}
                        fill={customColors.primary}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </MotionCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={chartVariants}>
              <MotionCard
                sx={{ 
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  p: 3
                }}
                whileHover={{ scale: 1.01 }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: customColors.text }}>
                  Skill Mastery Overview
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer>
                    <RadarChart data={skillMasteryData}>
                      <PolarGrid stroke={customColors.border} />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ fill: customColors.text }}
                      />
                      <PolarRadiusAxis 
                        tick={{ fill: customColors.text }}
                      />
                      <Radar
                        name="Mastery Progress"
                        dataKey="masteryLevel"
                        stroke={customColors.primary}
                        fill={customColors.primary}
                        fillOpacity={0.6}
                      />
                      <RechartsTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <Box sx={{ 
                                bgcolor: customColors.backgroundDark,
                                p: 2,
                                border: `1px solid ${customColors.border}`,
                                borderRadius: 1
                              }}>
                                <Typography sx={{ color: customColors.text }}>
                                  {data.skill}
                                </Typography>
                                <Typography sx={{ color: customColors.text }}>
                                  Correct Answers: {data.correctAnswers}/1000
                                </Typography>
                                <Typography sx={{ color: customColors.text }}>
                                  Pass Rate: {data.passRate.toFixed(1)}%
                                </Typography>
                                <Typography sx={{ 
                                  color: data.isMastered ? customColors.success : customColors.text,
                                  fontWeight: 'bold'
                                }}>
                                  {data.isMastered ? 'MASTERED' : 'IN PROGRESS'}
                                </Typography>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </MotionCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={chartVariants}>
              <MotionCard
                sx={{ 
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  p: 3
                }}
                whileHover={{ scale: 1.01 }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: customColors.text }}>
                  Performance Trends
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer>
                    <LineChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke={customColors.border} />
                      <XAxis 
                        dataKey="date" 
                        stroke={customColors.text}
                        tick={{ fill: customColors.text }}
                      />
                      <YAxis 
                        stroke={customColors.text}
                        tick={{ fill: customColors.text }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: customColors.backgroundDark,
                          border: `1px solid ${customColors.border}`,
                          color: customColors.text
                        }}
                      />
                      <Legend wrapperStyle={{ color: customColors.text }} />
                      <Line
                        type="monotone"
                        dataKey="avgScore"
                        name="Average Score"
                        stroke={customColors.primary}
                        strokeWidth={2}
                        dot={{ fill: customColors.primary }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="passRate"
                        name="Pass Rate"
                        stroke={customColors.success}
                        strokeWidth={2}
                        dot={{ fill: customColors.success }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </MotionCard>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div variants={cardVariants}>
              <MotionCard
                sx={{ 
                  bgcolor: customColors.backgroundLight,
                  borderRadius: 2,
                  p: 3
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: customColors.text }}>
                  Recent Activity
                </Typography>
                <Timeline>
                  {quizResults.slice(0, 5).map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TimelineItem>
                        <TimelineSeparator>
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <TimelineDot 
                              sx={{ 
                                bgcolor: result.status === 'PASS' 
                                  ? customColors.primary 
                                  : customColors.danger,
                                cursor: 'pointer'
                              }}
                            >
                              {result.status === 'PASS' ? <CheckCircleIcon /> : <CancelIcon />}
                            </TimelineDot>
                          </motion.div>
                          {index < 4 && (
                            <TimelineConnector sx={{ bgcolor: customColors.border }} />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Typography variant="h6" component="span" sx={{ color: customColors.text }}>
                              {result.quiz_name}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {result.skill} - {result.correct_answers}/{result.total_questions} correct
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(result.correct_answers / result.total_questions) * 100}
                                sx={{
                                  bgcolor: customColors.border,
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: result.status === 'PASS' 
                                      ? customColors.primary 
                                      : customColors.danger
                                  }
                                }}
                              />
                            </Box>
                            <Typography 
                              variant="caption" 
                              display="block" 
                              sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}
                            >
                              {new Date(result.created_at).toLocaleDateString()} at{' '}
                              {new Date(result.created_at).toLocaleTimeString()}
                            </Typography>
                          </motion.div>
                        </TimelineContent>
                      </TimelineItem>
                    </motion.div>
                  ))}
                </Timeline>
              </MotionCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
