import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, TextField } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { language } = useLanguage();

  const text = {
    en: {
      title: 'Sign In to Continue',
      emailLabel: 'Email / Restaurant Name',
      passwordLabel: 'Password',
      loginBtn: 'Login',
      noAccount: "Don't have an account yet?",
      signUpLink: 'Sign Up',
    },
    th: {
      title: 'ลงชื่อเข้าใช้งาน',
      emailLabel: 'อีเมล / ชื่อร้านอาหาร',
      passwordLabel: 'รหัสผ่าน',
      loginBtn: 'เข้าสู่ระบบ',
      noAccount: 'ยังไม่มีบัญชี?',
      signUpLink: 'สมัครสมาชิก',
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || 'Login failed.');
          return;
        }

        setUser(data);
        navigate(data.profile_completed ? '/assessment' : '/survey');
      } catch (err) {
        alert('Network error. Please try again.');
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#fafafa" px={2}>
      <img src={`${import.meta.env.BASE_URL}logo_R.png`} alt="Logo" style={{ width: 100, marginBottom: 20 }} />
      <Typography variant="h5" fontWeight="bold" mb={2}>{text.title}</Typography>
      <Box width="100%" maxWidth={400}>
        <form onSubmit={handleSubmit}>
          <TextField
            label={text.emailLabel}
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label={text.passwordLabel}
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
            {text.loginBtn}
          </Button>
        </form>
        <Typography variant="body2" align="center">
          {text.noAccount}{' '}
          <span
            style={{ color: '#910811', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/signup')}
          >
            {text.signUpLink}
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
