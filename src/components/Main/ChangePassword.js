import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, InputAdornment } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { styled } from '@mui/system';

const AnimatedTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  },
  '& .MuiInputBase-root:focus-within': {
    boxShadow: '0 0 5px 2px rgba(0, 123, 255, 0.5)',
    borderColor: '#007bff',
  },
});

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/login');  // Redirect to login if no token exists
      return;
    }
    api.put('/auth/profile/password', { currentPassword, newPassword }, {
      headers: {
        Authorization: `Bearer ${token}`  // Include the token in the Authorization header
      }
    })
      .then((response) => {
        alert('Password changed successfully');
      })
      .catch((error) => {
        console.error('Error changing password:', error);
        alert('Error changing password');
      });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        maxWidth:'100vw',
        width:'100vw',
        height: '100vh', // Make sure the container takes the full viewport height
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        backgroundColor: '#f0f2f5', // Background color of the page
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
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // 3D shadow effect
          transform: 'translateZ(0)', // Apply to enhance the 3D effect
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)', // Increase shadow on hover
          },
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Change Password
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <AnimatedTextField
            label="Current Password"
            variant="outlined"
            fullWidth
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <AnimatedTextField
            label="New Password"
            variant="outlined"
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpen color="secondary" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '12px',
              marginTop: '16px',
              borderRadius: '8px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Change Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePassword;
