import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Snackbar, Alert } from '@mui/material'; // Import Alert from @mui/material directly

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [points, setPoints] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar open state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setError('');

    // Check for empty fields
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const userData = {
      email,
      password,
      role: role || 'user', // Default role is 'user'
      points: points || 0,   // Default points to 0
    };

    try {
      // Send POST request to your backend API to create the user
      const response = await axios.post('https://hindicomicsbackend.onrender.comauth/signup', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If the request is successful, show the success message and the user data
      setMessage(`User created successfully. Welcome, ${response.data.user.email}!`);
      setOpenSnackbar(true); // Show success snackbar
    } catch (err) {
      // If there's an error, display the error message
      setError('Error creating user: ' + (err.response ? err.response.data.message : err.message));
      setOpenSnackbar(true); // Show error snackbar
    }
  };

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // Centers vertically
      alignItems: "center", // Centers horizontally
      textAlign: "center",
      minHeight: "100vh", // Full height of the viewport
      width: "100%",
      padding: 2, // Optional padding to avoid content touching the edges
    }}
  >
  
        <Typography variant="h5" gutterBottom>
          Create User
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Role (Optional)"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <TextField
            label="Points (Optional)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Create Account
          </Button>
        </form>

        {/* Success or Error Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default Signup;
