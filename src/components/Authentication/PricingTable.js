import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import '../../styles/css/ShineBorder.css';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ShineBorder from '../Main/ShineBorder';

const plans = [
  { title: 'Basic', duration: '2 Months', assignments: 10, projects: 0, courses: 0, resumeTraining: false, jobPremium: false },
  { title: 'Plus', duration: '3 Months', assignments: 15, projects: 1, courses: 1, resumeTraining: false, jobPremium: false },
  { title: 'Pro', duration: '6 Months', assignments: 30, projects: 2, courses: 2, resumeTraining: true, jobPremium: true },
];

export default function PricingTable({ userToken, userId, onSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [fetchedPlan, setFetchedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [safeUserId, setSafeUserId] = useState(null);
  const [safeToken, setSafeToken] = useState(null);

  // ✅ Get token and userId from props or localStorage
  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    const storedToken = localStorage.getItem('token');
    const finalUid = userId || storedUid;
    const finalToken = userToken || storedToken;

    if (!finalUid || !finalToken) {
      console.warn('[DEBUG] Missing UID or token even in localStorage.');
    }

    setSafeUserId(finalUid);
    setSafeToken(finalToken);
  }, [userId, userToken]);

  // ✅ Fetch selected plan
  useEffect(() => {
    if (!safeUserId) return;

    const fetchSelectedPlan = async () => {
      try {
        console.log('[DEBUG] Fetching plan for UID:', safeUserId);
        const res = await axios.get(`http://localhost:5000/assignments/selected-plan/${safeUserId}`);
        if (res.data.selectedInternshipPlan) {
          setFetchedPlan(res.data.selectedInternshipPlan);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log('[DEBUG] No plan selected yet for user.');
        } else {
          console.error('[DEBUG] Failed to fetch selected plan:', err);
        }
      }
    };
    fetchSelectedPlan();
  }, [safeUserId]);
// Just make sure safeToken is **ID token**, not custom token
const handleSelect = async (planTitle) => {
  if (!safeUserId || !safeToken) {
    alert('Session expired. Please log in again.');
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    window.location.reload();
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(
      'http://localhost:5000/assignments/select-plan',
      { userId: safeUserId, planType: planTitle },
      {
        headers: {
          Authorization: `Bearer ${safeToken}`, // now ID token
          'Content-Type': 'application/json',
        },
      }
    );
    setSelectedPlan(planTitle);
          if (onSuccess) onSuccess(); // move stepper to next step

    alert(res.data.message || 'Plan selected successfully!');
    if (onSuccess) setTimeout(onSuccess, 800);
  } catch (err) {
    if (err.response?.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      window.location.reload();
    } else if (err.response?.status === 403) {
      alert("Plan already selected. You can't modify it.");
    } else {
      alert('Error selecting plan. Please try again later.');
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
                sx={{
                  border: selectedPlan === plan.title ? '2px solid #6366F1' : '2px solid transparent',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '20px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <CardHeader
                  title={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>{plan.title}</Typography>}
                  subheader={<Typography variant="subtitle2" sx={{ color: '#555' }}>{plan.duration}</Typography>}
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
                  <Typography gutterBottom>📂 {plan.projects} Project{plan.projects !== 1 ? 's' : ''}</Typography>
                  <Typography gutterBottom>🎓 {plan.courses} Course{plan.courses !== 1 ? 's' : ''}</Typography>
                  <Typography gutterBottom>
                    📄 Resume Training: {plan.resumeTraining ? <CheckIcon color="success" /> : <ClearIcon color="error" />}
                  </Typography>
                  <Typography gutterBottom>
                    🚀 Job Apply Premium: {plan.jobPremium ? <CheckIcon color="success" /> : <ClearIcon color="error" />}
                  </Typography>

                  <Button
                    variant={selectedPlan === plan.title ? 'contained' : 'outlined'}
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                    onClick={() => handleSelect(plan.title)}
                    disabled={loading || !safeUserId || !safeToken || !!selectedPlan || !!fetchedPlan}
                  >
                    {loading ? (
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

      {(selectedPlan || fetchedPlan) && (
        <Typography align="center" variant="h6" color="white" sx={{ mt: 8 }}>
          ✅ You have selected the <strong>{selectedPlan || fetchedPlan}</strong> plan.
        </Typography>
      )}
    </div>
  );
}
