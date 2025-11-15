import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import {
  Box,
  Paper,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import api from '../api';

export default function UserActivityGraph() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Mapping filter values to time limits (milliseconds)
  const filterToTimeLimit = {
    all: 0,
    active: 5 * 60 * 1000,
    today: 24 * 60 * 60 * 1000,
    yesterday: 48 * 60 * 60 * 1000,
    this_week: 7 * 24 * 60 * 60 * 1000,
    this_month: 30 * 24 * 60 * 60 * 1000,
    this_year: 365 * 24 * 60 * 60 * 1000,
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/userlogs/referredbyme', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            filter,
            timeLimit: filterToTimeLimit[filter] ?? 5 * 60 * 1000,
          },
        });

        const formattedLogs = response.data.map((log) => ({
          id: `${log.userId}-${log.date}-${log.page}`,
          email: log.email,
          date: log.date,
          isActive: log.isActive,
        }));

        setLogs(formattedLogs);
      } catch (error) {
        console.error('Error fetching user logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filter, navigate]);

  // Prepare chart data
  const activityData = logs.reduce((acc, log) => {
    const dateKey = log.date.split(' ')[0]; // Use only the date part
    if (!acc[dateKey]) acc[dateKey] = { active: new Set(), inactive: new Set() };
    if (log.isActive) acc[dateKey].active.add(log.email);
    else acc[dateKey].inactive.add(log.email);
    return acc;
  }, {});

  const chartData = [['Date', 'Active Users', 'Inactive Users']];
  Object.keys(activityData).forEach((date) => {
    chartData.push([
      date,
      activityData[date].active.size,
      activityData[date].inactive.size,
    ]);
  });

  const options = {
    chart: {
      title: 'User Activity Overview',
      subtitle: 'Active vs Inactive Users per Day',
    },
    isStacked: true,
    chartArea: { width: '80%' },
    hAxis: { title: 'Date' },
    vAxis: { title: 'Number of Users' },
    legend: { position: 'top' },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      {/* 🔹 Filter Dropdown */}
      <Box sx={{ mb: 2, maxWidth: 300 }}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          size="small"
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

      {/* 🔹 Chart Section */}
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : chartData.length > 1 ? (
          <Chart
            chartType="Bar"
            data={chartData}
            options={options}
            width="100%"
            height="400px"
            loader={<CircularProgress />}
          />
        ) : (
          <Typography color="text.secondary">
            No user activity data available for the selected filter.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
