import { Box, Button, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../contexts/LanguageContext'; // ✅ import from context

const WelcomePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage(); // ✅ use context
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: 'en' | 'th') => {
    setLanguage(lang); // ✅ updates context + localStorage
    handleLanguageMenuClose();
  };

  // ✅ Text content for both languages
  const content = {
    en: {
      welcomeTo: "WELCOME TO",
      authenticThai: "AUTHENTIC THAI",
      selfAssessment: "SELF - ASSESSMENT TOOL",
      assessDesc: "ASSESS THE AUTHENTICITY OF YOUR THAI CUISINE",
      start: "START"
    },
    th: {
      welcomeTo: "ยินดีต้อนรับสู่",
      authenticThai: "อาหารไทยแท้",
      selfAssessment: "เครื่องมือประเมินตนเอง",
      assessDesc: "ประเมินความเป็นไทยแท้ของอาหารไทยของคุณ",
      start: "เริ่มต้น"
    }
  };

  const currentContent = content[language];

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: `url(${import.meta.env.BASE_URL}food1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 1,
        }}
      />

      {/* Language Switcher */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 3,
        }}
      >
        <IconButton
          onClick={handleLanguageMenuOpen}
          sx={{
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <LanguageIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageMenuClose}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <MenuItem
            onClick={() => handleLanguageChange('en')}
            selected={language === 'en'}
          >
            🇺🇸 English
          </MenuItem>
          <MenuItem
            onClick={() => handleLanguageChange('th')}
            selected={language === 'th'}
          >
            🇹🇭 ไทย
          </MenuItem>
        </Menu>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ letterSpacing: 6, mb: 1 }}>
          {currentContent.welcomeTo}
        </Typography>

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
          {currentContent.authenticThai}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{ mt: 4, fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {currentContent.selfAssessment}
        </Typography>

        <Typography sx={{ mb: 4, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {currentContent.assessDesc}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/login')}
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
          {currentContent.start}
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomePage;
