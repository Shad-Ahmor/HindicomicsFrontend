import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, IconButton, Select, MenuItem, Grid, Typography, Box, CircularProgress, TextField, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
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
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
      const response = await api.get('/assignments/finalsubmission', {
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
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
      const response = await api.post(
        '/assignments/final-review',
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

  return (
    <Container maxWidth="lg" sx={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Admin Review Page
      </Typography>

      {/* Display Loading Indicator */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Task Id</TableCell>
                <TableCell>Task Name</TableCell>
                <TableCell>Intern Name</TableCell>
                <TableCell>Manager Status</TableCell>
                <TableCell>Admin Status</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((task) => (
                <TableRow key={task.taskId}>
                  <TableCell>{task.taskId}</TableCell>
                  <TableCell>{task.taskName}</TableCell>
                  <TableCell>{task.submissions[0].email}</TableCell>
                  <TableCell>{task.submissions[0].managerStatus}</TableCell>
                  <TableCell>{task.submissions[0].adminStatus}</TableCell>
                  <TableCell>{task.submissions[0].marks}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Select
                        label="Rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        disabled={task.submissions[0].adminStatus === 'approved' || task.submissions[0].adminStatus === 'rejected'}
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
                        disabled={task.submissions[0].adminStatus === 'approved' || task.submissions[0].adminStatus === 'rejected'}
                        sx={{ width: '200px', marginRight: 1 }}
                      />

                      <IconButton
                        color="success"
                        disabled={task.submissions[0].adminStatus === 'approved' || task.submissions[0].adminStatus === 'rejected'}
                        onClick={() => handleReviewSubmission(task.taskId, 'approve', task.submissions[0].uid)}
                        sx={{ marginRight: 1 }}
                      >
                        <CheckCircle />
                      </IconButton>

                      <IconButton
                        color="error"
                        disabled={task.submissions[0].adminStatus === 'approved' || task.submissions[0].adminStatus === 'rejected'}
                        onClick={() => handleReviewSubmission(task.taskId, 'reject', task.submissions[0].uid)}
                        sx={{ marginRight: 1 }}
                      >
                        <Cancel />
                      </IconButton>

                      <IconButton
                        color="warning"
                        disabled={task.submissions[0].adminStatus === 'approved' || task.submissions[0].adminStatus === 'rejected'}
                        onClick={() => handleReviewSubmission(task.taskId, 'modify', task.submissions[0].uid)}
                        sx={{ marginRight: 1 }}
                      >
                        <Edit />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
