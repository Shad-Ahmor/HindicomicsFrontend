import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Pagination, Button, Grid, Typography, Box, CircularProgress, Card, CardContent, IconButton, Collapse, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment'; // Optional if you want to format dates
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import ShineBorder from '../Main/ShineBorder';

const SubmitTaskPage = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState(null);
  const [assignmentLink, setAssignmentLink] = useState('');
  const [justification, setJustification] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // New state to track selected task
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [assignmentsPerPage] = useState(1); // Show one assignment per page

  // Fetch assigned tasks for the intern (GET /assigned-tasks)
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
      try {
        const response = await api.get('/assignments/assignedtasks', {
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
      navigate('/login');  // Redirect to login if no token exists
      return;
    }
    const task = assignedTasks.find((task) => task.taskId === taskId); // Find the task object based on taskId
    if (task.internStatus === 'closed') {
      setStatusMessage('Task already submitted');
      setLoading(false);
      return;
    }
    try {
      await api.post(
        '/assignments/submittask',
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

      // Re-fetch assigned tasks to update status
      const response = await api.get('/assignments/assignedtasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setAssignedTasks(response.data);

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

  // Columns for DataGrid (Submission History)
  const columns = [
    { field: 'taskName', headerName: 'Task Name', width: 200 },
    { field: 'submissionDate', headerName: 'Submission Date', width: 200 },
    { field: 'assignmentLink', headerName: 'Assignment Link', width: 250 },
    { field: 'justification', headerName: 'Justification', width: 250 },
    { field: 'internStatus', headerName: 'Status', width: 150 },
    { field: 'managerStatus', headerName: 'Manager Approval', width: 150 },
    { field: 'adminStatus', headerName: 'Admin Approval', width: 150 },
  ];

  // Transform assigned tasks into rows for DataGrid
  const rows = assignedTasks.map((task) => ({
    id: task.taskId,
    taskName: task.taskName,
    submissionDate: task.submissionDate
      ? moment(task.submissionDate).format('DD-MMM-YYYY') // Using moment.js to format
      : 'N/A', // Placeholder if there's no submissionDate
    assignmentLink: task.assignmentLink,
    justification: task.justification === '' ? 'Not Available' : task.justification,
    internStatus: task.internStatus === 'closed' ? 'Submitted' : 'Not Submitted',
    managerStatus: task.managerStatus === 'Open' ? 'Pending' : 'Not Approved',
    adminStatus: task.adminStatus === '' ? 'Pending' : 'Not Approved',
  }));

  return (
    <>
    
      <div  style={{ background: 'linear-gradient(135deg, #f3f4f6,rgb(243, 246, 255))', minHeight: '100vh' }}>
          {/* Left Side (Assigned Tasks List) */}
          <div style={{ display: 'flex', justifyContent: 'space-between'}}>
          <div style={{  width: '50%'}}>
            <ShineBorder>
                 <Card 
                      className="transition-all duration-300 hover:scale-105"
                      sx={{
                       
                      
                        pr:2,
                        pl:2,
                        pt:2,
                        border: '2px solid transparent',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                      }}
                    >
            {dataLoading ? (
              <CircularProgress />
            ) : (
              <div>
                {currentAssignments.map((assignment) => (
                  <Card
                    key={assignment.taskId}
                    sx={{
                      marginBottom: 2,
                      borderRadius: 1,
                      padding: 2,
                     
                    
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setSelectedTaskId(assignment.taskId)}
                      disabled={isTaskExpired(assignment.deadline) || assignment.internStatus === 'closed'}
                      sx={{
                        boxShadow: 2,
                        marginBottom: 2,
                        '&:hover': { boxShadow: 6 },
                      }}
                    >
                      {isTaskExpired(assignment.deadline) || assignment.internStatus === 'closed' ? "Expired/Submitted" : "Select Task"}
                    </Button>

                    <div
                      style={{ margin: '10px 0', position: 'static' }}
                      id="header"
                      className="header"
                      onClick={() => setToggle(prev => !prev)}
                    >
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#3c3c3c' }}>
                        {assignment.taskName}
                      </Typography>
                      <Typography variant="h6" color="textSecondary">Role: {assignment.role}</Typography>
                    </div>

                    <div
                      className="content"
                      style={{
                        height: toggle ? "50vh" : "0px", // Expand height when toggled
                        marginBottom: '20px',
                        overflowY: 'auto', // Enable vertical scrolling
                        maxHeight: '300px', // Set a max height for scrolling content
                      }}
                    >
                      <Typography variant="h6" color="textSecondary">Expiry Date: {new Date(assignment.deadline).toLocaleString()}</Typography>
                      <Typography variant="h6" color="textSecondary">Status: {assignment.status}</Typography>
                      <Box sx={{ marginTop: '20px' }}>
                        <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: assignment.assignmentDescription }} />
                      </Box>
                    </div>
                  </Card>
                ))}
                <Pagination
                  count={Math.ceil(assignedTasks.length / assignmentsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}
                />
              </div>
            )}
            </Card>
         </ShineBorder>
</div>
          {/* Right Side (Task Submission) */}
          {selectedTaskId && (
            <div sx={{ width: '50%', paddingLeft: '2rem' }}>
            <ShineBorder>
                 <Card 
                      className="transition-all duration-300 hover:scale-105"
                      sx={{
                       
                      
                        pr:2,
                        pl:2,
                        pt:2,
                        border: '2px solid transparent',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                      }}
                    >
              
                {/* Find the selected task */}
                {assignedTasks.find(task => task.taskId === selectedTaskId) && (
                  <>
                    {isTaskExpired(assignedTasks.find(task => task.taskId === selectedTaskId).deadline) ? (
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom color="error">Your assignment submission date has expired!!</Typography>
                        <TextField
                          fullWidth
                          label="Justification"
                          variant="outlined"
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                          multiline
                          rows={4}
                          sx={{ boxShadow: 2 }}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Upload your assignment at Google Drive / GitHub and paste the link here!</Typography>
                        <TextField
                          fullWidth
                          label="Assignment Link"
                          variant="outlined"
                          value={assignmentLink}
                          onChange={(e) => setAssignmentLink(e.target.value)}
                          sx={{ boxShadow: 2 }}
                        />
                      </Grid>
                    )}

                    {/* Submit Task Button */}
                    <Grid item xs={12} sx={{mt:4,mb:4}}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmitTask(selectedTaskId)}
                        disabled={loading || assignedTasks.find(task => task.taskId === selectedTaskId).internStatus === 'closed'}
                        sx={{
                          boxShadow: 3,
                          '&:hover': { boxShadow: 6 },
                        }}
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
                  </>
                )}
             
              </Card>
              </ShineBorder>
            </div>
          )}
       
</div>
        {/* DataGrid for Submission History */}
        <div style={{marginTop:'10px'}}>
        <ShineBorder>
                 <Card 
                      className="transition-all duration-300 hover:scale-105"
                      sx={{
                       
                      
                        pr:2,
                        pl:2,
                        pt:2,
                        border: '2px solid transparent',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                      }}
                    >
      
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Submission History</Typography>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
           
            />
          </div>
     
        </Card>
        </ShineBorder>
        </div>
      </div>
    </>
  );
};

export default SubmitTaskPage;
