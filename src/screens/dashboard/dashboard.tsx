import React, { ReactNode, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Tooltip,
  Container,
  SxProps,
  Theme
} from '@mui/material';
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
  TrendingDown,
  Info as InfoIcon,
  Assessment as AssessmentIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { keyframes } from '@emotion/react';
import { quizResultsThunks } from '../../slices/quizResultsSlice';
import { customColors } from '../../theme/colors';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px ${customColors.primary}33; }
  50% { box-shadow: 0 0 20px ${customColors.primary}66; }
  100% { box-shadow: 0 0 5px ${customColors.primary}33; }
`;

const cardSx: SxProps<Theme> = {
  p: 3,
  bgcolor: customColors.backgroundLight,
  border: `1px solid ${customColors.border}`,
  borderRadius: 2,
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
    borderColor: `${customColors.primary}4D`
  }
};

const sectionTitleSx: SxProps<Theme> = {
  color: customColors.text,
  fontWeight: 600,
  fontSize: '1.1rem',
  mb: 3,
  display: 'flex',
  alignItems: 'center',
  gap: 1
};

const chartTooltipStyle = {
  backgroundColor: customColors.backgroundDark,
  border: `1px solid ${customColors.border}`,
  color: customColors.text
};

const SectionCard: React.FC<{ title: string; icon?: ReactNode; children: ReactNode }> = ({
  title,
  icon,
  children
}) => (
  <Paper sx={cardSx} elevation={0}>
    <Typography variant="h6" sx={sectionTitleSx}>
      {icon}
      {title}
    </Typography>
    {children}
  </Paper>
);

const StatCard: React.FC<{
  icon: ReactNode;
  label: string;
  children: ReactNode;
  caption?: string;
}> = ({ icon, label, children, caption }) => (
  <Paper sx={{ ...cardSx, textAlign: 'center' }} elevation={0}>
    <Box sx={{ color: customColors.primary, mb: 1 }}>{icon}</Box>
    <Typography variant="subtitle2" sx={{ color: customColors.textSecondary, mb: 1 }}>
      {label}
    </Typography>
    {children}
    {caption && (
      <Typography variant="caption" sx={{ color: customColors.textSecondary, display: 'block', mt: 1 }}>
        {caption}
      </Typography>
    )}
  </Paper>
);

interface Achievement {
  title: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

const calculateStreaks = (quizResults: any[]) => {
  if (!Array.isArray(quizResults) || !quizResults?.length) return { currentStreak: 0, maxStreak: 0 };

  const uniqueDays = [
    ...new Set(
      quizResults.map(r => new Date(r.created_at).toDateString())
    )
  ]
    .map(d => new Date(d).getTime())
    .sort((a, b) => b - a);

  if (!uniqueDays.length) return { currentStreak: 0, maxStreak: 0 };

  const dayMs = 1000 * 3600 * 24;
  const today = new Date(new Date().toDateString()).getTime();
  const isActive = today - uniqueDays[0] <= dayMs;

  // Consecutive-day run ending at the most recent practice day
  let recentRun = 1;
  let maxStreak = 1;
  let runLength = 1;
  let runBroken = false;

  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i - 1] - uniqueDays[i] === dayMs) {
      runLength++;
      maxStreak = Math.max(maxStreak, runLength);
      if (!runBroken) recentRun = runLength;
    } else {
      runLength = 1;
      runBroken = true;
    }
  }

  const currentStreak = isActive ? recentRun : 0;

  return { currentStreak, maxStreak };
};

const calculatePerformanceTrendsData = (quizResults: any[]) => {
  if (!quizResults?.length) return [];

  interface TrendData {
    scores: number[];
    passCount: number;
    totalCount: number;
    timestamp: number;
  }

  const trends: Record<string, TrendData> = quizResults.reduce((acc, result) => {
    const dateObj = new Date(result.created_at);
    const date = dateObj.toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { scores: [], passCount: 0, totalCount: 0, timestamp: new Date(dateObj.toDateString()).getTime() };
    }
    acc[date].scores.push((result.correct_answers / result.total_questions) * 100);
    acc[date].passCount += result.status === 'PASS' ? 1 : 0;
    acc[date].totalCount += 1;
    return acc;
  }, {} as Record<string, TrendData>);

  return Object.entries(trends)
    .map(([date, data]) => ({
      date,
      timestamp: data.timestamp,
      avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      passRate: (data.passCount / data.totalCount) * 100
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
};


const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const quizResults = useSelector((state: RootState) => state.quizResults.results);
  const performanceSummary = useSelector((state: RootState) => state.quizResults.performanceSummary);
  const loading = useSelector((state: RootState) => state.quizResults.loading);

  useEffect(() => {
    void dispatch(quizResultsThunks.fetchResults());
  }, [dispatch]);

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
    if (!Array.isArray(quizResults) || !quizResults.length) return [];

    const skillStats: Record<string, {
      correctAnswers: number;
      totalQuestions: number;
      attempts: number;
      passCount: number
    }> = {};

    quizResults.forEach(result => {
      if (!skillStats[result?.skill]) {
        skillStats[result?.skill] = {
          correctAnswers: 0,
          totalQuestions: 0,
          attempts: 0,
          passCount: 0
        };
      }

      skillStats[result?.skill].correctAnswers += result?.correct_answers;
      skillStats[result?.skill].totalQuestions += result?.total_questions;
      skillStats[result?.skill].attempts += 1;
      if (result?.status === 'PASS') {
        skillStats[result?.skill].passCount += 1;
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

    if (!Array.isArray(quizResults)) {
      return achievements;
    }

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
    if (!Array.isArray(quizResults) || quizResults.length < 2) {
      return { velocity: 0, trend: 'neutral' };
    }

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
    if (!quizResults || !Array.isArray(quizResults) || quizResults.length === 0) return [];

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

  const recentResults = useMemo(() => {
    if (!Array.isArray(quizResults)) return [];
    return [...quizResults]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [quizResults]);

  const masteredCount = skillMasteryData.filter(s => s.isMastered).length;
  const hasData = Array.isArray(quizResults) && quizResults.length > 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4
              }
            }}
          />
        </Box>
      </Container>
    );
  }

  if (!hasData) {
    return (
      <Container maxWidth="xl" className="dashboard-container">
        <Box
          className="dash-anim"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            gap: 2
          }}
        >
          <QuizIcon sx={{ fontSize: 72, color: customColors.primary }} />
          <Typography variant="h4" sx={{ color: customColors.text, fontWeight: 'bold' }}>
            No activity yet
          </Typography>
          <Typography sx={{ color: customColors.textSecondary, maxWidth: 420 }}>
            Take your first quiz to unlock performance analytics, skill rankings,
            streaks, and achievements.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="dashboard-container">
      <Box className="dash-anim">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: customColors.text,
              fontWeight: 'bold'
            }}
          >
            Dashboard
          </Typography>
          <Typography sx={{ color: customColors.textSecondary, mt: 0.5 }}>
            Track your progress, streaks, and skill mastery
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Key stats */}
          <Grid item xs={6} md={3}>
            <div className="dash-anim">
              <StatCard
                icon={<LocalFireDepartment sx={{ fontSize: 40 }} />}
                label="Current Streak"
              >
                <Typography variant="h4" sx={{ color: customColors.primary }}>
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </Typography>
              </StatCard>
            </div>
          </Grid>

          <Grid item xs={6} md={3}>
            <div className="dash-anim">
              <StatCard
                icon={<EmojiEvents sx={{ fontSize: 40 }} />}
                label="Best Streak"
              >
                <Typography variant="h4" sx={{ color: customColors.primary }}>
                  {maxStreak} {maxStreak === 1 ? 'day' : 'days'}
                </Typography>
              </StatCard>
            </div>
          </Grid>

          <Grid item xs={6} md={3}>
            <div className="dash-anim">
              <StatCard
                icon={<Speed sx={{ fontSize: 40 }} />}
                label="Average Score"
              >
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
              </StatCard>
            </div>
          </Grid>

          <Grid item xs={6} md={3}>
            <div className="dash-anim">
              <StatCard
                icon={<Grade sx={{ fontSize: 40 }} />}
                label="Skills Mastered"
                caption="Requires 1000+ correct answers and 80%+ pass rate"
              >
                <Typography variant="h4" sx={{ color: customColors.primary }}>
                  {masteredCount} / {skillMasteryData.length}
                </Typography>
              </StatCard>
            </div>
          </Grid>

          {/* Summary + velocity */}
          <Grid item xs={12} md={8}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard title="Performance Summary" icon={<AssessmentIcon sx={{ color: customColors.primary }} />}>
                {performanceSummary ? (
                  <Typography
                    sx={{
                      color: customColors.text,
                      fontSize: '0.875rem',
                      lineHeight: 1.8,
                      letterSpacing: '0.01em',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {performanceSummary}
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon sx={{ color: customColors.primary, fontSize: '1.1rem' }} />
                    <Typography sx={{ color: customColors.textSecondary, fontSize: '0.875rem', lineHeight: 1.8 }}>
                      No performance summary available yet. Take more quizzes to get detailed insights!
                    </Typography>
                  </Box>
                )}
              </SectionCard>
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard title="Learning Velocity">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {learningVelocity.trend === 'improving' ? (
                    <TrendingUp sx={{ color: customColors.primary, mr: 1, fontSize: '2rem' }} />
                  ) : (
                    <TrendingDown sx={{ color: customColors.danger, mr: 1, fontSize: '2rem' }} />
                  )}
                  <Typography
                    variant="h4"
                    sx={{
                      color: learningVelocity.trend === 'improving'
                        ? customColors.primary
                        : learningVelocity.trend === 'neutral'
                          ? customColors.text
                          : customColors.danger
                    }}
                  >
                    {learningVelocity.velocity > 0 ? '+' : ''}{learningVelocity.velocity.toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                  Recent performance vs. your overall average
                </Typography>
              </SectionCard>
            </div>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard title="Performance Trends">
                <Box height={300}>
                  <ResponsiveContainer>
                    <LineChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke={customColors.border} />
                      <XAxis
                        dataKey="date"
                        stroke={customColors.text}
                        tick={{ fill: customColors.textSecondary }}
                      />
                      <YAxis
                        stroke={customColors.text}
                        tick={{ fill: customColors.textSecondary }}
                      />
                      <RechartsTooltip contentStyle={chartTooltipStyle} />
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
              </SectionCard>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard title="Skill Mastery Overview">
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
                                <Typography sx={{ color: customColors.textSecondary }}>
                                  Correct Answers: {data.correctAnswers}/1000
                                </Typography>
                                <Typography sx={{ color: customColors.textSecondary }}>
                                  Pass Rate: {data.passRate.toFixed(1)}%
                                </Typography>
                                <Typography sx={{
                                  color: data.isMastered ? customColors.success : customColors.textSecondary,
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
              </SectionCard>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard title="Study Pattern">
                <Box height={200}>
                  <ResponsiveContainer>
                    <AreaChart data={studyPatterns}>
                      <CartesianGrid strokeDasharray="3 3" stroke={customColors.border} />
                      <XAxis
                        dataKey="hour"
                        stroke={customColors.text}
                        tick={{ fill: customColors.textSecondary }}
                      />
                      <YAxis
                        stroke={customColors.text}
                        tick={{ fill: customColors.textSecondary }}
                        allowDecimals={false}
                      />
                      <RechartsTooltip contentStyle={chartTooltipStyle} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        name="Quizzes"
                        stroke={customColors.primary}
                        fill={customColors.primary}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Typography variant="caption" sx={{ color: customColors.textSecondary }}>
                  Times of day when you usually take quizzes
                </Typography>
              </SectionCard>
            </div>
          </Grid>

          {/* Skills ranking */}
          <Grid item xs={12} md={7}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard
                title="Skills Ranking"
                icon={
                  <Tooltip title="Rating = (Pass Rate × 0.6) + (Questions ÷ 1000 × 40)" placement="top">
                    <InfoIcon sx={{ fontSize: '1rem', color: customColors.textSecondary, cursor: 'help' }} />
                  </Tooltip>
                }
              >
                {skillMasteryData.map((skill, index) => (
                  <Box key={skill.skill} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ color: customColors.textSecondary, minWidth: 28 }}>
                          #{index + 1}
                        </Typography>
                        <Typography variant="h6" sx={{ color: customColors.text }}>
                          {skill.skill}
                        </Typography>
                        {skill.isMastered && (
                          <Tooltip title="Mastered" placement="top">
                            <WorkspacePremium sx={{ color: '#FFC107', fontSize: '1.2rem' }} />
                          </Tooltip>
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ color: customColors.primary }}>
                        {skill.rating.toFixed(1)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={skill.rating}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: `${customColors.primary}22`,
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: customColors.primary,
                          borderRadius: 5,
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Grade sx={{ fontSize: '1rem', color: customColors.primary }} />
                        <Typography variant="caption" sx={{ color: customColors.textSecondary }}>
                          Pass Rate: {skill.passRate.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: '1rem', color: customColors.success }} />
                        <Typography variant="caption" sx={{ color: customColors.textSecondary }}>
                          Questions: {skill.totalQuestions}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </SectionCard>
            </div>
          </Grid>

          {/* Achievements */}
          <Grid item xs={12} md={5}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard title={`Achievements (${achievements.length})`} icon={<EmojiEvents sx={{ color: customColors.primary }} />}>
                {achievements.length ? (
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {achievements.map((achievement, index) => (
                      <div
                        key={achievement.title}
                        className="dash-anim"
                        style={{ animationDelay: `${index * 0.1}s` }}
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
                      </div>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: customColors.textSecondary, fontSize: '0.875rem' }}>
                    Keep practicing to unlock your first achievement — maintain a 2-day streak or answer 100 questions.
                  </Typography>
                )}
              </SectionCard>
            </div>
          </Grid>

          {/* Recent activity */}
          <Grid item xs={12}>
            <div className="dash-anim" style={{ height: '100%' }}>
              <SectionCard title="Recent Activity">
                <Box>
                  {recentResults.map((result, index) => (
                    <div
                      key={result.id}
                      className="dash-anim"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              flexShrink: 0,
                              bgcolor: result.status === 'PASS'
                                ? customColors.success
                                : customColors.danger
                            }}
                          >
                            {result.status === 'PASS' ? <CheckCircleIcon /> : <CancelIcon />}
                          </Box>
                          {index < recentResults.length - 1 && (
                            <Box sx={{ width: '2px', flex: 1, bgcolor: customColors.border, my: 0.5 }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, pb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="h6" component="span" sx={{ color: customColors.text }}>
                              {result.quiz_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: customColors.textSecondary }}>
                              {new Date(result.created_at).toLocaleDateString()} at{' '}
                              {new Date(result.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                          <Typography sx={{ color: customColors.textSecondary }}>
                            {result.skill} — {result.correct_answers}/{result.total_questions} correct
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(result.correct_answers / result.total_questions) * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: customColors.border,
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  bgcolor: result.status === 'PASS'
                                    ? customColors.primary
                                    : customColors.danger
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </div>
                  ))}
                </Box>
              </SectionCard>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
