import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight ,ChevronDown} from "lucide-react";
import "./HeroSection.css"; // Reuse aurora + glass styles
import UniversalModal from "./UniversalModal";

const AuroraBackground = () => (
  <div className="aurora-background">
    <div className="aurora-blob blob-1" />
    <div className="aurora-blob blob-2" />
    <div className="aurora-blob blob-3" />
  </div>
);

const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
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

export default function JokesSection() {
  const { theme } = useTheme();
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJoke, setSelectedJoke] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jokes", {
          params: { database: "jokes" },
        });
        setJokes(response.data || []);
      } catch (err) {
        console.error("Error fetching jokes:", err);
        setError("Failed to load jokes");
      } finally {
        setLoading(false);
      }
    };
    fetchJokes();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="story-section hero-grid-background">
      {/* 🪄 Background Layer */}
      <div className="story-bg-layer">
        <FloatingParticles />
        {theme === "dark" && <AuroraBackground />}
      </div>

      {/* ✨ Heading */}
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          color: "var(--color-text)",
          textShadow:
            theme === "dark"
              ? "0 0 25px rgba(0,234,255,0.4)"
              : "0 0 8px rgba(0,0,0,0.2)",
        }}
      >
        😂 Trending Jokes
      </motion.h2>

      {/* 🚀 Loading/Error */}
      {loading && <p className="text-center opacity-70">Loading jokes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 🎭 Jokes Carousel */}
      {!loading && !error && jokes.length > 0 && (
        <div className="story-carousel-wrapper">
          {/* Left Scroll Button */}
          <button className="scroll-btn left" onClick={() => scroll("left")}>
            <ChevronLeft size={30} />
          </button>

          {/* Scrollable Container */}
          <div className="story-carousel" ref={scrollRef}>
            {jokes.slice(0, 10).map((joke, index) => (
              <motion.div
                key={index}
                className="story-card glass-effect"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="story-card-content">
                  <h3 className="story-card-title">
                    {joke.category || "General"}
                  </h3>

                  <p className="story-card-desc">
                    {joke.joke
                      ? joke.joke.slice(0, 150) + "..."
                      : "No joke content"}
                  </p>

                  <div className="story-card-info">
                    <div className="story-stats">
                      <span className="likes">😂 {joke.likes || 0}</span>
                      <span className="dislikes">🙄 {joke.dislikes || 0}</span>
                      <span className="views">👁 {joke.views || 0}</span>
                    </div>
                  </div>

                  <button
                    className="story-card-btn"
                    onClick={() => setSelectedJoke(joke)}
                  >
                    Read Full
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button className="scroll-btn right" onClick={() => scroll("right")}>
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      {/* 📜 Read More Button (when jokes > 10) */}
     {!loading && jokes.length > 10 && (
  <div
    style={{
      textAlign: "center",
      marginTop: "50px",
      position: "relative",
      zIndex: 5,
    }}
  >
    <motion.button
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 25px rgba(0,255,255,0.5)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowMoreModal(true)}
      style={{
        padding: "14px 40px",
        fontSize: "1.2rem",
        fontWeight: "700",
        letterSpacing: "0.5px",
        color: "#fff",
        border: "2px solid transparent",
        borderRadius: "12px",
        background:
          "linear-gradient(90deg, rgba(0,255,255,0.2), rgba(255,0,238,0.2))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        transition: "all 0.4s ease",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        borderImage:
          "linear-gradient(90deg, #00ffff, #ff00cc) 1",
      }}
    >
     <ChevronDown size={30} /> View More
    </motion.button>
  </div>
)}


      {/* 💬 Universal Modal - Single Joke */}
      <UniversalModal
        show={!!selectedJoke}
        onClose={() => setSelectedJoke(null)}
        title={selectedJoke?.category}
        content={selectedJoke}
        theme={theme}
        type="joke"
      />

      {/* 💬 Universal Modal - More Jokes */}
      <UniversalModal
      setSelectedJoke={setSelectedJoke}
      setShowMoreModal={setShowMoreModal}
      theme={theme}
        show={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        items={jokes.slice(10)}
        type="joke"
      />
    </section>
  );
}