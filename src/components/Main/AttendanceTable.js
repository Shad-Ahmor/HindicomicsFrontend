import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Card,
} from '@mui/material';
import moment from 'moment';
import api from '../api';
import { decryptData } from '../Security/cryptoUtils';
import ShineBorder from './ShineBorder';

export default function AttendanceTable() {
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [search, setSearch] = useState('');

  const userId = decryptData(localStorage.getItem('uid'));

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Object.values(res.data || {}).map((item, index) => ({
          id: index + 1,
          date: moment(item.date).format('YYYY-MM-DD'),
          loginTime: item.loginTime || 'NA',
          logoutTime: item.logoutTime || 'NA',
          status: item.status,
          hours: item.hoursAttended,
          leaveApplied: item.leave_applied === 'Y' ? 'Yes' : 'No',
        }));
        setAttendanceRows(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, [userId]);

  const filteredRows = attendanceRows.filter(
    (row) =>
      row.date.toLowerCase().includes(search.toLowerCase()) ||
      row.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ height: 'auto', width: '100%', mt: 3 }}>
              <ShineBorder>
               <Card
                          className="transition-all duration-300 hover:scale-105"
                          sx={{
                            pt:4,
                            pr:2,
                            pl:2,
                            pb:4,
                            border:'2px solid transparent',
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '20px',
                            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)', // 💥 Box shadow added
                          }}
                        >
  
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Attendance Report
      </Typography>

      <TextField
        fullWidth
        label="Search by date or status"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      />

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          maxHeight: 600,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)', // Stronger shadow on hover
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3f3f3' }}>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hours</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Leave</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Login Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Logout Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.hours}</TableCell>
                <TableCell>{row.leaveApplied}</TableCell>
                <TableCell>{row.loginTime}</TableCell>
                <TableCell>{row.logoutTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
    </Card>
    </ShineBorder>
    </Box>
  );
}
