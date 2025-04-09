import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Row from './Rows'
import ReferredUserLogs from './ReferredUserLogs';
import UserActivityGraph from './UserActivityGraph';


export default function CollapsibleTable() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]); // Default as an empty array
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/login');  // Redirect to login if no token exists
      return;
    }

    api.get('/users/referred', {
      headers: {
        Authorization: `Bearer ${token}`, // Only token in the Authorization header
      },
    }).then((response) => {
      const { loggedInUser: user } = response.data;
      const users = user?.referredUsers || []; // Access referredUsers inside loggedInUser
      setLoggedInUser(user);  // Set logged-in user's details
      setReferredUsers(users); // Set referredUsers array
    }).catch((error) => console.error('Error fetching referred user data:', error));
  }, [navigate]);

  if (!loggedInUser) {
    return <div>Loading...</div>;  // Show loading if loggedInUser is not set yet
  }

  return (
    <Box
      sx={{
       
        width: "100%",
        padding: 2,  // Added padding around the content for better spacing
      }}
    >
    <UserActivityGraph/>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Email</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Referred</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render logged-in user as the parent row */}
            <Row key={loggedInUser.uid} row={loggedInUser} isParent={true} />
        
          </TableBody>
        </Table>
      </TableContainer>
      <ReferredUserLogs/>
    </Box>
  );
}
