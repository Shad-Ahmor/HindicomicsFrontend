import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Grid, Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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
        navigate('/');  // Redirect to login if no token exists
        return;
      }
      const subrole = localStorage.getItem('role');

      try {
        const response = await api.get(`https://hindicomicsbackend.onrender.comassignments/assignmentapproval`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setAssignedTasks(response.data);
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
      }
    };

    fetchAssignedTasks();
  }, []);

  const handlemark = async(marks)=>{
    setInternMarks(marks);
  }
  // Handle review submission
  const handleReviewSubmission = async (taskId,  action,uid) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
      const response = await api.post(
        'https://hindicomicsbackend.onrender.comassignments/reviewsubmission',
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
      // Safely handle error response
      if (error.response) {
        // If there's a response from the server, show the error message
        setStatusMessage('Error reviewing submission: ' + error.response.data.message);
      } else if (error.request) {
        // If there's no response, it means the request was made, but no response was received
        setStatusMessage('No response from server. Please check your network connection.');
      } else {
        // If something else went wrong, show the general error
        setStatusMessage('Error reviewing submission: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Columns for DataGrid
  const columns = [
    { field: 'taskId', headerName: 'Task Id', width: 150 },
    { field: 'taskName', headerName: 'Task Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'assignmentstatus', headerName: 'Status', width: 150 },
    { field: 'internStatus', headerName: 'InternStatus', width: 150 },
    { field: 'managerstatus', headerName: 'Manager Status', width: 150 },
    { field: 'adminstatus', headerName: 'Admin Status', width: 150 },
    { field: 'submissionDate', headerName: 'Submitted Date', width: 150 },
    { field: 'assignmentLink', headerName: 'Assignment', width: 150 },
    { field: 'justification', headerName: 'Justification', width: 150 },
    { field: 'deadline', headerName: 'Deadline', width: 150 },

    { field: 'marks', headerName: 'Marks', width: 100, renderCell: (params) => <Typography>{params.value}</Typography> },
    { field: 'action', headerName: 'Action', width: 200, renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <FormControl fullWidth>
            <InputLabel>Marks</InputLabel>
            <Select
               disabled={params.row.managerstatus === 'approved' || params.row.managerstatus === 'rejected'}
              value={params.row.mark || ''}
              onChange={(e) => handlemark(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mark) => (
                <MenuItem key={mark} value={mark}>
                  {mark}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained"    disabled={params.row.managerstatus === 'approved' || params.row.managerstatus === 'rejected'} color="success" onClick={() => handleReviewSubmission(params.row.taskId, 'approve',params.row.uid)}>
            Approve
          </Button>
          <Button variant="contained"    disabled={params.row.managerstatus === 'approved' || params.row.managerstatus === 'rejected'} color="error" onClick={() => handleReviewSubmission(params.row.taskId, 'reject',  params.row.uid)}>
            Reject
          </Button>
        </Box>
      ),
    },
  ];



 

  // Convert the data for the grid with safety checks for 'submissions'
  const rows = assignedTasks.map((task) => {
    // Check if there are any submissions available for this task
    const submissions = task.assignmentLink || [];
    
    return {
      id: task.taskId,
      email:task.email,
      taskName: task.taskName,
      role:task.role,
      assignmentstatus:task.status,
      internStatus:task.internStatus,
      managerstatus: task.managerStatus,
      adminstatus:task.adminStatus,
      submissionDate:task.submissionDate,
      assignmentLink:task.assignmentLink,
      justification:task.justification,
      deadline:task.deadline,
      marks: submissions.length > 0 ? submissions : 'No marks available',
      taskId: task.taskId,
      uid:task.uid
    };
  });

  return (
    <Container maxWidth="lg" sx={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Review Task Submissions
      </Typography>

      <Box sx={{ width: '100%', marginBottom: '20px' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
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
