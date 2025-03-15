import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Main/Login.js';
import HindiComics from './components/SubComponents/HindiComics';  // Import HindiComics
import {  decryptData } from './components/Security/cryptoUtils.js';  // Import the library functions
import { initializeApp } from "firebase/app";
import './styles/css/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
  const [firebaseConfig, setFirebaseConfig] = useState(null); // Store the fetched Firebase config
  const [error, setError] = useState(""); // To store error messages

  // Check if the user is already logged in (e.g., via localStorage or cookies)
  useEffect(() => {
    if (!navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Safari')) {
      const wrapper = document.querySelector('.wrapper');
      if (wrapper) {
        wrapper.innerHTML = '<p>Sorry! Non-webkit users. :(</p>';
      }
    }
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  // Fetch Firebase config from the API
  useEffect(() => {
    const fetchFirebaseConfig = async () => {
      try {
        const response = await fetch("https://hindicomicsbackend.onrender.com/firebase-config");
        if (response.ok) {
          const encryptedConfig = await response.json(); // Get encrypted config as JSON
          const decryptedConfig = {};
          for (const encryptedKey in encryptedConfig) {
            if (encryptedConfig.hasOwnProperty(encryptedKey)) {
              // Decrypt both the encrypted key and the encrypted value
              const decryptedKey = decryptData(encryptedKey);  // Decrypt the key
              const decryptedValue = decryptData(encryptedConfig[encryptedKey]);  // Decrypt the value

              // Add the decrypted key-value pair to the config
              decryptedConfig[decryptedKey] = decryptedValue;
            }
          }

          // Update the state with the decrypted configuration
          setFirebaseConfig(decryptedConfig);

        } else {
          setError("Failed to load Firebase configuration.");
        }
      } catch (error) {
        setError("Error fetching Firebase configuration.");
        console.error(error);
      }
    };

    fetchFirebaseConfig();
  }, []);

  // Initialize Firebase only after config is fetched
  useEffect(() => {
    if (firebaseConfig) {
      initializeApp(firebaseConfig);
    }
  }, [firebaseConfig]);
  return (
    <Box sx={{ display: 'flex' }}>
      {!isLoggedIn ? (
        <Login setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <HindiComics setIsLoggedIn={setIsLoggedIn} />
      )}
    </Box>
  );
}

export default App;
