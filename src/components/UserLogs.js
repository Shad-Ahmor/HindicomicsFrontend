import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const UserLogs = () => {
  const [userLogs, setUserLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]); // Logs after filtering
  const [searchQuery, setSearchQuery] = useState(""); // Search Query
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserLogs();
  }, []);

  useEffect(() => {
    filterLogs(); // Run filtering whenever searchQuery changes
  }, [searchQuery, userLogs]);

  const fetchUserLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }      
      const response = await api.get('/userlogs', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const uniqueUserIds = [...new Set(response.data.map((log) => log.userId))];

      const userEmailsData = await fetchUserEmails(uniqueUserIds);

      const formattedLogs = response.data.map((log, index) => ({
        id: index,
        userEmail: userEmailsData[log.userId] || log.userId,
        date: formatDate(log.date),
        page: log.page,
        totalDuration: `${(parseInt(log.totalDuration, 10) / 1000).toFixed(2)} sec`,
        startTime: formatDateTime(log.startTime),
        lastUpdated: formatDateTime(log.lastUpdated),
      }));

      setUserLogs(formattedLogs);
      setFilteredLogs(formattedLogs); // Initialize filtered logs
    } catch (error) {
      console.error('Error fetching user logs:', error);
    }
  };

  const fetchUserEmails = async (userIds) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
            const response = await api.post('/users', { database: 'users' }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emailMapping = {};
      response.data.forEach((user) => {
        if (userIds.includes(user.id)) {
          emailMapping[user.id] = user.email;
        }
      });

      return emailMapping;
    } catch (error) {
      console.error('Error fetching user emails:', error);
      return {};
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    const day = dateString.substring(0, 2);
    const month = parseInt(dateString.substring(2, 4), 10) - 1;
    const year = dateString.substring(4, 8);
    return new Date(year, month, day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (timestamp) => {
    return new Date(parseInt(timestamp, 10)).toLocaleString();
  };

  const filterLogs = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = userLogs.filter((log) =>
      log.userEmail.toLowerCase().includes(lowerCaseQuery) ||
      log.page.toLowerCase().includes(lowerCaseQuery) ||
      log.date.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredLogs(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const columns = [
    { field: 'userEmail', headerName: 'User Email', width: 250 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'page', headerName: 'Page Name', width: 200 },
    { field: 'totalDuration', headerName: 'Total Time Spent', width: 200 },
    { field: 'startTime', headerName: 'Start Time', width: 200 },
    { field: 'lastUpdated', headerName: 'Last Updated', width: 200 },
  ];

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item>
          <Typography variant="h6">App Page Track</Typography>
        </Grid>
        </Grid>
        <Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Logs"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ mb: 3 }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={filteredLogs} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
        </div>
      </Box>
    </Container>
  );
};

export default UserLogs;
