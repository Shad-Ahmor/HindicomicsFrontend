import { useEffect, useState } from 'react';
import { encryptData, decryptData } from '../Security/cryptoUtils.js';  // Import the library functions

import { Container, Grid, Typography, Box } from '@mui/material';
import ActivityTable from './ActivityTable'; // Import the ActivityTable component
import TrackActivity from './TrackActivity'; // Import the TrackActivity component

const ActivityTracker = () => {
  const [startTime] = useState(Date.now()); // Track the start time when the page loads
  const [userId] = useState(localStorage.getItem('uid')); // Get user ID from local storage
  const decryptuser=decryptData(userId);
  
  const page = "Dashboard"; // Set the page name

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item>
          <Typography variant="h6">User Activity Track</Typography>
        </Grid>
      </Grid>

      {/* Track user activity on page unload */}
      <TrackActivity startTime={startTime} userId={decryptuser} page={page} />

      <Box sx={{ mb: 3 }}>
        {/* Render ActivityTable to display activity logs */}
        <ActivityTable />
      </Box>
    </Container>
  );
};

export default ActivityTracker;
