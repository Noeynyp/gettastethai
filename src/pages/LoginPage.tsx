// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, TextField } from '@mui/material';
import { useUser } from '../contexts/UserContext'; // ✅ Import context

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ Use context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email, password })
        });

        if (!response.ok) {
          const data = await response.json();
          alert(data.detail || 'Login failed.');
          return;
        }

        const data = await response.json(); // ✅ Get { email, restaurant_name }
        setUser(data); // ✅ Save to context
        navigate('/assessment');
      } catch (err) {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#fafafa"
      px={2}
    >
      <img src={`${import.meta.env.BASE_URL}logo_R.png`} alt="Logo" style={{ width: 100, marginBottom: 20 }} />
      <Typography variant="h5" fontWeight="bold" mb={2}>Sign In to Continue</Typography>
      <Box width="100%" maxWidth={400}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email / Restaurant Name"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 1, borderRadius: '25px', fontWeight: 'bold', py: 1, backgroundColor: '#910811' }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center">
          Don't have an account yet?{' '}
          <span
            style={{ color: '#910811', fontWeight: 600, cursor: 'pointer' }}
            onClick={handleSignUpClick}
          >
            Sign Up
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
