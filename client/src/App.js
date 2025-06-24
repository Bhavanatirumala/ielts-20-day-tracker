import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DayViewPage from './pages/DayViewPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import DiscussionBoardPage from './pages/DiscussionBoardPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import { Box, Typography, Link as MuiLink } from '@mui/material';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', paddingBottom: 64 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/day/:day" element={<PrivateRoute><DayViewPage /></PrivateRoute>} />
          <Route path="/resources" element={<PrivateRoute><ResourcesPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
          <Route path="/discussion" element={<PrivateRoute><DiscussionBoardPage /></PrivateRoute>} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
        {/* Modern Footer */}
        <Box component="footer" sx={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          bgcolor: theme => theme.palette.background.paper,
          color: theme => theme.palette.text.secondary,
          py: 2,
          px: 2,
          boxShadow: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1201,
        }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} IELTS 20-Day Tracker
          </Typography>
          <MuiLink href="/discussion" color="secondary" underline="hover" sx={{ fontWeight: 500 }}>
            Community Board
          </MuiLink>
        </Box>
      </div>
    </Router>
  );
}

export default App;
