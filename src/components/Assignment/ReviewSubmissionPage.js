import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Grid, Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CheckCircle, Warning, Cancel, HourglassEmpty, Pending } from '@mui/icons-material'; // Icons for status

const ReviewSubmissionPage = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [internmarks, setInternMarks] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch assigned tasks for review
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }

      try {
        const response = await api.get(`/assignments/assignmentapproval`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAssignedTasks(response.data);
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
      }
    };

    fetchAssignedTasks();
  }, []);

  const handlemark = async (marks) => {
    setInternMarks(marks);
  };

  // Handle review submission
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
        '/assignments/reviewsubmission',
        {
          taskId,
          action,
          internmarks,
          uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatusMessage('Submission reviewed successfully');
    } catch (error) {
      setStatusMessage('Error reviewing submission: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Determine status icon
  const determineStatus = (status) => {
    switch(status) {
      case 'Approved':
        return <CheckCircle color="success" />;
      case 'Rejected':
        return <Cancel color="error" />;
      case 'Pending':
        return <HourglassEmpty color="warning" />;
      default:
        return <Typography>No Status</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Review Task Submissions
      </Typography>

      <Box sx={{ width: '100%', marginBottom: '20px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2', color: 'white' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Task Id</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Task Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Marks</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedTasks.map((task) => (
                <TableRow key={task.taskId} sx={{ '&:hover': { backgroundColor: '#f4f4f4' } }}>
                  <TableCell>{task.taskId}</TableCell>
                  <TableCell>{task.taskName}</TableCell>
                  <TableCell>{task.email}</TableCell>
                  <TableCell>{task.role}</TableCell>
                  <TableCell>{determineStatus(task.assignmentstatus)}</TableCell>
                  <TableCell>{task.assignmentLink ? 'Marks Available' : 'No marks available'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                      <FormControl style={{ marginRight: '20px' }}>
                        <InputLabel>Marks</InputLabel>
                        <Select
                          style={{ width: 80, margin: 5, height: 40, fontSize: 10 }}
                          disabled={task.managerstatus === 'approved' || task.managerstatus === 'rejected'}
                          value={task.mark || ''}
                          onChange={(e) => handlemark(e.target.value)}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mark) => (
                            <MenuItem key={mark} value={mark}>
                              {mark}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        style={{ width: 80, margin: 5, height: 40, fontSize: 10 }}
                        variant="contained"
                        disabled={task.managerstatus === 'approved' || task.managerstatus === 'rejected'}
                        color="success"
                        onClick={() => handleReviewSubmission(task.taskId, 'approve', task.uid)}
                      >
                        Approve
                      </Button>
                      <Button
                        style={{ width: 80, margin: 5, height: 40, fontSize: 10 }}
                        variant="contained"
                        disabled={task.managerstatus === 'approved' || task.managerstatus === 'rejected'}
                        color="error"
                        onClick={() => handleReviewSubmission(task.taskId, 'reject', task.uid)}
                      >
                        Reject
                      </Button>
                      {task.assignmentLink && (
                        <Button
                          style={{ width: 180, margin: 5, fontSize: 10, height: 40 }}
                          variant="contained"
                          color="primary"
                          onClick={() => window.open(task.assignmentLink, '_blank')}
                        >
                          View Assignment
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Status Message */}
      {statusMessage && (
        <Grid item xs={12}>
          <Typography color="primary" variant="body1" align="center">
            {statusMessage}
          </Typography>
        </Grid>
      )}

      {loading && <CircularProgress />}
    </Container>
  );
};

export default ReviewSubmissionPage;
