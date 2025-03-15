import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { encryptData, decryptData,encrypturl } from '../Security/cryptoUtils.js';
import { CircularProgress } from '@mui/material';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(""); // To store error messages
  const [loading, setLoading] = useState(false); // To track loading state
  const [success, setSuccess] = useState(false); // To show success message after login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors at the start
    setLoading(true); // Set loading state

    try {
      const response = await fetch("https://hindicomicsbackend.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      if (response.ok) {
        setIsLoggedIn(true);  // Set the login state

        const encryptedRole = encryptData(data.user.role);
        const encryptedimg = encryptData(data.user.image);
        const encryptedSubRole = encryptData(data.user.subrole);

        const encryptedUserId = encryptData(data.user.uid);
        const namePart = email.split('@')[0];
        const firstName = namePart.split('.')[0];
        const cleanedFirstName = firstName.replace(/[^a-zA-Z]/g, '');

        localStorage.setItem("token", idToken);
        localStorage.setItem("role", encryptedRole);
        localStorage.setItem("profileabc", encryptedimg);
        localStorage.setItem("subrole", encryptedSubRole);

        localStorage.setItem("uid", encryptedUserId);
        localStorage.setItem("name", encryptData(cleanedFirstName));

        // Clear error message after success
        setError(""); // Ensure error is cleared after success
        setSuccess(true);

        // Redirect to HindiComics dashboard after success
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setLoading(false); // Stop loading if there's an error
      setError("Something went wrong. Please try again later.");
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            Login successful! Redirecting...
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ marginTop: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
