import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import '../css/ShineBorder.css';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { decryptData } from '../Security/cryptoUtils';
import ShineBorder from '../Main/ShineBorder';

// ✨ ShineBorder wrapper


const plans = [
  {
    title: 'Basic',
    duration: '2 Months',
    assignments: 10,
    projects: 0,
    courses: 0,
    resumeTraining: false,
    jobPremium: false,
  },
  {
    title: 'Plus',
    duration: '3 Months',
    assignments: 15,
    projects: 1,
    courses: 1,
    resumeTraining: false,
    jobPremium: false,
  },
  {
    title: 'Pro',
    duration: '6 Months',
    assignments: 30,
    projects: 2,
    courses: 2,
    resumeTraining: true,
    jobPremium: true,
  },
];

export default function PricingTable({ userId }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSelectedPlan = async () => {
        const userId = decryptData(localStorage.getItem('uid')); // Ensure this exists

      try {
        const res = await axios.get(`https://hindicomicsbackend.onrender.com/assignments/selected-plan/${userId}`);
        if (res.data.selectedInternshipPlan) {
          setSelectedPlan(res.data.selectedInternshipPlan);
        }
      } catch (err) {
        console.error("Failed to fetch plan:", err);
      }
    };
    fetchSelectedPlan();
  }, [userId]);

  const handleSelect = async (planTitle) => {
    if (selectedPlan) {
      alert("Plan already selected. You can't modify it.");
      return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const userId = decryptData(localStorage.getItem('uid')); // Ensure this exists

      const res = await axios.post('https://hindicomicsbackend.onrender.com/assignments/select-plan', {
        userId,
        planType: planTitle,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      setSelectedPlan(planTitle);
      alert(res.data.message);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Plan already selected. You can't modify it.");
      } else {
        console.error("Error selecting plan:", err);
        alert("Something went wrong while selecting the plan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
<Typography
  variant="h4"
  align="center"
  gutterBottom
  sx={{
    fontWeight: 800,
    fontSize: '2.5rem',
    background: 'linear-gradient(90deg, #A07CFE, #FE8FB5, #FFBE7B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 20px rgba(255, 255, 255, 0.25)',
    mb: 6,
    letterSpacing: 1.2,
  }}
>
  Choose Your Internship Plan
</Typography>

      <Grid container spacing={4} justifyContent="center" className="mt-10">
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.title}>
            <ShineBorder>
              <Card
                className="transition-all duration-300 hover:scale-105"
                sx={{
                  border: selectedPlan === plan.title ? '2px solid #6366F1' : '2px solid transparent',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '20px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)', // 💥 Box shadow added
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {plan.title}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="subtitle2" sx={{ color: '#555' }}>
                      {plan.duration}
                    </Typography>
                  }
                  sx={{
                    textAlign: 'center',
                    background: selectedPlan === plan.title ? '#e0e7ff' : '#f3f4f6',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                  }}
                />
                <Divider />
                <CardContent>
                  <Typography gutterBottom>📘 {plan.assignments} Assignments</Typography>
                  <Typography gutterBottom>
                    📂 {plan.projects} Project{plan.projects !== 1 ? 's' : ''}
                  </Typography>
                  <Typography gutterBottom>
                    🎓 {plan.courses} Course{plan.courses !== 1 ? 's' : ''}
                  </Typography>
            
                  <Typography gutterBottom>
  📄 Resume Training:{' '}
  {plan.resumeTraining ? (
    <CheckIcon sx={{ color: '#2e7d32', verticalAlign: 'middle' }} />
  ) : (
    <ClearIcon sx={{ color: '#d32f2f', verticalAlign: 'middle' }} />
  )}
</Typography>

<Typography gutterBottom>
  🚀 Job Apply Premium:{' '}
  {plan.jobPremium ? (
    <CheckIcon sx={{ color: '#2e7d32', verticalAlign: 'middle' }} />
  ) : (
    <ClearIcon sx={{ color: '#d32f2f', verticalAlign: 'middle' }} />
  )}
</Typography>



                  <Button
                    variant={selectedPlan === plan.title ? 'contained' : 'outlined'}
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                    onClick={() => handleSelect(plan.title)}
                    disabled={loading || !!selectedPlan}
                  >
                    {loading && selectedPlan === null ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : selectedPlan === plan.title ? (
                      '✔ Selected'
                    ) : (
                      `Choose ${plan.title}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </ShineBorder>
          </Grid>
        ))}
      </Grid>

      {selectedPlan && (
        <Typography align="center" variant="h6" color="white" sx={{ mt: 8 }}>
          ✅ You have selected the <strong>{selectedPlan}</strong> plan.
        </Typography>
      )}
    </div>
  );
}
