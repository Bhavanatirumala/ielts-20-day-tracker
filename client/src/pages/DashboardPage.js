import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Container,
  IconButton,
  Tooltip as MuiTooltip,
  Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { ColorModeContext } from '../index';

const SECTION_COLORS = {
  Listening: '#1976d2',
  Reading: '#ff4081',
  Writing: '#4caf50',
  Speaking: '#ff9800',
  Vocabulary: '#2196f3',
};

const SECTION_LABELS = {
  Listening: 'Listening',
  Reading: 'Reading',
  Writing: 'Writing',
  Speaking: 'Speaking',
  Vocabulary: 'Vocab',
};

const getSection = (task) => {
  const t = task.toLowerCase();
  if (t.includes('listen')) return 'Listening';
  if (t.includes('read')) return 'Reading';
  if (t.includes('write') || t.includes('writing')) return 'Writing';
  if (t.includes('speak')) return 'Speaking';
  if (t.includes('vocab')) return 'Vocabulary';
  return 'Other';
};

// Debug: log each task and its detected section
// Remove or comment out after debugging
// progress.forEach(p => console.log(p.task, getSection(p.task)));

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }, theme) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill={theme.palette.text.primary}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

const DashboardPage = () => {
  const [schedule, setSchedule] = useState([]);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const scheduleRes = await axios.get('/api/schedule');
        const progressRes = await axios.get('/api/progress', config);
        setSchedule(scheduleRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getOverallProgress = () => {
    const totalTasks = schedule.reduce((acc, day) => acc + day.tasks.length, 0);
    if (totalTasks === 0) return 0;
    const completedTasks = progress.filter(p => p.status === 'done').length;
    return Math.round((completedTasks / totalTasks) * 100);
  };
  
  const overallProgress = getOverallProgress();

  // Section-wise progress calculation
  const sectionNames = ['Listening', 'Reading', 'Writing', 'Speaking', 'Vocabulary'];
  const sectionData = sectionNames.map(section => {
    const sectionTasks = progress.filter(p => getSection(p.task) === section);
    const done = sectionTasks.filter(t => t.status === 'done').length;
    return {
      name: section,
      value: sectionTasks.length ? Math.round((done / sectionTasks.length) * 100) : 0,
    };
  });

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      <AppBar position="static" color="primary" elevation={2} component={motion.div} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <Toolbar>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            IELTS 20-Day Tracker
          </Typography>
          <MuiTooltip title={colorMode.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton color="inherit" onClick={colorMode.toggleColorMode} sx={{ mr: 1 }}>
              {colorMode.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Profile">
            <IconButton component={Link} to="/profile" color="inherit" sx={{ mr: 1 }}>
              <AccountCircleIcon />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Leaderboard">
            <IconButton component={Link} to="/leaderboard" color="inherit" sx={{ mr: 1 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.secondary.main, color: '#fff', fontSize: 16 }}>🏆</Avatar>
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Discussion Board">
            <IconButton component={Link} to="/discussion" color="inherit" sx={{ mr: 1 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.info.main, color: '#fff', fontSize: 16 }}>💬</Avatar>
            </IconButton>
          </MuiTooltip>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography variant="h3" color="primary" gutterBottom align="center">
            Welcome!
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Track your IELTS progress and stay motivated every day.
          </Typography>
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Overall Progress
            </Typography>
            <LinearProgress variant="determinate" value={overallProgress} sx={{ height: 12, borderRadius: 6, background: theme.palette.background.paper }} color={overallProgress === 100 ? 'success' : 'primary'} />
            <Typography variant="h6" color="primary" sx={{ mt: 1, textAlign: 'right' }}>{overallProgress}%</Typography>
          </Box>

          {/* Section-wise Progress Chart */}
          <Box sx={{ width: '100%', mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 500, height: 320, background: theme.palette.background.paper, borderRadius: 4, boxShadow: 2, p: 2, mx: 'auto' }} component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
              <Typography variant="h6" color="secondary" align="center" sx={{ mb: 1 }}>
                Section-wise Progress
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={sectionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={props => renderPieLabel(props, theme)}
                    labelLine={false}
                  >
                    {sectionData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={SECTION_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} contentStyle={{ background: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 8, border: `1px solid ${theme.palette.divider}` }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 13, color: theme.palette.text.primary }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {schedule.map(day => (
              <Grid item xs={12} sm={6} md={3} key={day.day}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.05, boxShadow: `0 8px 32px ${theme.palette.primary.main}26` }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  sx={{ borderRadius: 4, background: theme.palette.background.paper, minHeight: 120 }}
                >
                  <CardActionArea component={Link} to={`/day/${day.day}`}>
                    <CardContent>
                      <Typography variant="h6" color="secondary" align="center">
                        Day {day.day}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Button component={Link} to="/resources" variant="contained" color="secondary" size="large">
              Helpful Resources
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage; 