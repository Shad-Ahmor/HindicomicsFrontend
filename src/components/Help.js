import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Help = () => {
  const [helpSettings, setHelpSettings] = useState([]);
  const [newHelpSetting, setNewHelpSetting] = useState({

    id: ' ',
    adminResponse: '',
    email: '',
    issue: '',
    status: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHelpId, setSelectedHelpId] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // Fetch existing help settings from the backend
  const fetchHelpSettings = async () => {
    try {
        const token = localStorage.getItem('token');
        const rolelocal = localStorage.getItem('role');
        const userlocal = localStorage.getItem("uid");
        const response = await axios.post(
            `https://hindicomicsbackend.onrender.comhelp/`,
            {
              database: "Help",
              role: rolelocal,
              userId: userlocal,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Only token in the Authorization header
              },
            }
          );
      setHelpSettings(response.data);
    } catch (error) {
      console.error('Error fetching help settings:', error);
    }
  };

  useEffect(() => {
    fetchHelpSettings();
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHelpSetting({
      ...newHelpSetting,
      [name]: value,
    });
  };

  // Handle form submission for adding/editing help settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const helpData = {
          id: newHelpSetting.id,
        adminResponse: newHelpSetting.adminResponse,
        email: newHelpSetting.email,
        issue: newHelpSetting.issue,
        status: newHelpSetting.status
      };

      let response;

      if (isEditing) {
        // Update existing help setting
        response = await axios.put(
          `https://hindicomicsbackend.onrender.comhelp/${selectedHelpId}`,
          helpData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Create a new help setting
        response = await axios.post(
          'https://hindicomicsbackend.onrender.comhelp/helpcreate',
          helpData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        fetchHelpSettings();
        setNewHelpSetting({

          id:'',
          adminResponse: '',
          email: '',
          issue:'',
          status: ''
        });
        setIsEditing(false);
        setOpenForm(false);
      }
    } catch (error) {
      console.error('Error submitting help setting:', error);
    }
  };

  // Handle editing a help setting
  const handleEdit = (helpId) => {
    const help = helpSettings.find((help) => help.id === helpId);
    if (help) {
      setNewHelpSetting({
        id: help.id,
        adminResponse: help.adminResponse,
        email: help.email,
        issue: help.issue,
        status: help.status
      });
      setIsEditing(true);
      setSelectedHelpId(helpId);
      setOpenForm(true);
    }
  };

  // Handle deleting a help setting
  const handleDelete = async (helpId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://hindicomicsbackend.onrender.comhelp/${helpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHelpSettings();
    } catch (error) {
      console.error('Error deleting help setting:', error);
    }
  };

  // Define columns for DataGrid component
  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'adminResponse', headerName: 'Answer', width: 400 },
    { field: 'email', headerName: 'Email', width: 400 },
    { field: 'issue', headerName: 'Problem', width: 400 },
    { field: 'status', headerName: 'status', width: 400 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Convert helpSettings data into rows for DataGrid
  const rows = helpSettings.map((help) => ({
    id: help.id,
    adminResponse: help.adminResponse,
    email: help.email,
    issue: help.issue,
    status: help.status
  }));

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
            Add New Help Setting
          </Button>
        </Grid>
      </Grid>

      {/* DataGrid for Help Settings */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Help Settings List</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
        </div>
      </Box>

      {/* Add or Edit Help Setting Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
  <DialogTitle>{isEditing ? 'Edit Help Setting' : 'Add New Help Setting'}</DialogTitle>
  <DialogContent>
    <TextField
      label="ID"
      name="id"
      value={newHelpSetting.id}
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Admin Response"
      name="adminResponse"
      value={newHelpSetting.adminResponse}
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Email"
      name="email"
      value={newHelpSetting.email}
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Issue"
      name="issue"
      value={newHelpSetting.issue}
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Status"
      name="status"
      value={newHelpSetting.status}
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenForm(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleSubmit} color="primary">
      {isEditing ? 'Update' : 'Add'} Help Setting
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};

export default Help;
