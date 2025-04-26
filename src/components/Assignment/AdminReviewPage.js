import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Container, IconButton, Select, MenuItem, Grid, Typography, Box, CircularProgress, TextField,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Card, TablePagination
} from '@mui/material';
import { CheckCircle, Cancel, Edit } from '@mui/icons-material';
import ShineBorder from '../Main/ShineBorder';

const AdminReviewPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [flattenedSubmissions, setFlattenedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');
        return;
      }
      const response = await api.get('/assignments/finalsubmission', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = response.data;
      setAssignments(data);

      // Flatten submissions
      const allSubmissions = data.flatMap(task =>
        task.submissions.map(sub => ({
          ...sub,
          taskId: task.taskId,
          taskName: task.taskName,
        }))
      );
      setFlattenedSubmissions(allSubmissions);
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
        navigate('/login');
        return;
      }
      await api.post(
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            Admin Review Page
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task Id</TableCell>
                    <TableCell>Task Name</TableCell>
                    <TableCell>Intern Email</TableCell>
                    <TableCell>Manager Status</TableCell>
                    <TableCell>Admin Status</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flattenedSubmissions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((submission, index) => (
                      <TableRow key={`${submission.taskId}-${submission.uid}-${index}`}>
                        <TableCell>{submission.taskId}</TableCell>
                        <TableCell>{submission.taskName}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.managerStatus}</TableCell>
                        <TableCell>{submission.adminStatus}</TableCell>
                        <TableCell>{submission.marks}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Select
                              label="Rating"
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                              disabled={submission.adminStatus === 'approved' || submission.adminStatus === 'rejected'}
                              sx={{ width: '80px', marginRight: 1 }}
                            >
                              <MenuItem value="A">A</MenuItem>
                              <MenuItem value="B">B</MenuItem>
                              <MenuItem value="C">C</MenuItem>
                              <MenuItem value="D">D</MenuItem>
                            </Select>

                            <TextField
                              label="Comments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              disabled={submission.adminStatus === 'approved' || submission.adminStatus === 'rejected'}
                              sx={{ width: '200px', marginRight: 1 }}
                            />

                            <IconButton
                              color="success"
                              disabled={submission.adminStatus === 'approved' || submission.adminStatus === 'rejected'}
                              onClick={() => handleReviewSubmission(submission.taskId, 'approve', submission.uid)}
                              sx={{ marginRight: 1 }}
                            >
                              <CheckCircle />
                            </IconButton>

                            <IconButton
                              color="error"
                              disabled={submission.adminStatus === 'approved' || submission.adminStatus === 'rejected'}
                              onClick={() => handleReviewSubmission(submission.taskId, 'reject', submission.uid)}
                              sx={{ marginRight: 1 }}
                            >
                              <Cancel />
                            </IconButton>

                            <IconButton
                              color="warning"
                              disabled={submission.adminStatus === 'approved' || submission.adminStatus === 'rejected'}
                              onClick={() => handleReviewSubmission(submission.taskId, 'modify', submission.uid)}
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

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={flattenedSubmissions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}

          {statusMessage && (
            <Grid item xs={12}>
              <Typography color="primary" variant="body1" align="center">
                {statusMessage}
              </Typography>
            </Grid>
          )}
        </Card>
      </ShineBorder>
    </Container>
  );
};

export default AdminReviewPage;
