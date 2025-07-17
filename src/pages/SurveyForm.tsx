import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const businessTypes = [
  'Thai Restaurant',
  'Hotel / Resort',
  'Consultant',
  'Government Agency (e.g. Ministry of Commerce, etc.)',
  'Academic Institution / Research Organization',
  'Other',
];

const positions = [
  'Restaurant Owner / Entrepreneur',
  'Partner / Co-owner',
  'Executive / Top Management',
  'Chef / Executive Chef',
  'Manager (Operations / Kitchen / Front of House)',
  'Consultant (Culinary / Hospitality)',
  'Government Officer',
  'Educator / Professor',
  'Other',
];

export default function FullSurveyPage() {
  const navigate = useNavigate();
  const { user } = useUser(); // Get email from context

  const [form, setForm] = useState({
    managerName: '',
    province: '',
    phone: '',
    website: '',
    description: '',
    businessType: '',
    position: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.managerName) newErrors.managerName = 'Required';
    if (!form.province) newErrors.province = 'Required';
    if (!form.businessType) newErrors.businessType = 'Required';
    if (!form.position) newErrors.position = 'Required';
    return newErrors;
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('User not logged in');
      return;
    }
    
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch('/api/profile-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact_email: user.email, // From logged-in user
          owner_name: form.managerName,
          location: form.province,
          business_type: form.businessType,
          current_position: form.position,
          phone: form.phone || undefined,
          website: form.website || undefined,
          description: form.description || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || 'Submission failed.');
        return;
      }

      navigate('/assessment');
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={2}
      py={4}
      sx={{ maxWidth: 500, margin: 'auto' }}
    >
      <img
        src={`${import.meta.env.BASE_URL}logo_R.png`}
        alt="Logo"
        style={{ width: 100, marginBottom: 20 }}
      />

      <Typography variant="h5" fontWeight="bold" mb={2} align="center">
        Restaurant Information
      </Typography>
      <Typography mb={3} align="center" color="textSecondary">
        Please provide information about your Thai restaurant to begin the authenticity assessment.
      </Typography>

      <Typography variant="h6" color="error" mb={1}>
        Required Information
      </Typography>

      <TextField
        name="managerName"
        label="Owner/Manager Name *"
        fullWidth
        margin="normal"
        value={form.managerName}
        onChange={handleChange}
        error={!!errors.managerName}
        helperText={errors.managerName}
      />

      <TextField
        name="province"
        label="Location / Province *"
        fullWidth
        margin="normal"
        value={form.province}
        onChange={handleChange}
        error={!!errors.province}
        helperText={errors.province}
      />

      <TextField
        select
        name="businessType"
        label="Business Type *"
        fullWidth
        margin="normal"
        value={form.businessType}
        onChange={handleChange}
        error={!!errors.businessType}
        helperText={errors.businessType}
      >
        {businessTypes.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        name="position"
        label="Current Position *"
        fullWidth
        margin="normal"
        value={form.position}
        onChange={handleChange}
        error={!!errors.position}
        helperText={errors.position}
      >
        {positions.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <Typography variant="h6" color="success.main" mt={4} mb={1}>
        Optional Information
      </Typography>

      <TextField
        name="phone"
        label="Phone Number"
        fullWidth
        margin="normal"
        value={form.phone}
        onChange={handleChange}
      />
      <TextField
        name="website"
        label="Website URL"
        fullWidth
        margin="normal"
        value={form.website}
        onChange={handleChange}
      />
      <TextField
        name="description"
        label="Brief Description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={form.description}
        onChange={handleChange}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3, borderRadius: '25px', fontWeight: 'bold', py: 1 }}
        onClick={handleSubmit}
      >
        Start Assessment
      </Button>
    </Box>
  );
}
