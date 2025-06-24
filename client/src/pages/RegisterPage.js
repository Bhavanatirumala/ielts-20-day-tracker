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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { motion } from 'framer-motion';

const RegisterPage = () => {
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
      const res = await axios.post('/api/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fffde7 0%, #fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }} component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <PersonAddAltIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" color="secondary" fontWeight={700} gutterBottom>Register</Typography>
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
              minLength={6}
            />
            <Button type="submit" variant="contained" color="secondary" fullWidth size="large" sx={{ mt: 2 }}>
              Register
            </Button>
          </form>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Button component={Link} to="/login" color="primary" size="small">Login</Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage; 