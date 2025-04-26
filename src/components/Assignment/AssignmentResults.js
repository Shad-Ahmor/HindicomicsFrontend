import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Card } from '@mui/material';
import { CheckCircle, Warning, Cancel, HourglassEmpty, Pending } from '@mui/icons-material'; // Icons for status
import api from '../api';
import { useNavigate } from 'react-router-dom';
import ShineBorder from '../Main/ShineBorder';

const AssignmentResults = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);  // To show loading state
  const [error, setError] = useState(null);  // To handle errors
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch assignments from API
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.error('Token not found.');
      navigate('/login');  // Redirect to login if no token exists
      return;
    }
    const fetchAssignments = async () => {
      try {
        const response = await api.get('/assignments/results', {
            headers: {
              Authorization: `Bearer ${storedToken}`,  // Ensure the correct format
            }});  // API call to fetch assignment results
        setAssignments(response.data);  // Assuming the API returns the data in the correct format
      } catch (err) {
        setError('Failed to fetch assignments');
        console.error('Error fetching assignment results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const determineStatus = (status) => {
    switch(status) {
      case 'Passed':
        return <CheckCircle color="success" />;  // Green for Passed
      case 'Failed':
        return <Cancel color="error" />;  // Red for Failed
      case 'Back Paper':
        return <Warning color="secondary" />;  // Orange for Back Paper
      case 'Promoted':
        return <CheckCircle color="primary" />;  // Blue for Promoted
      case 'Pending result L1 Manager side':
        return <HourglassEmpty color="warning" />;  // Yellow for Pending L1
      case 'Pending result L2 Manager side':
        return <HourglassEmpty color="warning" />;  // Yellow for Pending L2
      case 'Pending result':
        return <Pending color="info" />;  // Light Blue for Pending
      default:
        return <Typography>No Status</Typography>;  // Default case for no status
    }
  };

  const determineRole = (role) => {
    switch(role) {
      case 'frontend':
        return "Frontend Developer";  // Green for Passed
      case 'backend':
        return "Backend Developer";  // Red for Failed
      case 'webops':
        return "Web Operations";  // Orange for Back Paper
      case 'smm':
        return "Social Media Marketing";  // Blue for Promoted
      case 'testing':
        return "Tester";  // Yellow for Pending L1
      case 'ccw':
        return "Content Creator and Writer";  // Yellow for Pending L2
      case 'acc':
        return "AI Character Creator";  // Light Blue for Pending
      default:
        return <Typography>No Status</Typography>;  // Default case for no status
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;  // Simple loading text, you can replace with a spinner
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;  // Display error if fetch fails
  }

  return (

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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Intern Assignment Results
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2', color: 'white' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Task Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Submission Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Intern Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Marks</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Marks</TableCell>

              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Result</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment, index) => (
              <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f4f4f4' } }}>
                <TableCell>{assignment.taskName}</TableCell>
                <TableCell>{determineRole(assignment.taskRole)}</TableCell>
                <TableCell>{new Date(assignment.submissionDate).toLocaleString()}</TableCell>
                <TableCell>{assignment.internName || 'N/A'}</TableCell>
                <TableCell>{assignment.marks || 'N/A'}</TableCell> {/* Marks Field */}
                <TableCell>{assignment.rating || 'N/A'}</TableCell> {/* Marks Field */}

                <TableCell>{assignment.result || 'N/A'}</TableCell> {/* Result Field */}
                <TableCell>{determineStatus(assignment.result)}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </Card>
    </ShineBorder>
  );
};

export default AssignmentResults;
