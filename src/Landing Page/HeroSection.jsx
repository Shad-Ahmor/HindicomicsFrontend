import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, Book, Download, Users, Star } from "lucide-react";
import StorySection from "./StorySection"; // ✅ StorySection below HeroSection
import "./HeroSection.css";
import JokesSection from "./JokesSection";
import ShayriSection from "./ShayriSection";

// 🌈 Aurora Gradient Background (for dark mode)
const AuroraBackground = () => (
  <div className="aurora-background">
    <div className="aurora-blob blob-1" />
    <div className="aurora-blob blob-2" />
    <div className="aurora-blob blob-3" />
  </div>
);

// ✨ Floating background particles (animated)
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 10 + 10}s`,
    delay: `${Math.random() * 10}s`,
  }));

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle"
          style={{
            "--top": p.top,
            "--left": p.left,
            "--size": p.size,
            "--duration": p.duration,
            "--delay": p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function HeroSection({ setShowLogin }) {
  const { theme, toggleTheme } = useTheme();
  const [isTextVisible, setTextVisible] = useState(false);
  const [typingText, setTypingText] = useState("");

  const fullText =
    "Dive into a multiverse of action, mythology, and Indian superheroes. Hindi Comics brings your childhood heroes to life with stunning visuals and epic stories.";

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isTextVisible) return;
    setTypingText("");
    let index = 0;
    const interval = setInterval(() => {
      setTypingText((prev) => prev + fullText[index]);
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isTextVisible]);

  // Motion variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const statItems = [
    {
      number: "1000+",
      label: "Comics",
      icon: <Book size={24} color="#ff00cc" strokeWidth={2} />,
      themeClass: "comic-theme",
    },
    {
      number: "1 Million+",
      label: "Downloads",
      icon: <Download size={24} color="#00ffff" strokeWidth={2} />,
      themeClass: "download-theme",
    },
    {
      number: "50K+",
      label: "Readers",
      icon: <Users size={24} color="#3333ff" strokeWidth={2} />,
      themeClass: "users-theme",
    },
    {
      number: "4.9★",
      label: "Rating",
      icon: <Star size={24} color="#ffaa00" strokeWidth={2} />,
      themeClass: "star-theme",
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-container hero-grid-background">
        {/* Floating particles & background effects */}
        <FloatingParticles />
        {theme === "dark" && <AuroraBackground />}

        {/* Header: Logo + Theme Switch + Login */}
        <motion.div
          className="top-left-buttons"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-header">
            <img
              src="logos/hindicomics.jpg"
              alt="Hindi Comics Logo"
              className="hero-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/50x50/ff00cc/ffffff?text=H";
              }}
            />
            <h1 className="hero-title">हिंदी कॉमिक्स</h1>
          </div>

          <div className="right-controls">
            {/* Theme Toggle */}
            <motion.button
              className="theme-switch-btn glass-effect"
              onClick={toggleTheme}
              whileHover={{
                scale: 1.1,
                rotate: theme === "dark" ? 10 : -10,
              }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
            >
              {theme === "dark" ? (
                <Moon size={20} color="#00ffff" />
              ) : (
                <Sun size={20} color="#ffaa00" />
              )}
            </motion.button>

            {/* Login Button */}
            <motion.button
              className="login-btn"
              onClick={() => setShowLogin(true)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px var(--color-primary-glow)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ Login
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="hero-row">
          {/* Left: Text and Stats */}
          <motion.div
            className="hero-text-block"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <motion.p
              className="hero-subtitle glass-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: isTextVisible ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {typingText}
            </motion.p>

            <motion.div
              className="hero-stats"
              variants={containerVariants}
              initial="hidden"
              animate={isTextVisible ? "visible" : "hidden"}
            >
              {statItems.map((item, index) => (
                <motion.div
                  key={index}
                  className={`stat-item glass-effect animated-border ${item.themeClass}`}
                  variants={itemVariants}
                >
                  <div className="stat-icon">{item.icon}</div>
                  <div className="stat-number">{item.number}</div>
                  <div className="stat-label">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div
            className="hero-image-block"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <img
              src="images/superhero.png"
              alt="Indian Superheroes"
              className="main-hero-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/400x300/3333ff/ffffff?text=Hero";
              }}
            />
            <div className="hero-glow" />
          </motion.div>
        </div>
      </section>

      {/* STORY SECTION BELOW HERO */}
      <StorySection theme={theme} />
          <JokesSection theme={theme} />
          <ShayriSection theme={theme} />

            <footer className={`app-footer ${theme === "dark" ? "dark-footer" : "light-footer"}`}>
        <div className="footer-content">
          <div className="footer-brand">
            <img src="logos/hindicomics.jpg" alt="Hindi Comics Logo" />
            <span>© {new Date().getFullYear()} Hindi Comics. All rights reserved.</span>
          </div>
          <div className="footer-links">
            <a href="#hero">Home</a>
            <a href="#stories">Stories</a>
            <a href="#jokes">Jokes</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-theme">
            <span>Theme: {theme === "dark" ? "Dark" : "Light"}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
