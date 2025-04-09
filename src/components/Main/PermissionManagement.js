import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Box,
  TableHead,
  TableRow,
  Modal,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import axios from 'axios';
import PermissionRow from './PermissionRow'; // Import PermissionRow component


const PermissionManagement = () => {
  const [roles, setRoles] = useState([]); // Roles fetched from the API
  const [permissions, setPermissions] = useState([]); // All available permissions
  const [rolePermissions, setRolePermissions] = useState([]); // Permissions specific to selected role
  const [selectedRole, setSelectedRole] = useState(''); // Currently selected role
  const [openModal, setOpenModal] = useState(false); // Modal open/close state
  const [newPermission, setNewPermission] = useState({
    baseurl: '',
    method: '',
    url: '',
    role: '', // Role to which the permission will be added
  });


  const [openEditModal, setOpenEditModal] = useState(false);  // Manage modal open/close
const [editPermissionData, setEditPermissionData] = useState({
  baseurl: '',
  method: '',
  url: '',
  newBaseurl: '',
  newMethod: '',
  newUrl: '',
  role: selectedRole,
});
const handleOpenEditModal = (permission) => {
    setEditPermissionData({
      baseurl: permission.baseurl,
      method: permission.method,
      url: permission.url,
      newBaseurl: permission.baseurl,
      newMethod: permission.method,
      newUrl: permission.url,
      role: selectedRole,
    });
    setOpenEditModal(true);
  };
  
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  
  const token = localStorage.getItem('token'); // Token for authorization

  // Fetch roles and permissions from API on component mount
  useEffect(() => {
    // Fetch roles
    axios.get('https://hindicomicsbackend.onrender.com/api/roles').then(response => {
      setRoles(response.data);
    });

    // Fetch permissions (this could be all permissions, based on your use case)
    axios.get('https://hindicomicsbackend.onrender.com/api/permissions', {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the header
      },
    }).then(response => {
      setPermissions(response.data);
    });
  }, [token]); // Empty dependency array to fetch only once on mount

  // Handle role change
  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
  
    // Fetch role-specific permissions
    axios.get(`https://hindicomicsbackend.onrender.com/api/permissions/${role}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      console.log('Role permissions for ' + role, response.data);  // Check the response
      setRolePermissions(response.data);  // Store the permissions
    })
    .catch(error => {
      console.error('Error fetching permissions:', error);
      setRolePermissions([]);  // Clear permissions if error occurs
    });
  };



  // Open the modal for adding a new permission
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle input changes for the new permission fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPermission((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add the new permission to the server
  const handleAddPermission = () => {
    const token = localStorage.getItem('token'); // Token for authorization
  
    // Save the new permission to the server
    axios.post('https://hindicomicsbackend.onrender.com/api/save-permissions', newPermission, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        }
    })
    .then(response => {
      // Update permissions with the newly added permission
      setPermissions((prevPermissions) => [...prevPermissions, response.data]);
      setOpenModal(false); // Close the modal after adding
      handleRoleChange({ target: { value: selectedRole } }); // This will re-fetch the permissions for the selected role

    })
    .catch(err => {
      console.error('Error adding permission:', err);
      alert('Error adding permission');
    });
  };
  
  // Delete a permission
  const handleDeletePermission = (permission) => {
    // Ensure selectedRole is not undefined or empty
    if (!selectedRole) {
      alert('Please select a role first.');
      return; // Exit if no role is selected
    }
  
    // Include selectedRole along with the permission data
    const permissionWithRole = { ...permission, role: selectedRole };
  
    axios.delete('https://hindicomicsbackend.onrender.com/api/delete-permission', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: permissionWithRole, // Sending the permission data along with the selected role
    })
    .then(() => {
      // After successful delete, refresh the role permissions
      handleRoleChange({ target: { value: selectedRole } }); // Reload permissions for the current role
    })
    .catch(error => {
      console.error('Error deleting permission:', error);
      alert('Error deleting permission');
    });
  };
  

  const handleEditPermissionSubmit = () => {
    axios.put('https://hindicomicsbackend.onrender.com/api/edit-permission', editPermissionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data.message); // Show success message
      handleRoleChange({ target: { value: selectedRole } }); // Refresh the permissions for the role
      setOpenEditModal(false); // Close the modal
    })
    .catch((error) => {
      console.error('Error editing permission:', error);
      alert('Error editing permission');
    });
  };
  
  return (
    <Container>
      <h1>Permission Management</h1>

      {/* Role Selection Form */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Select Role</InputLabel>
        <Select
          value={selectedRole}
          label="Select Role"
          onChange={handleRoleChange}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalizing first letter of role */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Permissions Table */}
      {selectedRole && rolePermissions.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Method</TableCell>
                <TableCell>Permission</TableCell>
                <TableCell>Actions</TableCell> {/* New Actions column */}

              </TableRow>
            </TableHead>
            <TableBody>
              {rolePermissions.map((permission) => {
                return <PermissionRow
                 key={permission.baseurl + permission.method + permission.url}
                  permission={permission} 
                  onDelete={handleDeletePermission} // Pass delete handler
                  onEdit={handleOpenEditModal} // Pass open modal function
                  />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {/* Add Permission Button */}
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={handleOpenModal}
      >
        Add Permission
      </Button>

      {/* Add Permission Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Permission</DialogTitle>
        <DialogContent>
          <TextField
            label="Base URL"
            fullWidth
            margin="normal"
            name="baseurl"
            value={newPermission.baseurl}
            onChange={handleInputChange}
          />
             <TextField
            label="End URL"
            fullWidth
            margin="normal"
            name="url"
            value={newPermission.url}
            onChange={handleInputChange}
          />
          <TextField
            label="Method"
            fullWidth
            margin="normal"
            name="method"
            value={newPermission.method}
            onChange={handleInputChange}
          />
       
          {/* Role Selection in Modal */}
          <FormControl fullWidth style={{ marginTop: '20px' }}>
            <InputLabel>Select Role for Permission</InputLabel>
            <Select
              value={newPermission.role}
              label="Select Role"
              name="role"
              onChange={handleInputChange}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalizing first letter */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddPermission} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

       {/* Edit Permission Modal */}
    <Modal open={openEditModal} onClose={handleCloseEditModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          padding: '16px',
        }}
      >
        <h2>Edit Permission</h2>
        <TextField
          label="Base URL"
          variant="outlined"
          fullWidth
          value={editPermissionData.newBaseurl}
          onChange={(e) => setEditPermissionData({ ...editPermissionData, newBaseurl: e.target.value })}
        />
        <TextField
          label="Method"
          variant="outlined"
          fullWidth
          value={editPermissionData.newMethod}
          onChange={(e) => setEditPermissionData({ ...editPermissionData, newMethod: e.target.value })}
          style={{ marginTop: '8px' }}
        />
        <TextField
          label="URL"
          variant="outlined"
          fullWidth
          value={editPermissionData.newUrl}
          onChange={(e) => setEditPermissionData({ ...editPermissionData, newUrl: e.target.value })}
          style={{ marginTop: '8px' }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleEditPermissionSubmit}
          style={{ marginTop: '16px' }}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
    </Container>
  );
};

export default PermissionManagement;
