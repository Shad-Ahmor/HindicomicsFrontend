import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import ManagerApprovalModal from './ManagerApprovalModal';
import ShineBorder from '../Main/ShineBorder';
import '../../styles/css/ShineBorder.css';

import {
    Snackbar,
    Alert,
    Card,
} from '@mui/material';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Typography,Box,Select, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Ensure this exists
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Ensure this exists
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Stack from '@mui/material/Stack';
import { decryptData } from '../Security/cryptoUtils';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import AttendanceTable from './AttendanceTable';
import ManagerReporteesAttendance from './ManagerReporteesAttendance';
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': enUS }, // Use the correct locale here
});
const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isOnLunchBreak, setIsOnLunchBreak] = useState(false);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [leaveStartDate, setLeaveStartDate] = useState(null);
    const [leaveEndDate, setLeaveEndDate] = useState(null);
    const [leaveType, setLeaveType] = useState('single'); // 'single' or 'multiple'
    const [leaveReason, setLeaveReason] = useState('');
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [leaveModalOpen, setLeaveModalOpen] = useState(false);
    const navigate = useNavigate(); // Use the useNavigate hook
    const token = localStorage.getItem('token');
    const userId = decryptData(localStorage.getItem('uid')); // Decode user ID from token
    const [managerApprovalModalOpen, setManagerApprovalModalOpen] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]); // Fetch leave requests from the API
    
    const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar open state
    const [alertMessage, setAlertMessage] = useState('');    // Message to display
    const [alertSeverity, setAlertSeverity] = useState('success'); // 'success' | 'error' | 'warning'
    const mansagerrole =decryptData(localStorage.getItem('role'))
    function handleAlert(message, severity) {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setOpenSnackbar(true);
      };
      const markUserAbsent = async () => {
        if (!userId || !token) return;
    
        try {
            const response = await api.post(
                `/auth/mark-absents/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Absent status updated:", response.data);
        } catch (error) {
            console.error("Error marking user absent:", error);
        }
    };
    useEffect(() => {
        handleAttendance();
        markUserAbsent();
    }, []);
    
    
    const fetchAttendance = async () => {
        if (!userId) return; // Ensure userId is not null
        const response = await api.get(`/auth/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Only token in the Authorization header
            },
        });
        // Convert object to array
        const attendanceArray = response.data ? Object.values(response.data) : [];
        setAttendance(attendanceArray);
    };
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setSelectedEvent(null);
    };
    useEffect(() => {
        handleAttendance();
    }, []);
    // Call the attendance API for login/logout
    const handleAttendance = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found.');
            navigate('/login'); // Redirect to login if no token exists
            return;
        }
        try {
            const response = await api.post(
                'auth/attendance',
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Only token in the Authorization header
                    },
                }
            );
            // Handle the response based on the attendance API result
            if (response.status === 200) {
                handleAlert(response.data.message, 'success');

                await fetchAttendance(); // Re-fetch attendance to update the state after recording the attendance
            } else {
                handleAlert(response.data.message,'error');

            }
        } catch (error) {
            console.error("Error during attendance:", error);
        }
    };
    const handleLunchBreak = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found.');
            navigate('/login'); // Redirect to login if no token exists
            return;
        }
        const apiEndpoint = '/auth/break';
        try {
            const response = await api.post(apiEndpoint, { userId, breakType: 'lunch' }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Only token in the Authorization header
                },
            });
            setIsOnLunchBreak(prev => !prev); // Toggle state
            await fetchAttendance(); // Re-fetch attendance to update the state
            handleAlert(response.data,'error'); // Show the server response
        } catch (error) {
            console.error("Error during lunch break:", error);
            handleAlert(error,'error'); // Show the server response
        }
    };
    const handleBreak = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found.');
            navigate('/login'); // Redirect to login if no token exists
            return;
        }
        const apiEndpoint = '/auth/break';
        try {
            const response = await api.post(apiEndpoint, { userId, breakType: 'short' },{
                headers: {
                    Authorization: `Bearer ${token}`, // Only token in the Authorization header
                },
            });
            setIsOnBreak(prev => !prev); // Toggle state
            await fetchAttendance(); // Re-fetch attendance to update the state
            handleAlert(response.data,'success'); // Show the server response
        } catch (error) {
            console.error("Error during break:", error);
            handleAlert(error,'error')
        }
    };
    const formatDate = (date) => {
        if (!date) return '';
        const offset = date.getTimezoneOffset(); // Get the offset in minutes
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split('T')[0];
    };
    const handleApplyLeave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleAlert('Token not found. Please log in again.', 'error');
            navigate('/login'); // Redirect to login if no token exists
            return;
        }
        if (leaveType === 'single' && !leaveStartDate) {
            handleAlert('Please select a start date for leave.', 'warning');
            return;
        }
        if (leaveType === 'multiple' && (!leaveStartDate || !leaveEndDate)) {
            handleAlert('Invalid date range selected.', 'warning');
            return;
        }
        if (!leaveReason) {
            handleAlert('Please provide a reason for your leave.', 'warning');
            return;
        }
        const formattedStartDate = formatDate(leaveStartDate);
        const formattedEndDate = leaveEndDate ? formatDate(leaveEndDate) : formattedStartDate;
        try {
            const response = await api.post(
                '/auth/leave',
                {
                    userId,
                    leaveType,
                    startDate: formattedStartDate,
                    endDate: leaveType === 'multiple' ? formattedEndDate : formattedStartDate,
                    reason: leaveReason,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                handleAlert(response.data.message, 'success');
                await fetchAttendance(); // Re-fetch attendance to update the state after applying leave
                setLeaveModalOpen(false); // Close the leave modal after successful submission
            } else {
                handleAlert(response.data.message, 'error');
            }
        } catch (error) {
            console.error('Error applying for leave:', error);
            if(error.status==400){
                handleAlert(error.response.data.message);
            }
          
            else{
                handleAlert('An error occurred while applying for leave. Please try again.', 'error');

            }
        }
    };
    const handleLeaveModalClose = () => {
        setLeaveModalOpen(false);
        setLeaveStartDate(null);
        setLeaveEndDate(null);
        setLeaveReason('');
        setLeaveType('single');
    };
    const Event = ({ event }) => {
        let backgroundColor = '';
        let textColor = 'white';
    
        if (event.title === 'Absent') {
            backgroundColor = 'red';
        } else if (event.title === 'Leave') {
            backgroundColor = 'orange';
        } else {
            backgroundColor = event.color || 'gray';
        }
    
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '5px',
                color: textColor,
                backgroundColor,
                borderRadius: '5px',
            }}>
                <div style={{ flexGrow: 1, fontWeight: 'bold' }}>{event.title}</div>
                {event.total_working_time && (
                    <div style={{
                        marginTop: '2px',
                        fontWeight: 'bold',
                        textAlign: 'left',
                    }}>
                        {event.total_working_time}
                    </div>
                )}
            </div>
        );
    };
    const events = attendance.map(entry => {
        let title = 'N/A';
    
        if (entry.leave_applied === 'N' && entry.status === 'Present' && entry.break_type === 'Available') {
            title = 'Available';
        } else if (entry.leave_applied === 'N' && entry.status === 'Present' && entry.break_type === 'lunch') {
            title = 'Lunch Break';
        } else if (entry.leave_applied === 'N' && entry.status === 'Present' && entry.break_type === 'short') {
            title = 'Break';
        } else if (entry.status === 'Leave') {
            title = 'Leave';
        } else if (entry.leave_applied === 'N' && entry.status === 'Absent') {
            title = 'Absent';
        }
        else{
            title='N/A';
        }
    
        // Set color for background and white text
        let color = '';
        if (entry.status === 'Leave') {
            color = 'orange'; // Leave
        } else if (entry.leave_applied === 'N' && entry.status === 'Absent') {
            color = 'red'; // Absent
        } else if (entry.break_type === 'Available') {
            color = 'green'; // Present
        } else {
            color = 'skyblue'; // Other
        }
    
        const parsedDate = parse(entry.date, 'yyyy-MM-dd', new Date());
        const validDate = isNaN(parsedDate) ? new Date() : parsedDate;
    
        return {
            title,
            break_type: entry.break_type,
            start: validDate,
            end: validDate,
            allDay: true,
            login_time: entry.loginTime || 'N/A',
            logout_time: entry.logoutTime || 'N/A',
            lunch_break_start: entry.lunch_break_start || 'N/A',
            lunch_break_end: entry.lunch_break_end || 'N/A',
            break_time_start: entry.break_time_start || 'N/A',
            break_time_end: entry.break_time_end || 'N/A',
            total_working_time: entry.hoursAttended || '0.0',
            color: color,
            leave_applied: entry.leave_applied,
            approval_status: entry.approval_status,
        };
    });
    
    const openManagerApprovalModal = async () => {
        // Fetch leave requests (pending approval)
        const token = localStorage.getItem('token');
        try{
            const response = await api.get('/auth/manager/leave-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setLeaveRequests(response.data);
            setManagerApprovalModalOpen(true);
        }
        catch(error){
            if(error.status==403){
                handleAlert(error.response.data.message,'error')
            }
        }

      
    };
    
    const closeManagerApprovalModal = () => {
        setManagerApprovalModalOpen(false);
    };
    const handleApproveReject = async (leaveId, action) => {
        try {
            const token = localStorage.getItem('token');

            const response = await api.post(`/auth/manager/approve`, {
                leaveId,
                action,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            handleAlert(response.data.message, 'success');
            setManagerApprovalModalOpen(false);
            await fetchAttendance(); // Refresh attendance data
        } catch (error) {
            handleAlert('Failed to process the request.', 'error');
        }
    };
        
    return (
        <div>
             <ShineBorder>
           <Card
                      className="transition-all duration-300 hover:scale-105"
                      sx={{
                        mt:2,
                        pr:2,
                        pl:2,
                        border:'2px solid transparent',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '20px',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)', // 💥 Box shadow added
                      }}
                    >
            <h1>Attendance</h1>
            <Stack direction="row" spacing={1}>
                <Button color="secondary" onClick={handleLunchBreak} variant="contained" startIcon={<FastfoodIcon />}>
                    {isOnLunchBreak ? "End Lunch Break" : "Take Lunch Break"}
                </Button>
                <Button onClick={handleBreak} variant="contained" startIcon={<FreeBreakfastIcon />}>
                    {isOnBreak ? "End Break" : "Take Break"}
                </Button>
                <Button color="primary" onClick={() => setLeaveModalOpen(true)} variant="contained">
                    Apply for Leave
                </Button>
                <>
                {mansagerrole=='manager' && (
              
                <Button variant="contained" color="secondary" onClick={openManagerApprovalModal}>
    Manage Leave Requests
</Button>
                )}</>

            </Stack>


            <ManagerApprovalModal
    isOpen={managerApprovalModalOpen}
    onClose={closeManagerApprovalModal}
    leaveRequests={leaveRequests}
    onApproveReject={handleApproveReject}
/>



            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Modal
  sx={{
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    backgroundColor: 'rgba(238, 238, 238, 0.9)',
    borderRadius: '10px', // Rounded corners for a smoother look
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3), 0 6px 6px rgba(0, 0, 0, 0.1)', // 3D shadow effect
    padding: '20px',
    zIndex: 1000, // Makes sure it's above other content
    position: 'relative',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateY(0)',
    '&:hover': {
      transform: 'translateY(-5px)', // Slight lift effect on hover
    },
  }}
  isOpen={leaveModalOpen}
  onClose={handleLeaveModalClose}
>
                    <h3>Apply for Leave</h3>
                    <FormControl fullWidth>
                        <InputLabel id="leave-type-label">Leave Type</InputLabel>
                        <Select labelId="leave-type-label" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                            <MenuItem value="single">Single Day Leave</MenuItem>
                            <MenuItem value="multiple">Multiple Day Leave</MenuItem>
                        </Select>
                    </FormControl>

                    {leaveType === 'single' ? (
                        <DatePicker label="Select Date" value={leaveStartDate} onChange={setLeaveStartDate} renderInput={(params) => <TextField {...params} />} />
                    ) : (                        
                        <Stack spacing={2}>
    <DatePicker
        label="Start Date"
        value={leaveStartDate}
        onChange={setLeaveStartDate}
        renderInput={(params) => <TextField {...params} />}
    />
    <DatePicker
        label="End Date"
        value={leaveEndDate}
        onChange={setLeaveEndDate}
        renderInput={(params) => <TextField {...params} />}
    />
</Stack>)}

                    <TextField label="Leave Reason" value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} fullWidth multiline rows={3} />
                    <Button onClick={handleApplyLeave}>Submit Leave</Button>
                </Modal>
            </LocalizationProvider>


       


<Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
           

 
            <Calendar
                  localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                eventPropGetter={event => ({
                    style: { backgroundColor: event.color }
                })}
                onSelectEvent={handleSelectEvent}
                views={['month', 'week', 'day']}
                defaultView="month"
                selectable
                components={{
                    event: Event // Use the custom event component
                }}
            />
          <Modal  sx={{
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    backgroundColor: 'rgba(238, 238, 238, 0.9)',
    borderRadius: '10px', // Rounded corners for a smoother look
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3), 0 6px 6px rgba(0, 0, 0, 0.1)', // 3D shadow effect
    padding: '20px',
    zIndex: 1000, // Makes sure it's above other content
    position: 'relative',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateY(0)',
    '&:hover': {
      transform: 'translateY(-5px)', // Slight lift effect on hover
    },
  }} isOpen={modalOpen} onClose={closeModal}>
    {selectedEvent && (
        <Box>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                <strong>Title:</strong> {selectedEvent.title}
            </Typography>
            <Typography variant="body2">
                <strong>Login Time:</strong> {selectedEvent.login_time}
            </Typography>
            <Typography variant="body2">
                <strong>Logout Time:</strong> {selectedEvent.logout_time}
            </Typography>
            <Typography variant="body2">
                <strong>Lunch Break:</strong> {selectedEvent.lunch_break_start} - {selectedEvent.lunch_break_end}
            </Typography>
            <Typography variant="body2">
                <strong>Break:</strong> {selectedEvent.break_time_start} - {selectedEvent.break_time_end}
            </Typography>
            <Typography variant="body2">
                <strong>Total Working Hours:</strong> {selectedEvent.total_working_time}
            </Typography>
        </Box>
    )}
</Modal>
</Card>
            </ShineBorder>
<AttendanceTable/>
<ManagerReporteesAttendance/>
        </div>
    );
};
export default Attendance;
