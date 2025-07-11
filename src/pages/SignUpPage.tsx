import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useUser } from '../contexts/UserContext'; // ✅ Import UserContext

const SignUpPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ Get setUser from context

  const [email, setEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (email && restaurantName && password) {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restaurant_name: restaurantName, email, password })
        });

        if (!response.ok) {
          const data = await response.json();
          alert(data.detail || 'Sign up failed.');
          return;
        }

        // ✅ Save user in context
        setUser({ email, restaurant_name: restaurantName });

        navigate('/assessment');
      } catch (err) {
        alert('Network error. Please try again.');
      }
    }
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
      <Typography variant="h5" fontWeight="bold" mb={2}>Sign Up</Typography>

      <Box width="100%" maxWidth={400}>
        <TextField
          label="Restaurant Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
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
          Create Account
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <span
            style={{ color: '#910811', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpPage;
