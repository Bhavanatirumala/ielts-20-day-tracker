import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }} component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <LoginIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>Login</Typography>
          </Box>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <form onSubmit={onSubmit}>
            <TextField
              type="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
              fullWidth
              margin="normal"
              autoFocus
            />
            <TextField
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Button component={Link} to="/register" color="secondary" size="small">Register</Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 