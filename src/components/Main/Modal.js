import React from 'react';
import '../../styles/css/Modal.css'; // Import your CSS file for modal styles
import { Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(228, 227, 227, 0.9)',
                borderRadius: 8,
                boxShadow: 0,
                padding: 4,
                zIndex: 1300,
                minWidth: 300,
                maxWidth: 400,
                outline: 'none',
                transition: 'all 0.3s ease',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="primary" fontWeight="bold">
                    Attendance Details
                </Typography>
                <IconButton onClick={onClose} color="secondary">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ my: 1 }} />
            {children}
        </Box>
    );
};

export default Modal;
