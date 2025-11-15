import React from 'react';
import { Chip, Tooltip, TableCell, TableRow, styled } from '@mui/material'; // Use styled API
import { GetApp, AddCircle, Edit, Refresh, DeleteForever } from '@mui/icons-material'; // Enhanced Icons

// Utility function to get method details
const getMethodDetails = (method) => {
  switch (method) {
    case 'GET':
      return { color: 'primary', icon: <GetApp fontSize="small" /> }; // GET: Download Icon
    case 'POST':
      return { color: 'success', icon: <AddCircle fontSize="small" /> }; // POST: Add Circle Icon
    case 'PUT':
      return { color: 'warning', icon: <Edit fontSize="small" /> }; // PUT: Edit Icon
    case 'PATCH':
      return { color: 'info', icon: <Refresh fontSize="small" /> }; // PATCH: Refresh Icon
    case 'DELETE':
      return { color: 'error', icon: <DeleteForever fontSize="small" /> }; // DELETE: Delete Forever Icon
    default:
      return { color: 'default', icon: null };
  }
};

// Styled components
const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '20px',
  fontSize: '14px',
  padding: '8px 16px',
  fontWeight: 600,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Hover effect with deeper shadow
  },
}));

const StyledPermissionText = styled('span')({
  fontWeight: 'bold',
  color: '#1976d2', // Blue color for the URL
  cursor: 'pointer',
  textDecoration: 'underline',
  transition: 'color 0.3s ease', // Smooth color change effect
  '&:hover': {
    color: '#1565c0', // Hover effect for URL color
  },
});

const PermissionRow = ({ permission, onDelete, onEdit }) => {
  const { color, icon } = getMethodDetails(permission.method);

  return (
    <TableRow key={permission.baseurl + permission.method + permission.url}>
      {/* Method Column with colored chip and icon */}
      <TableCell>
        <StyledChip
          icon={icon}
          label={permission.method}
          color={color}
          aria-label={`Permission method: ${permission.method}`}
        />
      </TableCell>

      {/* Permission Column with styled URL */}
      <TableCell>
        <Tooltip title={`Permission Module: ${permission.baseurl}`} arrow>
          <StyledPermissionText
            aria-label={`Permission Module: ${permission.baseurl}`}
          >
            {`${permission.baseurl}`}
          </StyledPermissionText>
        </Tooltip>
      </TableCell>


      <TableCell>
        <Tooltip title={`Permission URL: ${permission.url}`} arrow>
          <StyledPermissionText
            aria-label={`Permission URL: ${permission.url}`}
          >
            {`${permission.url}`}
          </StyledPermissionText>
        </Tooltip>
      </TableCell>

      {/* Action Column with Edit and Delete Icons */}
      <TableCell>
        <Tooltip title="Edit Permission">
          <Edit 
            fontSize="small" 
            style={{ cursor: 'pointer', marginRight: '8px' }} 
            onClick={() => onEdit(permission)} 
          />
        </Tooltip>
        <Tooltip title="Delete Permission">
          <DeleteForever 
            fontSize="small" 
            style={{ cursor: 'pointer' }} 
            onClick={() => onDelete(permission)} 
          />
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default PermissionRow;
