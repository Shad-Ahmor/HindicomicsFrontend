import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Card
} from '@mui/material';
import { CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material';
import ShineBorder from '../Main/ShineBorder';

const ApprovedSubmissionsPage = () => {
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedTasks = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await api.get(`/assignments/assignmentapproval`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const approvedOnly = response.data.filter(task => task.managerStatus === 'approved');
        setApprovedTasks(approvedOnly);
      } catch (error) {
        console.error('Error fetching approved tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTasks();
  }, []);

  const determineStatusIcon = (status) => {
    switch (status) {
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
          <Typography variant="h6" gutterBottom>
            Approved Task Submissions
          </Typography>
          <Box sx={{ width: '100%', marginBottom: '20px' }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#2e7d32', color: 'white' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Task Id</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Task Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Submission Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Assignment Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Admin Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Manager Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Intern Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Assignment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvedTasks.map((task) => (
                      <TableRow key={task.taskId} sx={{ '&:hover': { backgroundColor: '#f4f4f4' } }}>
                        <TableCell>{task.taskId}</TableCell>
                        <TableCell>{task.taskName}</TableCell>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>{task.email}</TableCell>
                        <TableCell>{task.role}</TableCell>
                        <TableCell>{task.submissionDate}</TableCell>
                        <TableCell>{determineStatusIcon(task.assignmentstatus)}</TableCell>
                        <TableCell>{task.adminStatus || 'N/A'}</TableCell>
                        <TableCell>{task.managerStatus || 'N/A'}</TableCell>
                        <TableCell>{task.internStatus || 'N/A'}</TableCell>
                        <TableCell>
                          {task.assignmentLink ? (
                            <a href={task.assignmentLink} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          ) : (
                            'No Link'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Card>
      </ShineBorder>
    </Container>
  );
};

export default ApprovedSubmissionsPage;
