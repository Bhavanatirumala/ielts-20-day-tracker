import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  IconButton,
  Stack,
  AppBar,
  Toolbar,
  Tooltip,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ done: 0, total: 0, streak: 0 });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [leaderboardName, setLeaderboardName] = useState('displayName');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('/api/profile', config);
        setUser(res.data);
        setDisplayName(res.data.displayName || '');
        setNickname(res.data.nickname || '');
        setMobile(res.data.mobile || '');
        setDob(res.data.dob ? new Date(res.data.dob) : null);
        setProfilePic(res.data.profilePic || '');
        setShowOnLeaderboard(res.data.showOnLeaderboard !== undefined ? res.data.showOnLeaderboard : true);
        setLeaderboardName(res.data.leaderboardName || 'displayName');
        const done = res.data.progress.filter(p => p.status === 'done').length;
        const total = res.data.progress.length;
        setStats({ done, total, streak: res.data.streak || 0 });
      } catch (err) {
        setUser({ email: 'user@example.com', displayName: 'IELTS User', nickname: '', mobile: '', dob: null, profilePic: '', progress: [], streak: 0 });
      }
    };
    fetchUser();
  }, []);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('/api/profile', { displayName, profilePic, nickname, mobile, dob, showOnLeaderboard, leaderboardName }, config);
      setEditing(false);
    } catch (err) {
      alert('Failed to save profile.');
    }
  };

  const handlePasswordChange = async () => {
    setPasswordMsg('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('/api/change-password', { currentPassword, newPassword }, config);
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPasswordMsg(err.response?.data?.msg || 'Failed to change password.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #fff 100%)' }}>
      <AppBar position="static" color="primary" elevation={2} component={motion.div} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <Toolbar>
          <MenuBookIcon sx={{ mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            IELTS 20-Day Tracker
          </Typography>
          <Tooltip title="Back to Dashboard">
            <Button component={Link} to="/dashboard" color="inherit" sx={{ mr: 1 }}>Dashboard</Button>
          </Tooltip>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }} component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography variant="h4" color="primary" fontWeight={700} align="center" gutterBottom>Profile</Typography>
          <Stack direction="column" alignItems="center" spacing={2}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={profilePic} sx={{ width: 100, height: 100, mb: 1 }} />
              <IconButton
                sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', border: '1px solid #ccc' }}
                onClick={() => fileInputRef.current.click()}
                size="small"
              >
                <EditIcon color="primary" />
              </IconButton>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePicChange}
              />
            </Box>
            {editing ? (
              <>
                <TextField label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} fullWidth sx={{ maxWidth: 300, mb: 1 }} />
                <TextField label="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} fullWidth sx={{ maxWidth: 300, mb: 1 }} />
                <TextField label="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} fullWidth sx={{ maxWidth: 300, mb: 1 }} />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={dob}
                    onChange={setDob}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ maxWidth: 300, mb: 1 }} />}
                  />
                </LocalizationProvider>
                <FormControlLabel
                  control={<Switch checked={showOnLeaderboard} onChange={e => setShowOnLeaderboard(e.target.checked)} color="primary" />}
                  label="Show me on Leaderboard"
                  sx={{ mt: 1, mb: 1 }}
                />
                {showOnLeaderboard && (
                  <FormControl fullWidth sx={{ maxWidth: 300, mb: 1 }}>
                    <InputLabel id="leaderboard-name-label">Leaderboard Name</InputLabel>
                    <Select
                      labelId="leaderboard-name-label"
                      value={leaderboardName}
                      label="Leaderboard Name"
                      onChange={e => setLeaderboardName(e.target.value)}
                    >
                      <MenuItem value="displayName">Display Name</MenuItem>
                      <MenuItem value="nickname">Nickname</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </>
            ) : (
              <>
                <Typography variant="h6">{displayName || 'No Name'}</Typography>
                {nickname && <Typography color="text.secondary">Nickname: {nickname}</Typography>}
                {mobile && <Typography color="text.secondary">Mobile: {mobile}</Typography>}
                {dob && <Typography color="text.secondary">DOB: {dob.toLocaleDateString()}</Typography>}
              </>
            )}
            <Typography color="text.secondary">{user.email}</Typography>
            <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
              <Typography variant="subtitle1" color="primary">Stats</Typography>
              <Typography>Tasks Done: <b>{stats.done}</b> / {stats.total}</Typography>
              <Typography>Current Streak: <b>{stats.streak}</b> days</Typography>
            </Box>
            {editing ? (
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </Stack>
          <Box sx={{ mt: 4 }}>
            <Button variant="text" color="secondary" onClick={() => setShowPasswordFields(v => !v)}>
              {showPasswordFields ? 'Hide Change Password' : 'Change Password'}
            </Button>
            {showPasswordFields && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="secondary" onClick={handlePasswordChange}>
                  Save Password
                </Button>
                {passwordMsg && <Typography color={passwordMsg.includes('success') ? 'success.main' : 'error'} sx={{ mt: 1 }}>{passwordMsg}</Typography>}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage; 