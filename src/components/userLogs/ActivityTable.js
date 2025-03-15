import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography } from '@mui/material';

const ActivityTable = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserActivity = async () => {
      const userId = localStorage.getItem('uid'); // Get the user ID from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
      if (!userId || !token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        // Sending POST request with userId in the body
        const response = await api.post(
          'https://hindicomicsbackend.onrender.comuseractivity/logs', 
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Set activities data from the response
        setActivities(response.data.activities);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user activity:', err);
        setError('Error fetching activity logs');
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []); // Empty dependency array to run the effect once

  // Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'userEmail', headerName: 'Email', width: 200 },
    { field: 'page', headerName: 'Page', width: 200 },
    { field: 'sessionDuration', headerName: 'Session Duration (s)', width: 200 },
    { field: 'timestamp', headerName: 'Time', width: 200 },

  ];
  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Returns a readable date string
  };
  // Transform the activity data into rows for DataGrid
  const rows = activities.map((activity, index) => ({
    id: index + 1, // Adding a unique ID to each row
    userEmail: activity.userEmail,
    page: activity.page,
    sessionDuration: activity.sessionDuration,
    timestamp: convertTimestamp(activity.timestamp), // Convert timestamp to human-readable format

  }));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Loading activity logs...
        </Typography>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
      <h1>User Activity Logs</h1>
      {activities.length === 0 ? (
        <p>No activity logs available.</p>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5} // You can adjust the number of rows per page
          rowsPerPageOptions={[5, 10, 15]}
          checkboxSelection // Optional: adds checkboxes for row selection
        />
      )}
    </div>
  );
};

export default ActivityTable;
