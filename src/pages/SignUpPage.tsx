import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [password, setPassword] = useState('');

  const text = {
    en: {
      title: 'Sign Up',
      restaurantLabel: 'Restaurant Name',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      createBtn: 'Create Account',
      already: 'Already have an account?',
      login: 'Sign In',
    },
    th: {
      title: 'สมัครสมาชิก',
      restaurantLabel: 'ชื่อร้านอาหาร',
      emailLabel: 'อีเมล',
      passwordLabel: 'รหัสผ่าน',
      createBtn: 'สร้างบัญชี',
      already: 'มีบัญชีอยู่แล้ว?',
      login: 'เข้าสู่ระบบ',
    },
  }[language];

  const handleSignUp = async () => {
  if (email && restaurantName && password) {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant_name: restaurantName, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || 'Sign up failed.');
        return;
      }

      alert('Account created successfully. Please check your email and click the verification link to continue.');
      navigate('/login'); // ✅ Let user log in only after verification
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
        <TextField
          label={text.restaurantLabel}
          variant="outlined"
          fullWidth
          margin="normal"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />
        <TextField
          label={text.emailLabel}
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={text.passwordLabel}
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 1, borderRadius: '25px', fontWeight: 'bold', py: 1 }}
          onClick={handleSignUp}
        >
          {text.createBtn}
        </Button>
        <Typography variant="body2" align="center">
          {text.already}{' '}
          <span
            style={{ color: '#910811', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            {text.login}
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpPage;
