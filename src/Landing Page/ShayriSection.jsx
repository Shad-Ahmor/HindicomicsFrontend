import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import "./HeroSection.css";
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

export default function ShayriSection() {
  const { theme } = useTheme();
  const [shayris, setShayris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShayri, setSelectedShayri] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchShayris = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jokes", {
          params: { database: "shayri" },
        });
        setShayris(response.data || []);
      } catch (err) {
        console.error("Error fetching shayris:", err);
        setError("Failed to load shayaris");
      } finally {
        setLoading(false);
      }
    };
    fetchShayris();
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

  // Format **bold** and \n line breaks
  const formatShayriText = (text) => {
    if (!text) return "";
    const withBold = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return withBold.replace(/\n/g, "<br/>");
  };

  return (
    <section className="story-section hero-grid-background">
      {/* ✨ Background Layer */}
      <div className="story-bg-layer">
        <FloatingParticles />
        {theme === "dark" && <AuroraBackground />}
      </div>

      {/* 💞 Heading */}
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          color: "var(--color-text)",
          textShadow:
            theme === "dark"
              ? "0 0 25px rgba(255,150,255,0.4)"
              : "0 0 8px rgba(0,0,0,0.2)",
        }}
      >
        💫 Dil Se Nikli Shayari
      </motion.h2>

      {/* 🚀 Loading/Error */}
      {loading && <p className="text-center opacity-70">Loading shayaris...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 💌 Shayari Carousel */}
      {!loading && !error && shayris.length > 0 && (
        <div className="story-carousel-wrapper">
          <button className="scroll-btn left" onClick={() => scroll("left")}>
            <ChevronLeft size={30} />
          </button>

          <div className="story-carousel" ref={scrollRef}>
            {shayris.slice(0, 10).map((shayri, index) => (
              <motion.div
                key={index}
                className="shayri-card"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="shayri-card-content">
                  <h3 className="shayri-card-category">
                    {shayri.category || "Uncategorized"}
                  </h3>

                  <p
                    className="shayri-text"
                    dangerouslySetInnerHTML={{
                      __html: formatShayriText(
                        shayri.shayri?.slice(0, 200) + "..."
                      ),
                    }}
                  />

                  <div className="shayri-stats">
                    <span>❤️ {shayri.likes || 0}</span>
                    <span>👁 {shayri.views || 0}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="shayri-read-btn"
                    onClick={() => setSelectedShayri(shayri)}
                  >
                    Read Full
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="scroll-btn right" onClick={() => scroll("right")}>
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      {/* 📜 View More Button */}
      {!loading && shayris.length > 10 && (
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
              boxShadow: "0 0 25px rgba(255,0,180,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMoreModal(true)}
            style={{
              padding: "14px 40px",
              fontSize: "1.1rem",
              fontWeight: "600",
              letterSpacing: "0.5px",
              color: theme === "dark" ? "#fff" : "#222",
              border: "2px solid transparent",
              borderRadius: "12px",
              background:
                theme === "dark"
                  ? "linear-gradient(90deg, rgba(255,0,150,0.2), rgba(255,255,255,0.1))"
                  : "linear-gradient(90deg, rgba(255,200,220,0.6), rgba(255,255,255,0.9))",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
              transition: "all 0.4s ease",
              boxShadow:
                theme === "dark"
                  ? "0 0 15px rgba(255,0,150,0.2)"
                  : "0 0 8px rgba(0,0,0,0.1)",
            }}
          >
            <ChevronDown size={25} /> View More
          </motion.button>
        </div>
      )}

      {/* 💬 Universal Modal - Single Shayari */}
      <UniversalModal
        show={!!selectedShayri}
        onClose={() => setSelectedShayri(null)}
        title={selectedShayri?.category}
        content={selectedShayri}
        theme={theme}
        type="shayari"
      />

      {/* 💬 Universal Modal - More Shayaris */}
      <UniversalModal
        setSelectedShayri={setSelectedShayri}
        setShowMoreModal={setShowMoreModal}
        theme={theme}
        show={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        items={shayris.slice(10)}
        type="shayari"
      />
    </section>
  );
}
