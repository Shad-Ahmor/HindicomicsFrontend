import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts'; // Import Google Charts
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import api from '../api';

export default function UserActivityGraph() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Filter state
  const [timeLimit, setTimeLimit] = useState(5 * 60 * 1000); // Default to 5 minutes for "active" filter
  const navigate = useNavigate();

  // Mapping filter values to time limits (in milliseconds)
  const filterToTimeLimit = {
    all: 0, // No time filter, get all logs
    active: 5 * 60 * 1000, // 5 minutes
    today: 24 * 60 * 60 * 1000, // 24 hours
    yesterday: 48 * 60 * 60 * 1000, // 48 hours
    this_week: 7 * 24 * 60 * 60 * 1000, // 7 days
    this_month: 30 * 24 * 60 * 60 * 1000, // 30 days
    this_year: 365 * 24 * 60 * 60 * 1000, // 365 days
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/login');
      return;
    }

    // Function to handle API call based on selected filter
    const fetchLogs = async (filter) => {
      setLoading(true);
      try {
        const response = await api.get('/userlogs/referredbyme', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { 
            filter, 
            timeLimit: filterToTimeLimit[filter] || 5 * 60 * 1000 // Default to 5 minutes if filter is not recognized
          },
        });
        const formattedLogs = response.data.map((log) => ({
          id: log.userId + log.date + log.page,  // Unique ID for each log
          email: log.email,
          date: log.date,
          isActive: log.isActive, // Active status from API
        }));

        setLogs(formattedLogs);
      } catch (error) {
        console.error('Error fetching user logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs(filter); // Fetch data for the selected filter
  }, [navigate, filter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Prepare data for the Material Bar Chart
  const activityData = logs.reduce((acc, log) => {
    const date = log.date.split(' ')[0];  // Extract date (assuming format "yyyy-mm-dd")

    if (!acc[date]) acc[date] = { active: new Set(), inactive: new Set() };

    // Add email to either active or inactive set based on the isActive flag
    if (log.isActive) {
      acc[date].active.add(log.email); // Add unique email to active set
    } else {
      acc[date].inactive.add(log.email); // Add unique email to inactive set
    }

    return acc;
  }, {});

  // Convert activityData into a format Google Charts can work with
  const chartData = [
    ['Date', 'Active Users', 'Inactive Users'], // Column headers
  ];

  Object.keys(activityData).forEach((date) => {
    const row = [
      date,
      activityData[date].active.size,  // Number of unique active users
      activityData[date].inactive.size,  // Number of unique inactive users
    ];
    chartData.push(row);
  });

  // Material chart options
  const options = {
    chart: {
      title: 'User Activity (Active vs Inactive)',
      subtitle: 'Active vs Inactive users per day',
    },
    isStacked: true, // Stack the bars
    chartArea: { width: '80%' },
    hAxis: {
      title: 'Date',
    },
    vAxis: {
      title: 'Number of Users',
    },
    legend: { position: 'top' },
  };

  return (
    <Box
      sx={{
        alignItems: "flex-start", // Align the charts to the top
        minHeight: "100vh",
        width: "100%",
        padding: 1,
      }}
    >
      {/* Filter Dropdown */}
      <Box sx={{ marginBottom: 1, width: '100%' }}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="active">Currently Active</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="yesterday">Yesterday</MenuItem>
          <MenuItem value="this_week">This Week</MenuItem>
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="this_year">This Year</MenuItem>
        </Select>
      </Box>

      {/* Chart Section */}
      <Box sx={{ display: "flex", flexDirection: "row", width: '100%', justifyContent: 'space-between' }}>
        {/* Material Bar Chart */}
        <Paper sx={{ width: '100%', marginTop: 2, padding: 1 }}>
          <Chart
            chartType="Bar" // Material Bar chart
            data={chartData}
            options={options}
            width="100%"
            height="400px"
          />
        </Paper>
      </Box>
    </Box>
  );
}
