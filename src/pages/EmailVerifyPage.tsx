import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';

const EmailVerifiedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Typography variant="h5" color="primary" gutterBottom>
        Email verified successfully!
      </Typography>
      <Typography variant="body1">Redirecting to login page...</Typography>
      <CircularProgress sx={{ mt: 3 }} />
    </Box>
  );
};

export default EmailVerifiedPage;
