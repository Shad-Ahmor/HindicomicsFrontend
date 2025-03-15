import React, { useState, useEffect } from 'react';
import api from './api'; // Import the custom axios instance

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
  FormControlLabel,
  Checkbox,
  Box,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'; // For redirection


const AdmobPage = () => {

  const [admobSettings, setAdmobSettings] = useState([]);
  const [newAdmob, setNewAdmob] = useState({
    adId: '',
    banner: '',
    isActive: false,
    main: '',
    rewardads: '',
    rewardfrequency: 5,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAd, setSelectedAd] = useState("Admob");
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate(); // To handle navigation after logout

  // Fetch existing Admob settings
  const fetchAdmobSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const rolelocal = localStorage.getItem('role');
      const userlocal = localStorage.getItem("uid");
  // Check if token exists, otherwise skip the request
  if (!token) {
    console.error('Token not found.');
    navigate('/');  // Redirect to login if no token exists
    return;
  }
      const response = await api.post(
        `https://hindicomicsbackend.onrender.comadmob/`,
        {
          database: selectedAd,
          role: rolelocal,
          userId: userlocal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Only token in the Authorization header
          },
        }
      );
      setAdmobSettings(response.data);
    } catch (error) {
      // In case of 401 Unauthorized error (token expired)
      if (error.response && error.response.status === 401) {
        // Perform logout and redirect to login page
        handleLogout();
      }
        }
  };

  useEffect(() => {
    fetchAdmobSettings();
  }, []);
  const handleLogout = () => {
    // Clear localStorage and session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('uid');

    // Redirect to login page
    navigate('/');
  };
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAdmob({
      ...newAdmob,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the Admob settings data to be sent in the request
      const newAdmobData = {
        adId: newAdmob.adId || "",
        banner: newAdmob.banner || "",
        isActive: newAdmob.isActive || false,
        main: newAdmob.main || "",
        rewardads: newAdmob.rewardads || "",
        rewardfrequency: newAdmob.rewardfrequency || 5, // Default to 5 if not provided
      };

      const token = localStorage.getItem('token'); // Retrieve token from localStorage for authentication
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
         
      let response;

      // Check if we are editing an existing Admob setting or adding a new one
      if (isEditing) {
        // If editing, send PUT request to update existing Admob setting
        response = await api.put(
          `https://hindicomicsbackend.onrender.comadmob/${selectedAd}`, // Use selectedAd for the Admob ID to be updated
          newAdmobData,
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass token for authentication
          }
        );
      } else {
        // If adding a new Admob setting, send POST request to create a new one
        response = await api.post(
          `https://hindicomicsbackend.onrender.comadmob/addads`, // Endpoint to create a new Admob setting
          newAdmobData,
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass token for authentication
          }
        );
      }

      // Check for successful response status (201 for creation, 200 for update)
      if (response.status === 201 || response.status === 200) {
        // After successful submission (either creation or update), fetch the latest settings
        fetchAdmobSettings();
        setNewAdmob({
          adId: '',
          banner: '',
          isActive: false,
          main: '',
          rewardads: '',
          rewardfrequency: 5,
        }); // Reset the form fields
        setIsEditing(false); // Reset the editing flag
        setOpenForm(false); // Close the form
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Perform logout and redirect to login page
        handleLogout();
      }      // Optionally show an error message to the user
    }
  };

  // Handle Edit
// Handle Edit
const handleEdit = (adId) => {
    const ad = admobSettings.find((ad) => ad.id === adId);
    if (ad) {
      setNewAdmob({
        adId: ad.adId,
        banner: ad.banner,
        isActive: ad.isActive,
        main: ad.main,
        rewardads: ad.rewardads,
        rewardfrequency: ad.rewardfrequency,
      });
      setIsEditing(true);
      setSelectedAd(adId);
      setOpenForm(true);
    }
  };
  

  // Handle Delete
  const handleDelete = async (adId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/');  // Redirect to login if no token exists
        return;
      }
      await api.delete(
        `https://hindicomicsbackend.onrender.comadmob/${adId}`, // Use the selectedDatabase and filename in the URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAdmobSettings();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Perform logout and redirect to login page
        handleLogout();
      }    }
  };

  // Columns for DataGrid
// Columns for DataGrid
const columns = [
    { field: 'adId', headerName: 'Ad ID', width: 150 },
    { field: 'banner', headerName: 'Banner Ad ID', width: 200 },
    { field: 'main', headerName: 'Main Ad ID', width: 200 },
    { field: 'rewardads', headerName: 'Reward Ads ID', width: 200 },
    { field: 'rewardfrequency', headerName: 'Reward Frequency', width: 180 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 120,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: params.value ? 'green' : 'red',
            color: 'white',
            padding: '5px 10px',
            textAlign: 'center',
            borderRadius: '4px',
          }}
        >
          {params.value ? 'Active' : 'Inactive'}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="outlined" color="primary" onClick={() => handleEdit(params.row.id)} sx={{ mr: 1 }}>
            Edit
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];
  

  // Convert settings data into rows for DataGrid
  const rows = admobSettings.map((ad) => ({
    id: ad.id,
    adId: ad.adId,
    banner: ad.banner,
    main: ad.main,
    rewardads: ad.rewardads,
    rewardfrequency: ad.rewardfrequency,
    isActive: ad.isActive,
  }));

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
            Add New Admob Setting
          </Button>
        </Grid>
      </Grid>

      {/* DataGrid for Admob Settings List */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Admob Settings List</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      </Box>

      {/* Add or Edit Admob Setting Form Dialog */}
  {/* Add or Edit Admob Setting Form Dialog */}
<Dialog open={openForm} onClose={() => setOpenForm(false)}>
  <DialogTitle>{isEditing ? 'Edit Admob Setting' : 'Add New Admob Setting'}</DialogTitle>
  <DialogContent>
    <TextField
      label="Ad ID"
      name="adId"
      value={newAdmob.adId} // Bind to the adId field in the state
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Banner Ad ID"
      name="banner"
      value={newAdmob.banner} // Bind to the banner field in the state
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Main Ad ID"
      name="main"
      value={newAdmob.main} // Bind to the main field in the state
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Reward Ads ID"
      name="rewardads"
      value={newAdmob.rewardads} // Bind to the rewardads field in the state
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <TextField
      label="Reward Frequency"
      name="rewardfrequency"
      type="number"
      value={newAdmob.rewardfrequency} // Bind to the rewardfrequency field in the state
      onChange={handleChange}
      fullWidth
      sx={{ mb: 2 }}
    />
    <FormControlLabel
      control={
        <Checkbox
          name="isActive"
          checked={newAdmob.isActive} // Bind to the isActive field in the state
          onChange={handleChange}
        />
      }
      label="Active"
      sx={{ mb: 2 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenForm(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleSubmit} color="primary">
      {isEditing ? 'Update' : 'Add'} Admob Setting
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};

export default AdmobPage;
