import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ letterSpacing: 6, mb: 1 }}>
        WELCOME TO
      </Typography>

      {/* LOGO Image */}
      <Box
        component="img"
        src={`${import.meta.env.BASE_URL}logo.png`} 
        alt="GET Authentic Thai Logo"
        sx={{
          width: { xs: '180px', sm: '240px' },
          mb: 1,
        }}
      />

      <Typography
        variant="subtitle1"
        sx={{ letterSpacing: 3, fontSize: { xs: '1rem', sm: '1.2rem' } }}
      >
        AUTHENTIC THAI
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ mt: 4, fontSize: { xs: '0.9rem', sm: '1rem' } }}
      >
        SELF - ASSESSMENT TOOL
      </Typography>
      <Typography sx={{ mb: 6, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
        ASSESS THE AUTHENTICITY OF YOUR THAI CUISINE
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/assessment')}
        sx={{
          bgcolor: 'white',
          color: 'primary.main',
          fontWeight: 'bold',
          borderRadius: '40px',
          px: 6,
          py: 1.5,
          fontSize: { xs: '1rem', sm: '1.2rem' },
          '&:hover': { bgcolor: '#f4f4f4' },
        }}
      >
        START
      </Button>
    </Box>
  );
};

export default WelcomePage;
