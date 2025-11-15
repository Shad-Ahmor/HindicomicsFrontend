import React, { useState, useEffect } from "react";
import Login from "./components/Authentication/Login.js";
import HindiComics from "./components/SubComponents/HindiComics";
import { decryptData } from "./components/Security/cryptoUtils.js";
import { initializeApp } from "firebase/app";
import "./styles/css/App.css";
import HeroSection from "./Landing Page/HeroSection.jsx";
import StorySection from "./Landing Page/StorySection.jsx"; // ✅ NEW
import { Box, Alert, Snackbar, CircularProgress, Fade } from "@mui/material";
import UserActivityTracker from "./components/Authentication/UserActivityTracker.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState(null);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // ✅ Fetch and decrypt Firebase config
  useEffect(() => {
    const fetchFirebaseConfig = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/firebase-config");
        if (response.ok) {
          const encryptedConfig = await response.json();
          const decryptedConfig = {};

          for (const encryptedKey in encryptedConfig) {
            if (encryptedConfig.hasOwnProperty(encryptedKey)) {
              const decryptedKey = decryptData(encryptedKey);
              const decryptedValue = decryptData(encryptedConfig[encryptedKey]);
              decryptedConfig[decryptedKey] = decryptedValue;
            }
          }

          setFirebaseConfig(decryptedConfig);
        } else {
          setError("Failed to load Firebase configuration.");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching Firebase configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchFirebaseConfig();
  }, []);

  // ✅ Initialize Firebase after config
  useEffect(() => {
    if (firebaseConfig) {
      initializeApp(firebaseConfig);
    }
  }, [firebaseConfig]);

  // ✅ Snackbar trigger
  useEffect(() => {
    if (error) setOpenSnackbar(true);
  }, [error]);

  // ✅ Onboarding (Hero + Story)
  const handleOnboardPage = () => (
    <>
      <Fade in timeout={800}>
        <div>
          <HeroSection setShowLogin={setShowLogin} />
          {/* <StorySection /> 👈 Your new beautiful section */}
        </div>
      </Fade>
    </>
  );

  // ✅ Show loader while config is loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          bgcolor: "#000",
          color: "#fff",
        }}
      >
        <CircularProgress color="inherit" />
        <p style={{ marginTop: 16, opacity: 0.8 }}>Loading Hindi Comics...</p>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000", color: "#fff" }}>
      {/* Conditional render */}
            <UserActivityTracker />

      {!isLoggedIn ? (
        showLogin ? (
          <Login setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          handleOnboardPage()
        )
      ) : (
        <HindiComics setIsLoggedIn={setIsLoggedIn} />
      )}

      {/* 🔥 Snackbar for errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
