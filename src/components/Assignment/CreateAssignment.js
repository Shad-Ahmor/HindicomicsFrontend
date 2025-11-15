import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import { Container, TextField, Button, Grid, Typography, Box, Select, MenuItem, InputLabel, FormControl, CircularProgress, Pagination, Card, CardContent } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
import './styles.css'; // Import the custom CSS file

import ShineBorder from '../Main/ShineBorder';

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
        const currentDate = new Date();
        const deadlineDate = new Date(assignment.deadline);
        let status = deadlineDate <= currentDate ? 'Status : Expired' : 'Assigned';

        if (status === 'Assigned') {
          switch (assignment.status) {
            case 'assigned':
              status = 'Status : Assigned';
              break;
            case 'closed':
              status = 'Status : Closed';
              break;
            default:
              status = 'Status : Pending';
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

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAssignTask = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/login');
      return;
    }
    
    try {
      const response = await api.post(
        `/assignments/assign-task`,
        {
          taskName,
          role,
          deadline,
          assignmentDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
  
      // Log response to verify success status
      console.log('Task assigned successfully:', response);
  
      if (response.status === 200) {
        setStatusMessage('Task assigned successfully');
        fetchAssignments(); // Fetch assignments again after successfully assigning
      } else {
        setStatusMessage('Task assignment failed');
      }
    } catch (error) {
      // Improved error handling: Check for error response
      if (error.response && error.response.data && error.response.data.message) {
        setStatusMessage('Error assigning task: ' + error.response.data.message);
      } else {
        setStatusMessage('Error assigning task: Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };
  

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

      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ height: '75vh', width: '50vw' }}>
          <ShineBorder>
            <Card
              className="transition-all duration-300 hover:scale-105"
              sx={{
                pr: 2,
                pl: 2,
                pt: 2,
                border: '2px solid transparent',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Task Name"
                    variant="outlined"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
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

                <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
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

                <Grid item xs={12} sx={{ mt: 1, mb: 4 }}>
                  <ReactQuill
                    value={assignmentDescription}
                    onChange={setAssignmentDescription}
                    modules={{
                      toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        [{ 'align': [] }],
                        ['image'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        ['clean']
                      ],
                    }}
                    placeholder="Write the assignment description here..."
                    style={{ height: '200px' }}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
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

                {statusMessage && (
                  <Grid item xs={12}>
                    <Typography color="primary" variant="body1" align="center">
                      {statusMessage}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          </ShineBorder>
        </div>

        <div style={{ height: '75vh', width: '50vw' }}>
          <ShineBorder>
            <Card
              className="transition-all duration-300 hover:scale-105"
              sx={{
                pr: 2,
                pl: 2,
                pt: 2,
                border: '2px solid transparent',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
              }}
            >
              {dataLoading ? (
  <CircularProgress />
) : (
  <Box sx={{ maxHeight: '105vh', overflowY: 'auto', pr: 1 }}>
    {currentAssignments.map((assignment) => (
      <Box key={assignment._id} sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>{assignment.taskName}</Typography>
        <Typography variant="h6" color="textSecondary">Role : {assignment.role}</Typography>
        <Typography variant="body1" gutterBottom>Deadline : {new Date(assignment.deadline).toLocaleString()}</Typography>
        <Typography variant="body2" color="textSecondary">{assignment.status}</Typography>
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: assignment.assignmentDescription }} />
        </Box>
      </Box>
    ))}
    <Pagination
      count={Math.ceil(assignments.length / assignmentsPerPage)}
      page={currentPage}
      onChange={handlePageChange}
      color="primary"
      sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
    />
  </Box>
)}

            </Card>
          </ShineBorder>
        </div>
      </Container>
    </>
  );
};

export default AdminAssignmentPage;
