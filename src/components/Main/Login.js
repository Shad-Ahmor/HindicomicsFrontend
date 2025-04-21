import "./Login.css";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { encryptData } from "../Security/cryptoUtils.js";
import { useNavigate } from "react-router-dom";

const Login = ({ setShowLogin, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const [imageState, setImageState] = useState("closed");
  const [formClass, setFormClass] = useState("threeDbutton");

  useEffect(() => {
    setTimeout(() => {
      if (window.$ && window.$(".flipbook").turn) {
        window.$(".flipbook").turn({
          width: 950,
          height:600,
          autoCenter: true,
        });
      } else {
        console.error("Turn.js did not load properly.");
      }
    }, 500);
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setFormClass(imageState === "closed" ? "threeDbutton" : "");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (validateEmail(e.target.value) && password.length >= 5) {
      setImageState("fullyOpen");
    } else {
      setImageState("halfOpen");
    }
    setFormClass(imageState === "closed" ? "threeDbutton" : "");
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://hindicomicsbackend.onrender.com/auth/login", {
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
    <div className="login-gradient" style={{paddingLeft:'15%'}}>
      <div className="flipbook">
        <div className="hard">
          Hindi Comics
          <br />
          <small>~ GDLSoftware</small>
        </div>
        <div className="hard"></div>

        <div className="page">
          <form className={formClass} onSubmit={handleSubmit} style={{ width: "300px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring", bounce: 0.3 }}
            >
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                margin="normal"
                InputLabelProps={{ style: { fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold" } }}
                sx={{
                  backgroundColor: "#fff8dc",
                  borderRadius: "12px",
                  fontFamily: "'Comic Sans MS', cursive",
                  boxShadow: "4px 4px 0px #000",
                  "& .MuiOutlinedInput-root": {
                    fontWeight: "bold",
                    "& fieldset": { borderColor: "#000", borderWidth: "3px" },
                    "&:hover fieldset": { borderColor: "#ffcb00" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff9900",
                      boxShadow: "0px 0px 10px #ffcb00",
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6, type: "spring", bounce: 0.3 }}
            >
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                margin="normal"
                InputLabelProps={{ style: { fontFamily: "'Comic Sans MS', cursive", fontWeight: "bold" } }}
                sx={{
                  backgroundColor: "#fff8dc",
                  borderRadius: "12px",
                  fontFamily: "'Comic Sans MS', cursive",
                  boxShadow: "4px 4px 0px #000",
                  "& .MuiOutlinedInput-root": {
                    fontWeight: "bold",
                    "& fieldset": { borderColor: "#000", borderWidth: "3px" },
                    "&:hover fieldset": { borderColor: "#ffcb00" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff9900",
                      boxShadow: "0px 0px 10px #ffcb00",
                    },
                  },
                }}
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: "100%",
                padding: "12px 16px",
                marginTop: "24px",
                backgroundColor: "#ffcb00",
                fontFamily: "'Comic Sans MS', cursive",
                textTransform: "uppercase",
                color: "#000",
                fontWeight: "bold",
                fontSize: "1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                animation: "pulse 1s infinite alternate",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </motion.button>

            <IconButton color="primary" onClick={() => setShowLogin(false)} aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </form>
        </div>

        {/* Comic Pages */}
        {/* {[1, 2, 3, 4, 5].map((num) => (
          <div className="page" key={num}>
            <img src={`/images/img-${num}.png`} alt={`Page ${num}`} />
            <small>{`Page ${num}`}</small>
          </div>
        ))} */}

        <div className="hard"></div>
        <div className="hard">
          Thank You
          <br />
          <small>~ GDLSoftware</small>
        </div>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {error || message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
