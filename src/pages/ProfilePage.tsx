import {
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    Container,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  
  const ProfilePage = () => {
    const navigate = useNavigate();
  
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Red Panel */}
        <Box
          sx={{
            flex: 1,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 8,
            px: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            GET AUTHENTIC THAI
          </Typography>
          <Typography variant="h6" align="center">
            Restaurant Profile
          </Typography>
        </Box>
  
        {/* Right White Form Panel */}
        <Box
          sx={{
            flex: 2,
            bgcolor: 'white',
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 8 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Container maxWidth="md">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Restaurant Name (ชื่อร้าน)" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Owner/Manager Name (ชื่อเจ้าของ/ผู้จัดการ)" variant="outlined" />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location/Province (ที่ตั้ง/จังหวัด)" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number (เบอร์โทรศัพท์)" variant="outlined" />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email Address (อีเมล)" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Website URL (เว็บไซต์)" variant="outlined" />
              </Grid>
  
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Brief Description (คำอธิบายเกี่ยวกับร้าน)"
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
  
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 6,
                    px: 4,
                    py: 1.5,
                    mt: 2,
                  }}
                  onClick={() => navigate('/assessment')}
                >
                  Continue to Assessment
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    );
  };
  
  export default ProfilePage;
  