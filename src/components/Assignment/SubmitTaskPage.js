import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Pagination, Button, Grid, Typography, Box, CircularProgress, Card, CardContent, IconButton, Collapse, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment'; // Optional if you want to format dates
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';


const SubmitTaskPage = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState(null);
  const [assignmentLink, setAssignmentLink] = useState('');
  const [justification, setJustification] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [assignmentsPerPage] = useState(1); // Show one assignment per page

  // Fetch assigned tasks for the intern (GET /assigned-tasks)
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }      try {
        const response = await api.get('https://hindicomicsbackend.onrender.comassignments/assignedtasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setAssignedTasks(response.data);
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        setDataLoading(false);
      }
    };

    fetchAssignedTasks();
  }, []);

  // Handle task submission (POST /submit-task)
  const handleSubmitTask = async (taskId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/');  // Redirect to login if no token exists
      return;
    }
        const task = assignedTasks.find((task) => task.taskId === taskId); // Find the task object based on taskId
    if(task.internStatus === 'closed'){
      setStatusMessage('Task already submitted');
      setLoading(false);
      return;
    }
    try {
      await api.post(
        'https://hindicomicsbackend.onrender.comassignments/submittask',
        {
          taskId,
          assignmentLink: task.internStatus === 'closed' ? '' : assignmentLink, 
          justification: task.internStatus === 'expired' ? justification : '', 
          internStatus: justification !== '' ? 'expired' : assignmentLink !== '' ? 'closed' : 'open' 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatusMessage('Task submitted successfully. Your status is now closed.');

    } catch (error) {
      setStatusMessage('Error submitting task: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if the task has expired based on the deadline
  const isTaskExpired = (deadline) => {
    const currentDate = new Date();
    return new Date(deadline) < currentDate;
  };

  // Pagination Logic
  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = assignedTasks.slice(indexOfFirstAssignment, indexOfLastAssignment);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  const columns = [
    { field: 'taskName', headerName: 'Task Name', width: 200 },
    { field: 'submissionDate', headerName: 'Submission Date', width: 200 },
    { field: 'assignmentLink', headerName: 'Assignment Link', width: 250 },
    { field: 'justification', headerName: 'Justification', width: 250 },
    { field: 'internStatus', headerName: 'Status', width: 150 },
    { field: 'managerStatus', headerName: 'Manager Aproval', width: 150 },
    { field: 'adminStatus', headerName: 'Admin Aproval', width: 150 },

  ];
  const rows = assignedTasks.map((task) => ({
    id: task.taskId,
    taskName: task.taskName,
    submissionDate: task.submissionDate
    ? moment(task.submissionDate).format('DD-MMM-YYYY') // Using moment.js to format
    : 'N/A', // Placeholder if there's no submissionDate    assignmentLink: task.assignmentLink,
   'assignmentLink': task.assignmentLink,
    justification: task.justification == ''? 'Not Available' : task.justification,
    internStatus: task.internStatus == 'closed' ? 'Submitted' : 'Not Submitted',
    managerStatus: task.managerStatus == 'Open' ? 'Pending' : 'Not Approved',
    adminStatus: task.adminStatus == '' ? 'Pending' : 'Not Approved'

  }));
  return (
    <>
    <div className='neumorphcard'>

        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Left Side (Assigned Tasks List) */}
          <Box sx={{ width: '50%' }}>
        
            {dataLoading ? (
              <CircularProgress />
            ) : (
              <div>
                {currentAssignments.map((assignment) => (
                
             <div className='submitcard'>
             <div
          id="header"
          class="header"
          onClick={() => {
            setToggle(prev => {
              return !prev;
            });
          }}
        >
                      <Typography variant="h5" gutterBottom>{assignment.taskName}</Typography>
                      <Typography variant="h6" color="textSecondary">Role : {assignment.role}</Typography>
                      </div>         <div
          class="content"
          style={{
            height: toggle ? "50vh" : "0px", marginBottom: '20px'
          }}
        >
                      <Typography variant="h6" color="textSecondary">Expiry Date : {new Date(assignment.deadline).toLocaleString()}</Typography>
                      <Typography variant="h6" color="textSecondary">Status : {assignment.status}</Typography>
                      <Box sx={{ marginTop: '20px' }}>
                        <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: assignment.assignmentDescription }} />
                      </Box>
                   </div>
                   </div>
                ))}
                <Pagination
                  count={Math.ceil(assignedTasks.length / assignmentsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px',marginBottom:'20px' }}
                />
              </div>
            )}
          </Box>

          {/* Right Side (Task Submission) */}
          {assignedTasks.length > 0 && (
            <Box sx={{ width: '50%', paddingLeft: '2rem' }}>
              

              <Grid container spacing={2}>
                {/* Conditionally render Assignment Link or Justification Input */}
                {isTaskExpired(assignedTasks[0].deadline) ? (
                  
                  <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                Your assignment submission date has been expired!!
              </Typography>
                    <TextField
                      fullWidth
                      label="Justification"
                      variant="outlined"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      multiline
                      rows={4}
                    />
                  </Grid>
                ) : (
                  
                  <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                Upload your assignment at google drive / github and paste that project link here !!
              </Typography>
                    <TextField
                      fullWidth
                      label="Assignment Link"
                      variant="outlined"
                      value={assignmentLink}
                      onChange={(e) => setAssignmentLink(e.target.value)}
                    />
                  </Grid>
                )}

                {/* Submit Task Button */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitTask(assignedTasks[0].taskId)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
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
          )}
        </Container>
      
  </div>


  <div className='neumorphcard'>
    <Typography variant="h6" gutterBottom>
      Submission History
    </Typography>
 
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
   
  </div>

    </>
  );
};

export default SubmitTaskPage;
