import "./AuthCommon.css";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { encryptData } from "../Security/cryptoUtils.js";
import { useNavigate } from "react-router-dom";
import AnimatedStepper from "./AnimatedStepper.js";

const Login = ({ setShowLogin, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showStepper, setShowStepper] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      if (response.ok) {
        setIsLoggedIn(true);
        const encryptedRole = encryptData(data.user.role);
        const encryptedimg = encryptData(data.user.image);
        const encryptedSubRole = encryptData(data.user.subrole);
        const encryptedCourses = encryptData(data.user.courses);
        const encryptedUserId = encryptData(data.user.uid);
        const namePart = email.split('@')[0];
        const firstName = namePart.split('.')[0];
        const cleanedFirstName = firstName.replace(/[^a-zA-Z]/g, '');

        localStorage.setItem("token", idToken);
        localStorage.setItem("role", encryptedRole);
        localStorage.setItem("profileabc", encryptedimg);
        localStorage.setItem("subrole", encryptedSubRole);
        localStorage.setItem("course", encryptedCourses);
        localStorage.setItem("uid", encryptedUserId);
        localStorage.setItem("name", encryptData(cleanedFirstName));

        setMessage("Login successful! Redirecting...");
        setOpenSnackbar(true);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(data.message || data.error || "Something went wrong");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setLoading(false);
      setMessage("Login failed. Check credentials or try again later.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      className="login-gradient-wrapper"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: { xs: 2, md: 5 },
      }}
    >
      <Paper
        sx={{
          maxWidth: "1200px",
          width: "100%",
          overflow: "hidden",
          height: { md: "calc(100vh - 100px)" },
          display: "flex",
        }}
        className="gradient-form"
      >
      <div className="auth-wrapper">
  {/* ✅ LEFT PANEL */}

  <div
    className={`auth-panel-left ${
      showStepper ? "gradient-custom-2 professional-panel-right" : "login-form-panel"
    }`}
    >
    
    {showStepper ? (
      // 🔹 Gradient Info Panel (when Register clicked)
      <Box sx={{ textAlign: "center", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom className="lifted-text" sx={{ fontWeight: 700, mb: 3 }}>Join the Future of Innovation</Typography>
        <Typography variant="body1" className="lifted-text">Step into a world of learning, collaboration, and creativity.
At The Hindi Comics Team, we believe in nurturing real talent through hands-on experience, mentorship, and purpose-driven projects.
Start your journey with us — grow your skills, build something meaningful, and make an impact that lasts.</Typography>

        <Button
          variant="outlined"
          color="inherit"
          sx={{ mt: 4, borderColor: "white", color: "white" }}
          onClick={() => setShowStepper(false)}
        >
          Back to Login
        </Button>
      </Box>
    ) : (
      // 🔹 Login Form (default)
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: "350px" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
           <img
  src="../logos/hindicomics.jpg"
  alt="Hindi Comics Logo"
  className="hero-logo"
/>
          <Typography variant="h5" className="lifted-text" sx={{ mt: 1, color: "#333", fontWeight: 600 }}>
            We are The Hindi Comics Team
          </Typography>
        </Box>

        <Typography variant="body1" className="lifted-text" sx={{ mb: 3, color: "text.secondary" }}>
          Please login to your account
        </Typography>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <TextField
            fullWidth
            label="Email address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            className="lifted-input"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            className="lifted-input"
          />
        </motion.div>

        <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            className="gradient-custom-2 lifted-button"
            fullWidth
            size="large"
            sx={{
              color: "white",
              fontWeight: "bold",
              borderRadius: "4px",
              boxShadow: "0 4px 15px rgba(236, 120, 36, 0.4)",
              p: 1.5,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
          </Button>
          <Link href="#" variant="body2" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
            Forgot password?
          </Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
          <Typography variant="body2" className="lifted-text" sx={{ mr: 1, color: "text.secondary" }}>
            Wanna do Internship?
          </Typography>
          <Button variant="outlined" color="error" onClick={() => setShowStepper(true)}>
            Enroll
          </Button>
        </Box>
      </Box>
    )}
  </div>

  {/* ✅ RIGHT PANEL */}
  <div
    className={`auth-panel-right ${
      showStepper ? "account-create-form-panel" : "gradient-custom-2 professional-panel-left"
    }`}
  >
    {showStepper ? (
      <AnimatedStepper />
    ) : (
      <Box sx={{ textAlign: "center", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom className="lifted-text" sx={{ fontWeight: 700, mb: 3 }}>Welcome to Hindi Comics</Typography>
        <Typography variant="body1" className="lifted-text">Your creative universe awaits!
Dive back into the world of ideas, design, and storytelling.
Whether you build, write, or imagine — every login brings you closer to something extraordinary.
Let’s keep creating stories that inspire millions.</Typography>
      </Box>
    )}
  </div>
</div>

      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {error || message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
