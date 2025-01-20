import React, { useEffect } from 'react';
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
  Stars,
  Whatshot,
  LocalFireDepartment,
  WorkspacePremium,
  EmojiObjects,
  MilitaryTech,
  AutoGraph,
  AccessTime,
  CalendarMonth,
  TrendingUp,
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

interface SkillMasteryData {
  totalScore: number;
  count: number;
  passCount: number;
}

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

interface SkillStats {
  totalScore: number;
  attempts: number;
  highestScore: number;
  passCount: number;
  lastAttempt: string;
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

  const calculateStreaks = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    let lastQuizDate: string | null = null;

    if (!quizResults || quizResults.length === 0) {
      return { currentStreak: 0, maxStreak: 0 };
    }

    const sortedResults = [...quizResults].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    sortedResults.forEach((result, index) => {
      const quizDate = new Date(result.created_at).toDateString();
      
      if (index === 0) {
        currentStreak = 1;
        lastQuizDate = quizDate;
      } else if (lastQuizDate) {
        const dayDiff = Math.abs(
          (new Date(lastQuizDate).getTime() - new Date(quizDate).getTime()) / (1000 * 3600 * 24)
        );
        
        if (dayDiff === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
        
        lastQuizDate = quizDate;
      }
    });

    return { currentStreak, maxStreak };
  };

  const { currentStreak, maxStreak } = calculateStreaks();

  const calculateSkillMastery = () => {
    if (!quizResults || quizResults.length === 0) {
      return [];
    }

    const skillMastery: Record<string, SkillMasteryData> = {};
    quizResults.forEach(result => {
      if (!skillMastery[result.skill]) {
        skillMastery[result.skill] = {
          totalScore: 0,
          count: 0,
          passCount: 0
        };
      }
      skillMastery[result.skill].totalScore += (result.correct_answers / result.total_questions) * 100;
      skillMastery[result.skill].count += 1;
      if (result.status === 'PASS') {
        skillMastery[result.skill].passCount += 1;
      }
    });

    return Object.entries(skillMastery).map(([skill, data]) => ({
      skill,
      masteryLevel: (data.totalScore / data.count) * (data.passCount / data.count),
      passRate: (data.passCount / data.count) * 100
    }));
  };

  const skillMasteryData = calculateSkillMastery();

