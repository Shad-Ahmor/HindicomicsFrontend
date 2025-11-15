import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  LinearProgress,
  Typography,
  CircularProgress,
} from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import '../../styles/css/App.css';
import PricingTable from './PricingTable';
import AccountCreate from './AccountCreate';

const AnimatedStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uid, setUid] = useState(null);
  const [token, setToken] = useState(null);
  const [showWaiting, setShowWaiting] = useState(false);

  // ✅ Move to next step from child component
  const handleNext = () => {
    // After PricingTable success → show waiting screen
    if (activeStep === 1) {
      setShowWaiting(true);
      setActiveStep(2); // Move to waiting screen
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  // ✅ Waiting Screen Component
  const WaitingScreen = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
        color: 'white',
        px: 3,
      }}
    >
      <CircularProgress sx={{ color: '#FFD700', mb: 3 }} />
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          background: 'linear-gradient(90deg, #FF6FD8, #3813C2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Please wait till your account is approved
      </Typography>
      <Typography variant="body1" sx={{ color: '#ccc', maxWidth: 600 }}>
        Your account has been successfully created and your internship plan has been selected.
        Once our Hindicomics team approves your account, you’ll automatically gain access to your dashboard and attendance system.
      </Typography>
    </Box>
  );

  const steps = [
    {
      label: 'Personal Info',
      content: (
        <AccountCreate setToken={setToken} setUid={setUid} onSuccess={handleNext} />
      ),
    },
    {
      label: 'Select Plan',
      content: (
        <PricingTable userToken={token} userId={uid} onSuccess={handleNext} />
      ),
    },
    {
      label: 'Waiting Approval',
      content: <WaitingScreen />,
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="account-create-form-panel"
    >
      <Paper
        sx={{
          backgroundColor: 'transparent',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100%',
        }}
      >
        {/* Header Stepper */}
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box
          className="step-content-container"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CSSTransition in={true} timeout={500} classNames="fade" appear>
            <Box
              className="step-content"
              sx={{
                width: '100%',
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {steps[activeStep].content}
            </Box>
          </CSSTransition>
        </Box>

        {/* Hide progress bar on waiting screen */}
        {!showWaiting && (
          <Box sx={{ mt: 'auto', ml: 4, mr: 4, mb: 4 }}>
            <LinearProgress
              variant="determinate"
              value={(activeStep / (steps.length - 1)) * 100}
              sx={{
                height: '8px',
                borderRadius: '5px',
                backgroundColor: '#f9f7f7ff',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1976d2',
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AnimatedStepper;
