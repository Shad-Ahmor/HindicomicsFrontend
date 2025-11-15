import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import "./HeroSection.css"; // reuse aurora + glass styles
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

export default function StorySection() {
  const { theme } = useTheme();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStory, setSelectedStory] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jokes", {
          params: { database: "stories" },
        });
        setStories(response.data || []);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
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
      {/* Background */}
      <div className="story-bg-layer">
        <FloatingParticles />
        {theme === "dark" && <AuroraBackground />}
      </div>

      {/* Heading */}
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          color: "var(--color-text)",
          textShadow:
            theme === "dark"
              ? "0 0 25px rgba(255,0,238,0.4)"
              : "0 0 8px rgba(0,0,0,0.2)",
        }}
      >
        🔥 Trending Stories
      </motion.h2>

      {/* Loading/Error */}
      {loading && <p className="text-center opacity-70">Loading stories...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Story Carousel */}
      {!loading && !error && stories.length > 0 && (
        <div className="story-carousel-wrapper">
          <button className="scroll-btn left" onClick={() => scroll("left")}>
            <ChevronLeft size={30} />
          </button>

          <div className="story-carousel" ref={scrollRef}>
            {stories.slice(0, 10).map((story) => (
              <motion.div
                key={story._id}
                className="story-card glass-effect"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={story.image || "https://via.placeholder.com/400x300"}
                  alt={story.title}
                />
                <div className="story-card-content">
                  <h3 className="story-card-title">
                    {story.title || "Untitled Story"}
                  </h3>
                  <div className="story-meta">
                    <span>✍️ {story.writername || "Unknown"}</span>
                    <span className="story-category">
                      📚 {story.category || "Uncategorized"}
                    </span>
                  </div>
                  <p className="story-card-desc">
                    {story.story
                      ? story.story.slice(0, 120) + "..."
                      : "No description available"}
                  </p>
                  <div className="story-card-info">
                    <div className="story-stats">
                      <span className="likes">❤️ {story.likes || 0}</span>
                      <span className="dislikes">👎 {story.dislikes || 0}</span>
                      <span className="views">👁 {story.views || 0}</span>
                    </div>
                    <span className="rating">⭐ {story.rating || "N/A"}</span>
                  </div>
                  <button
                    className="story-card-btn"
                    onClick={() => setSelectedStory(story)}
                  >
                    Read Full
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="scroll-btn right" onClick={() => scroll("right")}>
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      {/* Read More Button */}
      {!loading && stories.length > 10 && (
        <div style={{ textAlign: "center", marginTop: "50px", zIndex: 5 }}>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255,0,238,0.5)" }}
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
                "linear-gradient(90deg, rgba(255,0,238,0.2), rgba(0,255,255,0.2))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              cursor: "pointer",
              transition: "all 0.4s ease",
              boxShadow: "0 0 15px rgba(0,0,0,0.2)",
              borderImage: "linear-gradient(90deg, #ff00cc, #00ffff) 1",
            }}
          >
            <ChevronDown size={30} /> View More
          </motion.button>
        </div>
      )}

      {/* Universal Modals */}
      <UniversalModal
        show={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        title={selectedStory?.title}
        content={selectedStory}
        theme={theme}
        type="story"
      />

      <UniversalModal
      setSelectedStory={setSelectedStory}
            setShowMoreModal={setShowMoreModal}
            theme={theme}
        show={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        items={stories.slice(10)}
        type="story"
      />
    </section>
  );
}
