import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Grid } from '@mui/system';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [points, setPoints] = useState('');
  const [username, setName] = useState('');

  const [subrole, setSubrole] = useState('');
  const [manager, setManager] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar open state
  const [managers, setManagers] = useState([]); // Store managers list

  // Fetch list of managers from the backend
  useEffect(() => {
    axios.get('https://hindicomicsbackend.onrender.com/auth/getManagers') // Make sure to have this endpoint in the backend to fetch manager data
      .then(response => {
        setManagers(response.data);
      })
      .catch(err => {
        console.error('Error fetching managers', err);
      });
  }, []);

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
      subrole: subrole || '', // Add subrole
      username: username || '',
      manager: manager || null, // Manager UID (if any)
      imageUrl: imageUrl || '', // Image URL (if any)
    };

    try {
      // Send POST request to your backend API to create the user
      const response = await axios.post('https://hindicomicsbackend.onrender.com/auth/signup', userData, {
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
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "100vh", width: "100%", padding: 2 }}>
      <Typography variant="h5" gutterBottom>Create User</Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <TextField
          label="Name"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setName(e.target.value)}
          required
        />
  <TextField
          label="Role"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

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
          label="Points (Optional)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <TextField
          label="Image URL (Optional)"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

<Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={subrole}
                    onChange={(e) => setSubrole(e.target.value)}

                    
                    label="Category"
                  >
                    <MenuItem value="ui_ux">UI/Ux Designer</MenuItem>
                    <MenuItem value="frontend">Frontend Developer</MenuItem>
                    <MenuItem value="backend">Backend Developer</MenuItem>
                    <MenuItem value="fullstack">Fullstack Developer</MenuItem>
                    <MenuItem value="webops">Web Operations</MenuItem>
                    <MenuItem value="tester">Tester</MenuItem>
                    <MenuItem value="smm">Social Media Marketing</MenuItem>
                    <MenuItem value="ccw">Content Creator and writer</MenuItem>
                    <MenuItem value="acc">AI Character Creator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>


     
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Manager (Optional)</InputLabel>
          <Select
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            label="Manager"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {managers.map((manager) => (
              <MenuItem key={manager.uid} value={manager.uid}>
                {manager.name} ({manager.role})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Create Account
        </Button>
      </form>

      {/* Success or Error Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;
