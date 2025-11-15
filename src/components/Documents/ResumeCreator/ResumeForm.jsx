import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
} from "@mui/material"; 
import {
  Person,
  Email,
  Phone,
  School,
  Work,
  GitHub,
  LinkedIn,
  Language,
  Star,
  EmojiObjects,
  CheckCircle,
} from "@mui/icons-material";
import SchoolIcon from '@mui/icons-material/School'; // New import for specific icon
import "./ResumeForm.css"; // CSS file import

// Define custom icons object for better readability and a single source of truth
const icons = {
  name: <Person />,
  email: <Email />,
  phone: <Phone />,
  github: <GitHub />,
  linkedin: <LinkedIn />,
  portfolio: <Language />,
  degree: <School />,
  university: <SchoolIcon />, // Changed to use SchoolIcon for university
  year: <School />,
  grade: <Star />,
  company: <Work />,
  position: <Work />,
  duration: <Work />,
  description: <EmojiObjects />,
  skills: <EmojiObjects />,
};

const steps = ["Basic Info", "Education", "Experience", "Skills"];

export default function ResumeForm({ onSubmit }) {
  const [activeStep, setActiveStep] = useState(0);

  const [resumeData, setResumeData] = useState({
    basicDetails: {
      name: "",
      email: "",
      phone: "",
      github: "",
      linkedin: "",
      portfolio: "",
    },
    education: {
      degree: "",
      university: "",
      year: "",
      grade: "",
    },
    experience: {
      company: "",
      position: "",
      duration: "",
      description: "",
    },
    skills: "",
  });

  const handleChange = (section, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onSubmit?.(resumeData);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Custom CSS wrapper ke saath input field render karne ke liye helper function
  const renderInputField = (section, key, isMultiline = false) => (
    <div key={key} className="input-group">
      {icons[key]}
      {/* TextField ka upyog, lekin custom CSS styling par nirbhar karta hai */}
      <TextField
        fullWidth
        variant="standard"
        // MUI ki default styling ko hatane ke liye
        InputProps={{
          disableUnderline: true, 
          style: { color: '#1f2937' }, // Halka background hone ke karan gehra (dark) text
        }}
        InputLabelProps={{
            style: { color: '#4b5563' } // Gehra label text
        }}
        label={key.charAt(0).toUpperCase() + key.slice(1)}
        value={resumeData[section][key]}
        onChange={(e) =>
          handleChange(section, key, e.target.value)
        }
        multiline={isMultiline}
        rows={isMultiline ? 4 : 1}
      />
    </div>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <Typography variant="h5" component="h2" className="section-title sm:col-span-2">Basic Contact Information</Typography>
            <Typography variant="body2" className="section-subtitle sm:col-span-2">Let recruiters know how to reach you.</Typography>
            {Object.keys(resumeData.basicDetails).map((key) =>
              renderInputField("basicDetails", key)
            )}
          </div>
        );

      case 1:
        return (
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
             <Typography variant="h5" component="h2" className="section-title sm:col-span-2">Educational Background</Typography>
             <Typography variant="body2" className="section-subtitle sm:col-span-2">List your academic achievements and degrees.</Typography>
            {Object.keys(resumeData.education).map((key) =>
              renderInputField("education", key)
            )}
          </div>
        );

      case 2:
        return (
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <Typography variant="h5" component="h2" className="section-title sm:col-span-2">Work Experience</Typography>
            <Typography variant="body2" className="section-subtitle sm:col-span-2">Outline your professional roles and responsibilities.</Typography>
            {Object.keys(resumeData.experience).map((key) =>
              renderInputField("experience", key, key === "description") // 'description' multiline
            )}
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-6">
            <Typography variant="h5" component="h2" className="section-title">Core Skills</Typography>
            <Typography variant="body2" className="section-subtitle">Highlight key competencies like languages, frameworks, or tools.</Typography>
            <div className="input-group">
                {icons.skills}
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    style: { color: '#1f2937' }, // Dark text
                  }}
                   InputLabelProps={{
                        style: { color: '#4b5563' } // Darker label text
                    }}
                  label="Your Skills (comma separated)"
                  value={resumeData.skills}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      skills: e.target.value,
                    }))
                  }
                  multiline
                  rows={6}
                />
            </div>
          </div>
        );

      default:
        return <Typography color="textPrimary">Unknown Step</Typography>;
    }
  };

  return (
      <div className="resume-card">
        <Typography
          variant="h3"
          align="center"
          component="h1"
          fontWeight={700}
          className="section-title" 
          // Text color CSS se handle hoga
          sx={{ mb: 1 }} 
        >
          Resume Builder
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          className="section-subtitle" 
          sx={{ mb: 4 }}
        >
          Fill in the steps below to generate your professional resume.
        </Typography>

        {/* CUSTOM STEPPER IMPLEMENTATION */}
        <div className="stepper-container">
          {steps.map((label, index) => (
            <div key={label} className={`step ${activeStep === index ? 'active' : ''} ${activeStep > index ? 'completed' : ''}`}>
              <div className="step-number">
                {activeStep > index ? <CheckCircle fontSize="small" /> : index + 1}
              </div>
              <div className="step-text">{label}</div>
            </div>
          ))}
        </div>

        <div className="step-content">
          {renderStepContent(activeStep)}

          <div className="flex justify-between mt-12">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className="btn btn-secondary" // Custom CSS class
              disableRipple
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                endIcon={<CheckCircle />}
                onClick={handleNext}
                className="btn btn-success" // Custom CSS class
                disableRipple
              >
                Finish & Generate
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="btn btn-primary" // Custom CSS class
                disableRipple
              >
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
  );
}
