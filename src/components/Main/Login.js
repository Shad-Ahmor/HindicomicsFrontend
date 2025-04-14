import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { encryptData } from '../Security/cryptoUtils.js';
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const navigate = useNavigate();

  const [comicImages, setComicImages] = useState({
    closed: '../images/closed.jpeg',
    halfOpen: "../images/halfOpen.jpeg",
    fullyOpen: "../images/fullyOpen.jpeg",
    explosion: "../images/explosion.jpeg",
  });
  const [imageState, setImageState] = useState("closed");
  const [backgroundImage, setBackgroundImage] = useState(comicImages.closed);
  const [formClass, setFormClass] = useState("threeDbutton"); // Add formClass state

  useEffect(() => {
    if (imageState === "halfOpen") {
      setBackgroundImage(comicImages.halfOpen);
    } else if (imageState === "fullyOpen") {
      setBackgroundImage(comicImages.fullyOpen);
    } else if (imageState === "explosion") {
      setBackgroundImage(comicImages.explosion);
    } else {
      setBackgroundImage(comicImages.closed);
    }
  }, [imageState]);

  const handlePasswordChange = (e) => {
    setFormClass(imageState === "closed" ? "threeDbutton" : "");

    setPassword(e.target.value);
    if (e.target.value) {
      setImageState("halfOpen");
    } else {
      setImageState("closed");
    }
    if (validateEmail(email) && e.target.value.length >= 5) {
      setImageState("fullyOpen");
    }
    
    // Update formClass based on imageState
  };

  const handleEmailChange = (e) => {
    setFormClass(imageState === "closed" ? "threeDbutton" : "");

    setEmail(e.target.value);
    if (validateEmail(e.target.value) && password.length >= 5) {
      setImageState("fullyOpen");
    } else {
      setImageState("halfOpen");
    }

    // Update formClass based on imageState
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        setImageState("explosion");
        setMessage(data.error || "Something went wrong");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setImageState("explosion");
      setLoading(false);
      setMessage("Something went wrong. Please try again later.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "120vh",
        width: "100%",
        backgroundColor: "#f4f4f9",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ zIndex: 1 }}
      ></motion.div>

      <motion.div
        key={backgroundImage}
        style={{ zIndex: 0 }}
        animate={{
          transition: { duration: 1, ease: "easeInOut" },
        }}
        initial={{ rotateY: 0 }}
      >
        <Box
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "100% 100%",
            width: "100%",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            transition: "background-image 1s ease-in-out",
          }}
        />
      </motion.div>

      <form className={formClass} onSubmit={handleSubmit} style={{ width: "300px", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <TextField
            fullWidth
            className="loginemail"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "10px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)", 
              transition: "all 0.3s ease-in-out",
              "& .MuiInputLabel-root": {
                color: "#e60000",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e60000",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "#ffcb00",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffcb00",
                  boxShadow: "0px 0px 15px rgba(255, 203, 0, 0.5)",
                },
              },
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.4)",
              },
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <TextField
            fullWidth
            label="Password"
            className="loginpassword"
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "10px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)", 
              transition: "all 0.3s ease-in-out",
              "& .MuiInputLabel-root": {
                color: "#e60000",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e60000",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "#ffcb00",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffcb00",
                  boxShadow: "0px 0px 15px rgba(255, 203, 0, 0.5)",
                },
              },
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.4)",
              },
            }}
          />
        </motion.div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: 3,
            backgroundColor: "#ffcb00",
            fontFamily: "'Comic Sans MS', cursive",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#ff9900",
            },
            animation: "pulse 1s infinite alternate",
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
