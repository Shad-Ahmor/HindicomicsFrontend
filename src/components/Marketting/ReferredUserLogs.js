import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import api from '../api';

const columns = [
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'date', headerName: 'Date', width: 200 },
  { field: 'page', headerName: 'Page', width: 200 },
  { field: 'totalDuration', headerName: 'Total Duration (s)', width: 200 },
  { field: 'lastUpdated', headerName: 'Last Updated', width: 200 },
  { field: 'startTime', headerName: 'Start Time', width: 200 },
];

export default function ReferredUserLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/login');
      return;
    }

    api.get('/userlogs/referredbyme', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const formattedLogs = response.data.map((log) => ({
          id: log.email + log.date + log.page,  // Unique ID for each log
          email: log.email,  // Use email instead of userId
          date: log.date,
          page: log.page,
          totalDuration: log.totalDuration,
          lastUpdated: new Date(log.lastUpdated).toLocaleString(),
          startTime: new Date(log.startTime).toLocaleString(),
        }));
        setLogs(formattedLogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user logs:', error);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        padding: 2,
      }}
    >
      <Paper sx={{ width: '100%', height: 500, marginTop: 2 }}>
        <DataGrid
          rows={logs}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
