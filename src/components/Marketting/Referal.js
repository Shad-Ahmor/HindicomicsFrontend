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
import Row from './Rows';
import ReferredUserLogs from './ReferredUserLogs';
import UserActivityGraph from './UserActivityGraph';

export default function CollapsibleTable() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferredData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found.');
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/users/referred', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data?.loggedInUser || null;
        const referred = userData?.referredUsers || [];

        setLoggedInUser(userData);
        setReferredUsers(referred);
      } catch (error) {
        console.error('Error fetching referred user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferredData();
  }, [navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;
  }

  if (!loggedInUser) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px', color: 'red' }}>
        Failed to load user data.
      </div>
    );
  }

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      {/* ✅ Optional: User’s activity graph */}
      <UserActivityGraph />

      {/* ✅ User & referred users table */}
      <TableContainer component={Paper} sx={{ width: '100%', mt: 3 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Email</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Designation</TableCell>
              <TableCell align="right">Referred</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ✅ Parent row: logged-in user */}
            <Row key={loggedInUser.uid} row={loggedInUser} isParent={true} />

            {/* ✅ Child rows: referred users */}
            {referredUsers.map((refUser) => (
              <Row key={refUser.uid || refUser.email} row={refUser} isParent={false} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Referred user activity logs */}
      <ReferredUserLogs />
    </Box>
  );
}
