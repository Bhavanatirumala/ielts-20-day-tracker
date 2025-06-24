import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Avatar,
  LinearProgress,
  Container,
  Stack,
  Grid,
  Tooltip as MuiTooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/api/leaderboard');
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      <AppBar position="static" color="primary" elevation={2} component={motion.div} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <Toolbar>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Leaderboard
          </Typography>
          <Button component={Link} to="/dashboard" color="inherit" startIcon={<ArrowBackIcon />}>Dashboard</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: theme.palette.background.paper }} component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography variant="h4" color="primary" fontWeight={700} align="center" gutterBottom>Top Performers</Typography>
          <Grid container spacing={2} justifyContent="center">
            {users.length === 0 && (
              <Grid item xs={12}>
                <Typography align="center" color="text.secondary">No leaderboard data available.</Typography>
              </Grid>
            )}
            {users.map((user, idx) => (
              <Grid item xs={12} key={user.id}>
                <Paper elevation={idx < 3 ? 6 : 2} sx={{ p: 2, mb: 2, borderRadius: 3, background: idx === 0 ? theme.palette.success.light : theme.palette.background.paper, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, textAlign: 'center' }}>
                    {idx < 3 ? <EmojiEventsIcon color={idx === 0 ? 'warning' : idx === 1 ? 'secondary' : 'info'} /> : <Typography variant="h6">{idx + 1}</Typography>}
                  </Box>
                  <Avatar src={user.profilePic} sx={{ width: 56, height: 56, mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" color="text.primary">{user.name}</Typography>
                    <MuiTooltip title={`Streak: ${user.streak} days`}><Typography variant="body2" color="text.secondary">🔥 {user.streak} day streak</Typography></MuiTooltip>
                    <LinearProgress variant="determinate" value={user.percent} sx={{ height: 10, borderRadius: 5, mt: 1, background: theme.palette.background.default }} color={user.percent === 100 ? 'success' : 'primary'} />
                  </Box>
                  <Box sx={{ minWidth: 80, textAlign: 'right' }}>
                    <Typography variant="body1" color="primary" fontWeight={700}>{user.percent}%</Typography>
                    <Typography variant="caption" color="text.secondary">{user.done} / {user.total} tasks</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LeaderboardPage; 