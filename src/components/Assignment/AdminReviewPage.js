import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, IconButton , Select,MenuItem,Grid, Typography, Box, CircularProgress, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircle, Cancel, Edit } from '@mui/icons-material'; // Import colorful icons

const AdminReviewPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(''); // State for rating (A to D)

  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
      const response = await api.get('https://hindicomicsbackend.onrender.comassignments/finalsubmission', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }); // Endpoint for admin to get assignments
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  

    fetchAssignments();
  }, []);

  const handleReviewSubmission = async (taskId, action, uid) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
      const response = await api.post(
        'https://hindicomicsbackend.onrender.comassignments/final-review', 
        { taskId, action, rating, comments, uid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatusMessage('Assignment reviewed successfully');
      fetchAssignments();
    } catch (error) {
      setStatusMessage('Error reviewing submission: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'taskId', headerName: 'Task Id', width: 150 },
    { field: 'taskName', headerName: 'Task Name', width: 200 },
    { field: 'internName', headerName: 'Intern Name', width: 150 },
    { field: 'managerStatus', headerName: 'Manager Status', width: 150 },
    { field: 'adminStatus', headerName: 'Admin Status', width: 150 },
    { field: 'marks', headerName: 'Marks', width: 100 },
    { field: 'action', headerName: 'Action', width: 500, renderCell: (params) => (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        
   
   <Select
          label="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          disabled={params.row.adminStatus === 'approved' || params.row.adminStatus === 'rejected'}
          sx={{ width: '80px', marginRight: 1 }}
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
          <MenuItem value="D">D</MenuItem>
        </Select>
        {/* Comments Input */}
        <TextField
          label="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={params.row.adminStatus === 'approved' || params.row.adminStatus === 'rejected'}
          sx={{ width: '200px', marginRight: 1 }}
        />

<IconButton
          color="success"
          disabled={params.row.adminStatus === 'approved' || params.row.adminStatus === 'rejected'}
          onClick={() => handleReviewSubmission(params.row.taskId, 'approve', params.row.uid)}
          sx={{ marginRight: 1 }}
        >
          <CheckCircle />
        </IconButton>

        <IconButton
          color="error"
          disabled={params.row.adminStatus === 'approved' || params.row.adminStatus === 'rejected'}
          onClick={() => handleReviewSubmission(params.row.taskId, 'reject', params.row.uid)}
          sx={{ marginRight: 1 }}
        >
          <Cancel />
        </IconButton>

        <IconButton
          color="warning"
          disabled={params.row.adminStatus === 'approved' || params.row.adminStatus === 'rejected'}
          onClick={() => handleReviewSubmission(params.row.taskId, 'modify', params.row.uid)}
          sx={{ marginRight: 1 }}
        >
          <Edit />
        </IconButton>
     
      </Box>
    )},
  ];

  const rows = assignments.map((task) => ({
    id: task.taskId,
    taskId: task.taskId,
    taskName: task.taskName,
    internName: task.submissions[0].email,
    managerStatus: task.submissions[0].managerStatus,
    adminStatus: task.submissions[0].adminStatus,
    marks: task.submissions[0].marks,
    uid: task.submissions[0].uid,
  }));

  return (
    <Container maxWidth="lg" sx={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Admin Review Page
      </Typography>

      {/* Display DataGrid */}
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      )}

      {/* Status Message */}
      {statusMessage && (
        <Grid item xs={12}>
          <Typography color="primary" variant="body1" align="center">
            {statusMessage}
          </Typography>
        </Grid>
      )}
    </Container>
  );
};

export default AdminReviewPage;
