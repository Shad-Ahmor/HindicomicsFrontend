import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
// 1. CSS फ़ाइल इम्पोर्ट करें
import './ResumePreview.css'; 

export default function ResumePreview({ onBack }) {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resume for logged-in user
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get("/doc", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // assuming API response is standardized
        setResumeData(res.data.resume || res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Failed to load resume data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [navigate]);

  // ------------------ Loading State ------------------
  if (loading) {
    return (
      <div className="loading-screen">
        Loading Resume...
      </div>
    );
  }

  // ------------------ Error / No Resume State ------------------
  if (error || !resumeData) {
    return (
      <div className="error-screen">
        <p className="error-message">{error || "No Resume Data Found"}</p>
        <button
          onClick={onBack}
          className="back-button"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // Destructure data for clean access
  const { basicDetails = {}, formDetails = {} } = resumeData;

  // Helper function to render bullet points or a single paragraph
  const renderDetails = (details) => {
    if (Array.isArray(details)) {
      // If it's an array, render a standard ATS-friendly bullet list
      return (
        <ul className="item-bullet-points">
          {details.map((detail, i) => <li key={i}>{detail}</li>)}
        </ul>
      );
    }
    // Otherwise, render as a paragraph
    return <p className="description-text">{details}</p>;
  };
  
  // ------------------ Main Resume Layout ------------------
  return (
    <div className="resume-page-wrapper">
      
      <button onClick={onBack} className="back-button print-hide">
        ← Back to Editor
      </button>

      {/* Main ATS-Friendly Container */}
      <div className="resume-container">
        
        {/* ----------------- Header ----------------- */}
        <div className="resume-header">
          <h1 className="resume-name">{basicDetails.name || 'Your Name'}</h1>
          <p className="resume-title">{formDetails.headline || 'Professional Headline'}</p>
          <div className="contact-info">
            {basicDetails.email && <a href={`mailto:${basicDetails.email}`}>{basicDetails.email}</a>}
            {basicDetails.phone && <span>| {basicDetails.phone}</span>}
            {/* You can add location, LinkedIn, GitHub here */}
            {basicDetails.city && <span>| {basicDetails.city}</span>}
          </div>
        </div>

        {/* ----------------- Summary ----------------- */}
        {(formDetails.summary || formDetails.headline) && (
          <section className="resume-section summary-section">
            <h2 className="section-heading">Summary</h2>
            <p className="summary-text">
              {formDetails.summary || formDetails.headline}
            </p>
          </section>
        )}

        {/* ----------------- Experience ----------------- */}
        {Array.isArray(formDetails.experience) && formDetails.experience.length > 0 && (
          <section className="resume-section experience-section">
            <h2 className="section-heading">Experience</h2>
            {formDetails.experience.map((exp, idx) => (
              <div key={idx} className="detail-item">
                <div className="item-header">
                  <p className="item-role">{exp.role} <span className="item-company">| {exp.company}</span></p>
                  <p className="item-duration">{exp.duration}</p>
                </div>
                {renderDetails(exp.description || exp.details)} 
              </div>
            ))}
          </section>
        )}

        {/* ----------------- Projects ----------------- */}
        {Array.isArray(formDetails.projects) && formDetails.projects.length > 0 && (
          <section className="resume-section projects-section">
            <h2 className="section-heading">Projects</h2>
            {formDetails.projects.map((proj, idx) => (
              <div key={idx} className="detail-item">
                <div className="item-header">
                    <p className="item-role">{proj.title}</p>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="project-link">View Project</a>}
                </div>
                {renderDetails(proj.description)}
                {proj.technologies && <p className="project-tech">Tech Stack: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</p>}
              </div>
            ))}
          </section>
        )}
        
        {/* ----------------- Skills ----------------- */}
        {Array.isArray(formDetails.skills) && formDetails.skills.length > 0 && (
          <section className="resume-section skills-section">
            <h2 className="section-heading">Skills</h2>
            {/* Simple comma-separated list is highly ATS-friendly */}
            <p className="skills-list-text">
                <span className="skill-category-label">Programming/Tools:</span> 
                {formDetails.skills.join(' • ')}
            </p>
          </section>
        )}
        
        {/* ----------------- Education ----------------- */}
        {Array.isArray(formDetails.education) && formDetails.education.length > 0 && (
          <section className="resume-section education-section">
            <h2 className="section-heading">Education</h2>
            {formDetails.education.map((edu, idx) => (
              <div key={idx} className="detail-item">
                <div className="item-header">
                  <p className="item-degree">{edu.degree} <span className="item-school">| {edu.institution}</span></p>
                  <p className="item-year">{edu.duration || edu.year}</p>
                </div>
                {edu.grade && <p className="education-grade">Grade: {edu.grade}</p>}
              </div>
            ))}
          </section>
        )}

        {/* ----------------- Certifications & Languages ----------------- */}
        {(Array.isArray(formDetails.certifications) && formDetails.certifications.length > 0) || (Array.isArray(formDetails.languages) && formDetails.languages.length > 0) ? (
            <section className="resume-section misc-section">
                {(Array.isArray(formDetails.certifications) && formDetails.certifications.length > 0) && (
                    <div className="misc-sub-section">
                        <h2 className="section-heading small-heading">Certifications</h2>
                        <p className="misc-list">
                            {formDetails.certifications.map(c => c.title || c.name).join(' • ')}
                        </p>
                    </div>
                )}
                
                {(Array.isArray(formDetails.languages) && formDetails.languages.length > 0) && (
                    <div className="misc-sub-section">
                        <h2 className="section-heading small-heading">Languages</h2>
                        <p className="misc-list">
                            {formDetails.languages.join(' • ')}
                        </p>
                    </div>
                )}
            </section>
        ) : null}

      </div>
    </div>
  );
}