  const calculatePerformanceTrends = () => {
    if (!quizResults || quizResults.length === 0) {
      return [];
    }

    interface TrendData {
      scores: number[];
      passCount: number;
      totalCount: number;
    }

    const trends: Record<string, TrendData> = quizResults.reduce((acc, result) => {
      const date = new Date(result.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          scores: [],
          passCount: 0,
          totalCount: 0
        };
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

  const performanceTrends = calculatePerformanceTrends();

  const averageScore = quizResults && quizResults.length > 0
    ? Math.round(
        quizResults.reduce((acc, result) => 
          acc + (result.correct_answers / result.total_questions) * 100, 0
        ) / quizResults.length
      )
    : 0;

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

  const getAchievements = () => {
    const achievements: Achievement[] = [];
    const uniqueSkills = new Set(quizResults.map(q => q.skill)).size;
    const perfectScores = quizResults.filter(q => q.correct_answers === q.total_questions).length;
    const averageScore = quizResults.length > 0 
      ? quizResults.reduce((acc, curr) => acc + (curr.correct_answers / curr.total_questions * 100), 0) / quizResults.length 
      : 0;
    const consecutivePerfectScores = quizResults.reduce((acc, curr, i, arr) => {
      if (i === 0 && curr.correct_answers === curr.total_questions) return 1;
      if (curr.correct_answers === curr.total_questions && arr[i-1]?.correct_answers === arr[i-1]?.total_questions) {
        return acc + 1;
      }
      return curr.correct_answers === curr.total_questions ? 1 : 0;
    }, 0);

    if (currentStreak >= 2) achievements.push({ 
      title: 'Momentum', 
      icon: <LocalFireDepartment sx={{ fontSize: 40 }} />,
      description: '2+ day streak',
      color: '#FFA726'
    });

    if (currentStreak >= 5) achievements.push({ 
      title: 'On Fire', 
      icon: <Whatshot sx={{ fontSize: 40 }} />,
      description: '5+ day streak',
      color: '#FF7043'
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

    if (consecutivePerfectScores >= 2) achievements.push({ 
      title: 'Double Perfect', 
      icon: <Grade sx={{ fontSize: 40 }} />,
      description: '2 perfect scores in a row',
      color: '#2196F3'
    });

    if (consecutivePerfectScores >= 5) achievements.push({ 
      title: 'Perfect Pentathlon', 
      icon: <Stars sx={{ fontSize: 40 }} />,
      description: '5 perfect scores in a row',
      color: '#3F51B5'
    });

    if (consecutivePerfectScores >= 10) achievements.push({ 
      title: 'Perfect Decathlon', 
      icon: <AutoGraph sx={{ fontSize: 40 }} />,
      description: '10 perfect scores in a row',
      color: '#673AB7'
    });

    if (consecutivePerfectScores >= 100) achievements.push({ 
      title: 'Perfect Century', 
      icon: <EmojiObjects sx={{ fontSize: 40 }} />,
      description: '100 perfect scores in a row',
      color: '#009688'
    });

    if (uniqueSkills >= 3) achievements.push({ 
      title: 'Versatile', 
      icon: <Psychology sx={{ fontSize: 40 }} />,
      description: '3+ different skills practiced',
      color: '#4CAF50'
    });

    if (perfectScores >= 5) achievements.push({ 
      title: 'Excellence', 
      icon: <Speed sx={{ fontSize: 40 }} />,
      description: '5+ perfect scores',
      color: '#FF4081'
    });

    if (averageScore >= 80) achievements.push({ 
      title: 'High Achiever', 
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      description: 'Average score above 80%',
      color: '#00BCD4'
    });

    if (averageScore >= 90) achievements.push({ 
      title: 'Expert', 
      icon: <Psychology sx={{ fontSize: 40 }} />,
      description: 'Average score above 90%',
      color: '#1976D2'
    });

    if (averageScore >= 95) achievements.push({ 
      title: 'Grandmaster', 
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      description: 'Average score above 95%',
      color: '#303F9F'
    });

    const skillMasteryMap: Record<string, { totalScore: number; count: number }> = {};
    quizResults.forEach(result => {
      if (!skillMasteryMap[result.skill]) {
        skillMasteryMap[result.skill] = {
          totalScore: 0,
          count: 0
        };
      }
      skillMasteryMap[result.skill].totalScore += (result.correct_answers / result.total_questions * 100);
      skillMasteryMap[result.skill].count += 1;
    });

    const masteredSkills = Object.entries(skillMasteryMap).filter(
      ([_, data]) => (data.totalScore / data.count) >= 90
    ).length;

    if (masteredSkills >= 1) achievements.push({ 
      title: 'Specialist', 
      icon: <Stars sx={{ fontSize: 40 }} />,
      description: 'Mastered first skill (90%+ avg)',
      color: '#7B1FA2'
    });

    if (masteredSkills >= 3) achievements.push({ 
      title: 'Triple Threat', 
      icon: <AutoGraph sx={{ fontSize: 40 }} />,
      description: 'Mastered 3 skills (90%+ avg)',
      color: '#512DA8'
    });

    if (masteredSkills >= 5) achievements.push({ 
      title: 'Polymath', 
      icon: <EmojiObjects sx={{ fontSize: 40 }} />,
      description: 'Mastered 5 skills (90%+ avg)',
      color: '#1A237E'
    });

    const totalQuizzes = quizResults.length;
    
    if (totalQuizzes >= 10) achievements.push({ 
      title: 'Dedicated', 
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      description: 'Completed 10+ quizzes',
      color: '#00796B'
    });

    if (totalQuizzes >= 50) achievements.push({ 
      title: 'Quiz Master', 
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      description: 'Completed 50+ quizzes',
      color: '#004D40'
    });

    if (totalQuizzes >= 100) achievements.push({ 
      title: 'Quiz Legend', 
      icon: <MilitaryTech sx={{ fontSize: 40 }} />,
      description: 'Completed 100+ quizzes',
      color: '#006064'
    });

    return achievements;
  };

  const calculateLearningVelocity = () => {
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
  };

  const calculateStudyPatterns = () => {
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
  };

  const achievements = getAchievements();
  const learningVelocity = calculateLearningVelocity();
  const studyPatterns = calculateStudyPatterns();

  const calculateSkillPerformance = () => {
    if (!quizResults || quizResults.length === 0) return [];

    const skillStats: Record<string, SkillStats> = {};

    quizResults.forEach(result => {
      if (!skillStats[result.skill]) {
        skillStats[result.skill] = {
          totalScore: 0,
          attempts: 0,
          highestScore: 0,
          passCount: 0,
          lastAttempt: result.created_at
        };
      }
      
      const score = (result.correct_answers / result.total_questions) * 100;
      skillStats[result.skill].totalScore += score;
      skillStats[result.skill].attempts += 1;
      skillStats[result.skill].highestScore = Math.max(skillStats[result.skill].highestScore, score);
      skillStats[result.skill].passCount += result.status === 'PASS' ? 1 : 0;
      
      if (new Date(result.created_at) > new Date(skillStats[result.skill].lastAttempt)) {
        skillStats[result.skill].lastAttempt = result.created_at;
      }
    });

    return Object.entries(skillStats)
      .map(([skill, stats]) => ({
        skill,
        averageScore: Math.round(stats.totalScore / stats.attempts),
        highestScore: Math.round(stats.highestScore),
        attempts: stats.attempts,
        passRate: Math.round((stats.passCount / stats.attempts) * 100),
        lastAttempt: stats.lastAttempt
      }))
      .sort((a, b) => b.averageScore - a.averageScore);
  };

  const skillPerformance = calculateSkillPerformance();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            when: "beforeChildren",
            staggerChildren: 0.2,
            delayChildren: 0.3,
          }
        }
      }}
      style={{
        backgroundColor: customColors.backgroundDark,
        minHeight: '100vh',
        padding: '24px'
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <motion.div
            variants={{
              hidden: { y: -20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
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
              {skillPerformance.map((skill, index) => (
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
                        {skill.averageScore}%
                      </Typography>
                    </Box>
                    <Box sx={{ position: 'relative', mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={skill.averageScore}
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: `${skill.highestScore}%`,
                          transform: 'translate(-50%, -50%)',
                          width: 3,
                          height: 16,
                          backgroundColor: customColors.primary,
                          borderRadius: 2,
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
                            Best: {skill.highestScore}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircleIcon sx={{ fontSize: '1rem', color: customColors.success }} />
                          <Typography variant="caption">
                            Pass Rate: {skill.passRate}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption">
                        {skill.attempts} attempts
                      </Typography>
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
                value={skillMasteryData.filter(skill => skill.masteryLevel > 80).length} 
                suffix={` / ${skillMasteryData.length}`}
              />
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
                      name="Mastery Level"
                      dataKey="masteryLevel"
                      stroke={customColors.primary}
                      fill={customColors.primary}
                      fillOpacity={0.6}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: customColors.backgroundDark,
                        border: `1px solid ${customColors.border}`,
                        color: customColors.text
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
    </motion.div>
  );
};

export default Dashboard;
