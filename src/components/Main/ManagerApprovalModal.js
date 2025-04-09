import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const ManagerApprovalModal = ({ isOpen, onClose, leaveRequests, onApproveReject }) => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [action, setAction] = useState('approve'); // 'approve' or 'reject'

    // Handle selection of a leave request
    const handleSelectRequest = (event) => {
        const selectedId = event.target.value;
        const selectedLeave = leaveRequests.find(request => request.leaveId === selectedId);
        setSelectedRequest(selectedLeave);
    };

    // Handle action (approve/reject)
    const handleActionChange = (event) => {
        setAction(event.target.value);
    };

    // Trigger approve/reject
    const handleApproval = () => {
        if (selectedRequest) {
            onApproveReject(selectedRequest.leaveId, action);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '400px',
                margin: 'auto',
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
                <Typography variant="h6" gutterBottom>Manager Approval</Typography>

                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Select Leave Request</InputLabel>
                    <Select value={selectedRequest ? selectedRequest.leaveId : ''} onChange={handleSelectRequest}>
                        {leaveRequests.map((request) => (
                            <MenuItem key={request.leaveId} value={request.leaveId}>
                                {request.employeeName} - {request.startDate} to {request.endDate}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Action</InputLabel>
                    <Select value={action} onChange={handleActionChange}>
                        <MenuItem value="approve">Approve</MenuItem>
                        <MenuItem value="reject">Reject</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleApproval} fullWidth>
                    {action === 'approve' ? 'Approve' : 'Reject'}
                </Button>

                <Button variant="outlined" color="secondary" onClick={onClose} fullWidth sx={{ marginTop: 1 }}>
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
};

export default ManagerApprovalModal;
