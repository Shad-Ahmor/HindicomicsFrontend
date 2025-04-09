import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import { Container, TextField, Button, Grid, Typography, Box, Select, MenuItem, InputLabel, FormControl, CircularProgress, Pagination, Card, CardContent } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
import './styles.css'; // Import the custom CSS file

const AdminAssignmentPage = () => {
  const [taskName, setTaskName] = useState('');
  const [role, setRole] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [assignmentsPerPage] = useState(1); // Show one assignment per page
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
        const response = await api.get('/assignments/createdassignments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update assignments with calculated status
      const updatedAssignments = response.data.map((assignment) => {
     // Calculate the current status of the assignment based on the deadline and current status
const currentDate = new Date();
const deadlineDate = new Date(assignment.deadline);

// Determine if the assignment should be marked as "Expired" or "Assigned" based on the deadline
let status = deadlineDate <= currentDate ? 'Status : Expired' : 'Assigned';

// Further adjust the status based on the actual assignment status
if (status === 'Assigned') {
switch (assignment.status) {
  case 'assigned':
    status = 'Status : Assigned';
    break;
  case 'closed':
    status = 'Status : Closed';
    break;
  default:
    status = 'Status : Pending'; // Default to a neutral state if the status is unrecognized
    break;
}
}


        return { ...assignment, status };
      });

      setAssignments(updatedAssignments);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setDataLoading(false);
    }
  };
  // Fetch assignments when the component mounts
  useEffect(() => {
 

    fetchAssignments();
  }, []);

  const handleAssignTask = async () => {
    setLoading(true);
const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
    try {
      await api.post(
        `/assignments/assign-task`,
        {
          taskName,
          role,
          deadline,
          assignmentDescription,  // Include the assignment description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
          withCredentials: true,
        }
      );
      setStatusMessage('Task assigned successfully');
      
      // Fetch assignments after assigning a new task
   

      fetchAssignments();
    } catch (error) {
      setStatusMessage('Error assigning task: ' + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = assignments.slice(indexOfFirstAssignment, indexOfLastAssignment);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Assign Task
      </Typography>
      
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '2rem'}}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Left Side (Form) */}
          <Box sx={{ width: '50%' }}>
            <Grid container spacing={2}>
              {/* Task Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Name"
                  variant="outlined"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </Grid>
              
              {/* Role Selector */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="ui_ux">UI/Ux Designer</MenuItem>
                    <MenuItem value="frontend">Frontend Developer</MenuItem>
                    <MenuItem value="backend">Backend Developer</MenuItem>
                    <MenuItem value="fullstack">Fullstack Developer</MenuItem>
                    <MenuItem value="webops">Web Operations</MenuItem>
                    <MenuItem value="tester">Tester</MenuItem>
                    <MenuItem value="smm">Social Media Marketing</MenuItem>
                    <MenuItem value="ccw">Content Creator and writer</MenuItem>
                    <MenuItem value="acc">AI Character Creator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Deadline Picker */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deadline"
                  variant="outlined"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Rich Text Editor for Assignment Description */}
              <Grid item xs={12}>
                <ReactQuill
                  value={assignmentDescription}
                  onChange={setAssignmentDescription}
                  modules={{
                    toolbar: [
                      [{ 'header': '1'}, { 'header': '2' }, { 'font': [] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['bold', 'italic', 'underline'],
                      ['link'],
                      [{ 'align': [] }],
                      ['image'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      ['clean']
                    ],
                  }}
                  placeholder="Write the assignment description here..."
                  style={{ height: '200px' }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleAssignTask}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Assign Task'}
                </Button>
              </Grid>

              {/* Status Message */}
              {statusMessage && (
                <Grid item xs={12}>
                  <Typography color="primary" variant="body1" align="center">
                    {statusMessage}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Right Side (Pagination Card Grid) */}
          <Box sx={{ width: '50%', paddingLeft: '2rem' }}>
            {dataLoading ? (
              <CircularProgress />
            ) : (
              <div>
                {currentAssignments.map((assignment) => (
                  <Card key={assignment._id} sx={{ marginBottom: '20px', padding: '20px' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>{assignment.taskName}</Typography>
                      <Typography variant="h6" color="textSecondary">Role : {assignment.role}</Typography>
                      <Typography variant="body1" gutterBottom>Deadline : {new Date(assignment.deadline).toLocaleString()}</Typography>
                      <Typography variant="body2" color="textSecondary">{assignment.status}</Typography>
                      <Box sx={{ marginTop: '20px' }}>
                        <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: assignment.assignmentDescription }} />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Pagination
                  count={Math.ceil(assignments.length / assignmentsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                />
              </div>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AdminAssignmentPage;
