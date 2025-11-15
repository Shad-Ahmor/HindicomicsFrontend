// src/components/UniversalModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "./HeroSection.css"; // include your theme CSS

// ✅ Format text: handle **bold** and \n line breaks
function formatText(text) {
  if (!text) return null;

  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\\n/g, "<br/>")
    .replace(/\n/g, "<br/>");

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default function UniversalModal({
  show,
  onClose,
  title,
  content,
  items,
  type = "story",
  setSelectedStory,
  setSelectedJoke,
  setSelectedShayri,
  setShowMoreModal,
  theme = "light",
  itemsPerPage = 9,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  if (!items || !Array.isArray(items)) items = [];

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🎨 Unified content selector
  const getContentText = (c) => {
    if (!c) return "";
    if (type === "shayari") return c.shayri || "";
    if (type === "story") return c.story || "";
    if (type === "joke") return c.joke || "";
    return "";
  };

  // ✍️ Get author display info
  const getAuthorLine = (c) => {
    if (!c) return "";

    if (type === "story") {
      return `✍️ ${c.writername || "Unknown Writer"}${
        c.postedBy ? " | 🕒 Posted by " + c.postedBy : ""
      }`;
    }
    if (type === "joke") {
      return `✍️ ${c.writername || "Anonymous"}${
        c.postedBy ? " | 🕒 Posted by " + c.postedBy : ""
      }`;
    }
    if (type === "shayari") {
      return `✍️ ${c.shayarname || "Unknown Shayar"}${
        c.postedBy ? " | 🕒 Posted by " + c.postedBy : ""
      }`;
    }
    return "";
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="story-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`story-modal glass-effect ${theme}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1000px",
              width: "95%",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            {/* ❌ Close Button */}
            <button className="modal-close-btn">
              <X size={24} onClick={onClose} />
            </button>

            {/* 🩷 Single Item View */}
            {content && (
              <>
                <h2
                  className="modal-title"
                  style={{
                    color: theme === "dark" ? "#fff" : "#222",
                    textAlign: "center",
                    fontFamily: "'Poppins', 'Noto Serif', serif",
                  }}
                >
                  {title ||
                    content.category ||
                    (type === "shayari"
                      ? "Shayari"
                      : type === "joke"
                      ? "Joke"
                      : "Story")}
                </h2>

                {/* 🖼 Story Image */}
                {type === "story" && content.image && (
                  <img
                    src={
                      content.image ||
                      "https://via.placeholder.com/800x400?text=Story+Image"
                    }
                    alt={content.title}
                    className="modal-image"
                  />
                )}

                {/* 🧾 Metadata */}
                <p
                  className="modal-meta"
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    opacity: 0.85,
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {getAuthorLine(content)}
                  <br />
                  {type === "story" ? (
                    <>📚 {content.category || "Uncategorized"}</>
                  ) : type === "joke" ? (
                    <>
                      ❤️ Likes: {content.likes || 0} | 🙄 Dislikes:{" "}
                      {content.dislikes || 0} | 👁 Views: {content.views || 0}
                    </>
                  ) : (
                    <>
                      ❤️ Likes: {content.likes || 0} | 👁 Views:{" "}
                      {content.views || 0}
                    </>
                  )}
                </p>

                {/* 📝 Main Text Content */}
                <div
                  className="modal-story"
                  style={{
                    marginTop: "20px",
                    padding: "0 20px 40px",
                    textAlign: "center",
                    lineHeight: "1.9",
                    fontSize:
                      type === "shayari"
                        ? "1.3rem"
                        : type === "story"
                        ? "1.15rem"
                        : "1.1rem",
                    fontStyle: type === "shayari" ? "italic" : "normal",
                    fontFamily: "'Noto Serif', 'Poppins', serif",
                    color: theme === "dark" ? "#fff" : "#222",
                    whiteSpace: "pre-line",
                  }}
                >
                  {formatText(getContentText(content))}
                </div>
              </>
            )}

            {/* 📚 Multi-Item Grid View */}
            {items.length > 0 && (
              <div className="modal-list mt-6 px-4">
                <h2
                  className="modal-title mb-6 text-center text-2xl font-semibold"
                  style={{ fontFamily: "'Poppins', serif" }}
                >
                  {type === "story"
                    ? "More Stories"
                    : type === "joke"
                    ? "More Jokes"
                    : "More Shayaris"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedItems.map((item, index) => (
                    <motion.div
                      key={index}
                      className={`story-card glass-effect theme-aware-card p-5 rounded-2xl ${
                        type === "shayari" ? "shayri-card" : ""
                      }`}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3
                        className="story-card-title"
                        style={{
                          fontFamily: "'Noto Serif', serif",
                          color: theme === "dark" ? "#fff" : "#222",
                          fontStyle:
                            type === "shayari" ? "italic" : "normal",
                        }}
                      >
                        {type === "story"
                          ? item.title
                          : item.category || "General"}
                      </h3>

                      <p
                        className="story-card-desc"
                        style={{
                          textAlign: "center",
                          opacity: 0.9,
                          fontStyle:
                            type === "shayari" ? "italic" : "normal",
                          fontSize:
                            type === "shayari" ? "1.05rem" : "1rem",
                        }}
                      >
                        {getContentText(item).slice(0, 150) + "..."}
                      </p>

                      <div
                        className="story-card-info"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.9rem",
                          opacity: 0.85,
                          marginTop: "10px",
                        }}
                      >
                        <span>{getAuthorLine(item)}</span>
                        {type === "story" ? (
                          <span>📚 {item.category || "Uncategorized"}</span>
                        ) : type === "joke" ? (
                          <span>
                            ❤️ {item.likes || 0} | 🙄 {item.dislikes || 0} | 👁{" "}
                            {item.views || 0}
                          </span>
                        ) : (
                          <span>
                            ❤️ {item.likes || 0} | 👁 {item.views || 0}
                          </span>
                        )}
                      </div>

                      <button
                        className="story-card-btn theme-aware-btn"
                        onClick={() => {
                          if (type === "story" && setSelectedStory) {
                            setSelectedStory(item);
                            if (setShowMoreModal)
                              setShowMoreModal(false);
                          } else if (type === "joke" && setSelectedJoke) {
                            setSelectedJoke(item);
                            if (setShowMoreModal)
                              setShowMoreModal(false);
                          } else if (
                            type === "shayari" &&
                            setSelectedShayri
                          ) {
                            setSelectedShayri(item);
                            if (setShowMoreModal)
                              setShowMoreModal(false);
                          }
                        }}
                      >
                        Read Full
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* 📄 Pagination */}
                {totalPages > 1 && (
                  <div className="modal-pagination flex justify-center items-center gap-5 mt-10">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={handlePrev}
                    >
                      Prev
                    </button>
                    <span className="page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
