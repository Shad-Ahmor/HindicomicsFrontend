import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

import './HeroSection.css';

export default function HeroSection({ setShowLogin }) {
  const [isTextVisible, setTextVisible] = useState(false);
  const [isImageMoved, setImageMoved] = useState(false);
  const [typingText, setTypingText] = useState('');
  const navigate = useNavigate();

  const fullText =
    " Dive into a multiverse of action, mythology, and Indian superheroes. Hindi Comics brings your childhood heroes to life with stunning visuals and epic stories.";
    const x = useMotionValue(-300); // start off-screen to the left
const opacity = useTransform(x, [-300, 0], [0, 1]); // fade in from 0 to 1



    
  useEffect(() => {
    // Start moving image
    setTimeout(() => setImageMoved(true), 500);

    // Start showing text
    setTimeout(() => setTextVisible(true), 2000);
  }, []);

  useEffect(() => {
    if (!isTextVisible) return;
    let index = 0;
    const interval = setInterval(() => {
      setTypingText((prev) => prev + fullText[index]);
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isTextVisible]);


  useEffect(() => {
    const controls = animate(x, 0, {
      duration: 1.5,
      ease: 'easeOut',
    });
  
    return () => controls.stop(); // clean up animation
  }, []);
  return (
    <div className="hero-container">
      <div className="hero-gradient" />

      <div className="hero-row">
        {/* Left Text Section */}
        <motion.div
          className="hero-text-block"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{
            opacity: isTextVisible ? 1 : 0,
            x: isTextVisible ? 0 : -100,
            scale: isTextVisible ? 1 : 0.8,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
            delay: 0.2,
          }}
        >
          <h1 className="hero-title">हिंदी कॉमिक्स</h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isTextVisible ? 1 : 0,
            }}
            transition={{
              duration: 1,
              delay: 0.5,
            }}
          >
            {typingText}
          </motion.p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Comics</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Readers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>

          {/* ✅ Login Button appears once text starts showing */}
          {isTextVisible && (
        <motion.button
          className="login-btn"
          onClick={() => setShowLogin(true)} // ✅ this shows Login screen
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          ⚡ Login
        </motion.button>
      )}
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          className="hero-image"
          style={{ x, opacity }}

        >
          <img src="../images/landing.jpeg" alt="Hero" />
          <div className="image-overlay" />
        </motion.div>
      </div>
    </div>
  );
}
