import React, { useEffect, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  TablePagination,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ShineBorder from './ShineBorder';
// Helper function to format dates to `YYYY-MM-DD`
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

const InternRow = ({ intern }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{intern.name}</TableCell>
        <TableCell>{intern.email}</TableCell>
        <TableCell>{intern.uid}</TableCell>
        <TableCell>{intern.subrole}</TableCell>
        <TableCell>{Object.keys(intern.attendance || {}).length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, backgroundColor: '#f9f9f9', borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Attendance Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e3e3e3' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Login Time</TableCell>
                    <TableCell>Logout Time</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Leave Applied</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(intern.attendance || {}).map((record) => (
                    <TableRow key={record.date}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.loginTime}</TableCell>
                      <TableCell>{record.logoutTime}</TableCell>
                      <TableCell>{record.hoursAttended}</TableCell>
                      <TableCell>{record.leave_applied || 'N'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ManagerReporteesAttendance = () => {
  const [reportees, setReportees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState(''); // New state for the filter
  const theme = useTheme();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/auth/manager/attendance-reportees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportees(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Error fetching reportees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const results = reportees.filter(
      (intern) =>
        intern.name?.toLowerCase().includes(value) ||
        intern.email?.toLowerCase().includes(value)
    );
    setFiltered(results);
  };

  // Filter function based on the selected date range
  const handleFilter = (filter) => {
    setFilter(filter);
  
    // Get today's date (ignoring time part)
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
    // Get yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
  
    // Handle week-related filters (current week, last week)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday of the current week
    const startOfWeekString = startOfWeek.toISOString().split('T')[0];
  
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 6); // Saturday of the current week
    const endOfWeekString = endOfWeek.toISOString().split('T')[0];
  
    // For last week
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const startOfLastWeekString = startOfLastWeek.toISOString().split('T')[0];
  
    const endOfLastWeek = new Date(endOfWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 7);
    const endOfLastWeekString = endOfLastWeek.toISOString().split('T')[0];
  
    // Handle month-related filters
    const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfThisMonthString = firstDayOfThisMonth.toISOString().split('T')[0];
  
    const lastDayOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastDayOfThisMonthString = lastDayOfThisMonth.toISOString().split('T')[0];
  
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const firstDayOfLastMonthString = firstDayOfLastMonth.toISOString().split('T')[0];
  
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastDayOfLastMonthString = lastDayOfLastMonth.toISOString().split('T')[0];
  
    // Handle year-related filters
    const firstDayOfThisYear = new Date(today.getFullYear(), 0, 1);
    const firstDayOfThisYearString = firstDayOfThisYear.toISOString().split('T')[0];
  
    const lastDayOfThisYear = new Date(today.getFullYear(), 11, 31);
    const lastDayOfThisYearString = lastDayOfThisYear.toISOString().split('T')[0];
  
    const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const firstDayOfLastYearString = firstDayOfLastYear.toISOString().split('T')[0];
  
    const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
    const lastDayOfLastYearString = lastDayOfLastYear.toISOString().split('T')[0];
  
    let startDate, endDate;
  
    switch (filter) {
      case 'today':
        startDate = endDate = todayString;
        break;
      case 'yesterday':
        startDate = endDate = yesterdayString;
        break;
      case 'thisWeek':
        startDate = startOfWeekString;
        endDate = endOfWeekString;
        break;
      case 'lastWeek':
        startDate = startOfLastWeekString;
        endDate = endOfLastWeekString;
        break;
      case 'thisMonth':
        startDate = firstDayOfThisMonthString;
        endDate = lastDayOfThisMonthString;
        break;
      case 'lastMonth':
        startDate = firstDayOfLastMonthString;
        endDate = lastDayOfLastMonthString;
        break;
      case 'thisYear':
        startDate = firstDayOfThisYearString;
        endDate = lastDayOfThisYearString;
        break;
      case 'lastYear':
        startDate = firstDayOfLastYearString;
        endDate = lastDayOfLastYearString;
        break;
      default:
        return;
    }
  
    // Filter the data based on the selected date range
    const filteredData = reportees.filter((intern) => {
      return Object.values(intern.attendance || {}).some((record) => {
        const recordDate = record.date.split('T')[0]; // Format: YYYY-MM-DD
        return recordDate >= startDate && recordDate <= endDate;
      });
    });
  
    setFiltered(filteredData);
  };
  

  const handleDownloadExcel = () => {
    const allRows = [];

    filtered.forEach((intern) => {
      Object.values(intern.attendance || {}).forEach((att) => {
        allRows.push({
          Name: intern.name,
          Email: intern.email,
          UID: intern.uid,
          Subrole: intern.subrole,
          Date: att.date,
          Status: att.status,
          LoginTime: att.loginTime,
          LogoutTime: att.logoutTime,
          HoursAttended: att.hoursAttended,
          LeaveApplied: att.leave_applied || 'N',
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'attendance_report.xlsx');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Typography>Loading reportees...</Typography>;

  return (
    <ShineBorder>
      <Card
        className="transition-all duration-300 hover:scale-105"
        sx={{
          mt: 2,
          pt: 4,
          pr: 2,
          pl: 2,
          pb: 4,
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)', 
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={600}>
              📋 Manager's Intern Attendance Report
            </Typography>
          </Box>

          {/* Search bar, filter dropdown, and download button */}
          <Box display="flex" justifyContent="space-between" mb={3}>
            <FormControl size="small" sx={{ width: 200 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={(e) => handleFilter(e.target.value)}
                label="Filter"
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="lastWeek">Last Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
                <MenuItem value="lastYear">Last Year</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              size="small"
              label="Search Name/Email"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ width: 250 }}
            />

            <Button
              onClick={handleDownloadExcel}
              startIcon={<DownloadIcon />}
              variant="contained"
              color="primary"
            >
              Download Excel
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: '0 0 15px rgba(0,0,0,0.1)',
              maxHeight: 600,
              overflowY: 'auto',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>UID</TableCell>
                  <TableCell>Subrole</TableCell>
                  <TableCell>Total Attendance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((intern) => (
                  <InternRow key={intern.uid} intern={intern} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>
    </ShineBorder>
  );
};

export default ManagerReporteesAttendance;
