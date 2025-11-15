import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './AuthCommon.css';

const AccountCreate = ({ setToken, setUid, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('intern');
  const [username, setUsername] = useState('');
  const [subrole, setSubrole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!email || !password || !username) {
      setError('Email, name, and password are required');
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {

      const currentDate = new Date().toISOString().split('T')[0];

      // ✅ 1. Create account on backend (returns custom token)
      const response = await axios.post('http://localhost:5000/auth/signup', {
        email,
        password,
        role,
        subrole: subrole || '',
        username: username || '',
        internshipStart: currentDate, // ✅ Added this field

      });

      const uid = response.data.user.uid;



          const auth = getAuth();
              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
              const idToken = await user.getIdToken();
      // ✅ 3. Save ID token and UID
      setToken(idToken);
      setUid(uid);
      localStorage.setItem('token', idToken);
      localStorage.setItem('uid', uid);

      setMessage(`Account created successfully. Welcome, ${email}!`);
      setOpenSnackbar(true);

      // ✅ Move to next step
      if (onSuccess) onSuccess();

    } catch (err) {
      let errorMsg = 'Something went wrong';
      if (err.response) {
        if (err.response.status === 409) errorMsg = 'User already exists with this email';
        else if (err.response.status === 400) errorMsg = err.response.data.message || 'Invalid input';
        else if (err.response.status >= 500) errorMsg = 'Server error. Please try again later';
        else errorMsg = err.response.data.message || 'Error creating user';
      } else {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="register-gradient-wrapper">
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ textAlign: 'center'}}>
           <img
  src="../logos/hindicomics.jpg"
  alt="Hindi Comics Logo"
  className="hero-logo"
/>
          <Typography
            variant="h5"
            className="lifted-text"
            sx={{ mt: 1, color: '#333', fontWeight: 600 }}
          >
            Enroll in Internship Program
          </Typography>
        </Box>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <TextField label="Full Name" variant="outlined" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required className="lifted-input"/>
          <TextField label="Email Address" type="email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required className="lifted-input"/>
          <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required className="lifted-input"/>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <FormControl fullWidth variant="outlined" margin="normal" className="lifted-input">
            <InputLabel>Category (Subrole)</InputLabel>
            <Select value={subrole} onChange={(e) => setSubrole(e.target.value)} label="Category (Subrole)" required>
              <MenuItem value="ui_ux">UI/Ux Designer</MenuItem>
              <MenuItem value="frontend">Frontend Developer</MenuItem>
              <MenuItem value="backend">Backend Developer</MenuItem>
              <MenuItem value="fullstack">Fullstack Developer</MenuItem>
              <MenuItem value="webops">Web Operations</MenuItem>
              <MenuItem value="tester">Tester</MenuItem>
              <MenuItem value="smm">Social Media Marketing</MenuItem>
              <MenuItem value="ccw">Content Creator and Writer</MenuItem>
              <MenuItem value="acc">AI Character Creator</MenuItem>
            </Select>
          </FormControl>
        </motion.div>

        <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
          <Button type="submit" disabled={loading} variant="contained" className="lifted-button gradient-custom-2" fullWidth size="large" sx={{ color: 'white', fontWeight: 'bold', borderRadius: '4px', boxShadow: '0 4px 15px rgba(236, 120, 36, 0.4)', p: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
          </Button>
        </Box>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountCreate;
