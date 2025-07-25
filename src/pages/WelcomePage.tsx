import { Box, Button, Typography, IconButton, Menu, MenuItem, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../contexts/LanguageContext';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: 'en' | 'th') => {
    setLanguage(lang);
    handleLanguageMenuClose();
  };

  const content = {
    en: {
      welcomeTo: "WELCOME TO",
      authenticThai: "AUTHENTIC THAI",
      selfAssessment: "SELF - ASSESSMENT TOOL",
      assessDesc: "ASSESS THE AUTHENTICITY OF YOUR THAI CUISINE",
      start: "START",
      disclaimerTitle: "Discover Your Thai Authenticity",
      disclaimerBody: `This tool helps you reflect on your restaurant’s current level of Thai authenticity — honestly and clearly.

It’s not about getting a high score, but about understanding where you are now.

By completing this self-assessment, you’ll gain insights that can help you:
• Strengthen your authenticity
• Improve service and staff training
• Gain new customer groups
• Prepare for future recognition, awards or review platforms`,
      ok: "OK"
    },
    th: {
      welcomeTo: "ยินดีต้อนรับสู่",
      authenticThai: "อาหารไทยแท้",
      selfAssessment: "เครื่องมือประเมินตนเอง",
      assessDesc: "ประเมินความเป็นไทยแท้ของอาหารไทยของคุณ",
      start: "เริ่มต้น",
      disclaimerTitle: "ค้นพบความเป็นไทยแท้ของร้านคุณ",
      disclaimerBody: `เครื่องมือนี้จะช่วยคุณสะท้อนถึงระดับความเป็นไทยแท้ของร้านอาหาร — อย่างตรงไปตรงมา

ไม่ใช่เพื่อได้คะแนนสูง แต่เพื่อเข้าใจสถานะปัจจุบันของร้านคุณ

หลังจากทำแบบประเมินนี้ คุณจะได้แนวทางเพื่อ:
• เสริมสร้างความเป็นไทยแท้
• พัฒนาการบริการและการฝึกอบรมพนักงาน
• ขยายกลุ่มลูกค้าใหม่
• เตรียมความพร้อมสำหรับรางวัลหรือแพลตฟอร์มรีวิวในอนาคต`,
      ok: "ตกลง"
    }
  }[language];

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

      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 3 }}>
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
          <MenuItem onClick={() => handleLanguageChange('en')} selected={language === 'en'}>🇺🇸 English</MenuItem>
          <MenuItem onClick={() => handleLanguageChange('th')} selected={language === 'th'}>🇹🇭 ไทย</MenuItem>
        </Menu>
      </Box>

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
        <Typography variant="h6" sx={{ letterSpacing: 6, mb: 1 }}>{content.welcomeTo}</Typography>
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="GET Authentic Thai Logo"
          sx={{ width: { xs: '180px', sm: '240px' }, mb: 1 }}
        />
        <Typography variant="subtitle1" sx={{ letterSpacing: 3, fontSize: { xs: '1rem', sm: '1.2rem' } }}>
          {content.authenticThai}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 4, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {content.selfAssessment}
        </Typography>
        <Typography sx={{ mb: 4, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {content.assessDesc}
        </Typography>

        <Button
          variant="contained"
          onClick={() => setDisclaimerOpen(true)}
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
          {content.start}
        </Button>
      </Box>

      {/* Disclaimer Modal */}
      <Modal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            p: 4,
            borderRadius: 4,
            maxWidth: 500,
            width: '90%',
            boxShadow: 24,
            textAlign: 'left',
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            {content.disclaimerTitle}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
            {content.disclaimerBody}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setDisclaimerOpen(false);
              navigate('/login');
            }}
            sx={{ borderRadius: '25px', fontWeight: 'bold', py: 1 }}
          >
            {content.ok}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default WelcomePage;
