import React, { useState, useEffect } from 'react'; 
import api from '../api'; // Ensure this is the correct path to your API
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, InputAdornment } from '@mui/material';
import { AccountCircle, Image } from '@mui/icons-material';
import { styled } from '@mui/system';

// Styled text field with smooth transition on focus
const AnimatedTextField = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  },
  '& .MuiInputBase-root:focus-within': {
    boxShadow: '0 0 5px 2px rgba(0, 123, 255, 0.5)',
    borderColor: '#007bff',
  },
}));

// Styled button with 3D effect for file upload
const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme?.palette?.primary?.main || '#1976d2', // Fallback color
  color: '#fff',
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-6px)', // 3D effect on hover
  },
  '&:active': {
    transform: 'translateY(0)', // Reset transform on active state
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
  '&:focus': {
    outline: 'none',
  },
}));

// Hidden file input styled for interaction
const HiddenInput = styled('input')({
  display: 'none',
});

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    imageUrl: '',
    imageFile: null, // Store the uploaded image file
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/login'); // Redirect to login if no token exists
      return;
    }
    // Fetch user profile on page load (from your API or Firebase)
    api.get('/auth/profile')
      .then((response) => {
        setProfile(response.data.user);
      })
      .catch((error) => console.error('Error fetching profile:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Convert image file to base64 string
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, imageFile: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/login');
      return;
    }

    const updatedProfile = {
      username: profile.username,
      image: profile.imageFile, // Send the base64 encoded image string
    };

    try {
      await api.put('/auth/profile', updatedProfile, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Include token in the header
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        maxWidth: '100vw',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          transform: 'translateZ(0)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Update Profile
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <AnimatedTextField
            label="Username"
            variant="outlined"
            fullWidth
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle color="secondary" />
                </InputAdornment>
              ),
            }}
          />

          {/* Custom "Choose File" button with 3D effect */}
          <UploadButton
            component="label"
            variant="contained"
            fullWidth
            startIcon={<Image />}
            sx={{ marginBottom: '16px', textTransform: 'none', width: '150px' }}
          >
            Choose File
            <HiddenInput
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
          </UploadButton>

          {/* Display selected image */}
          {profile.imageFile && (
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Selected File: {profile.imageFile.split(',')[0]}... (base64 string preview)
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '12px',
              width: '250px',
              marginTop: '16px',
              borderRadius: '8px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Update Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;
