import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Paper, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Stack, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

const ModuleManagement = () => {
  const [moduleEndpoint, setModuleEndpoint] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const token = localStorage.getItem('token');

  // Fetch modules
  const fetchModules = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/rolemethod/get-modules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(Object.entries(res.data || {}));
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: 'Error fetching modules', severity: 'error' });
    }
  }, [token]);

  // Add module
  const handleAddModule = async () => {
    if (!moduleEndpoint || !moduleName) {
      setAlert({ open: true, message: 'Module Endpoint and Module Name are required', severity: 'warning' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/rolemethod/add-module',
        { moduleEndpoint, moduleName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert({ open: true, message: 'Module added successfully', severity: 'success' });
      setModuleEndpoint('');
      setModuleName('');
      setDescription('');
      fetchModules();
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: err.response?.data?.message || 'Error adding module', severity: 'error' });
    }
  };

  // Delete module
  const handleDeleteModule = async (endpoint) => {
    try {
      await axios.delete('http://localhost:5000/rolemethod/delete-module', {
        headers: { Authorization: `Bearer ${token}` },
        data: { moduleEndpoint: endpoint },
      });
      setAlert({ open: true, message: 'Module deleted successfully', severity: 'success' });
      fetchModules();
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: err.response?.data?.message || 'Error deleting module', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Module Management</Typography>

      {/* Add Module Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
          <TextField
            label="Module Endpoint"
            value={moduleEndpoint}
            onChange={(e) => setModuleEndpoint(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Module Name"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ flex: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddModule}>
            Add Module
          </Button>
        </Stack>
      </Paper>

      {/* Modules Table */}
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module Endpoint</TableCell>
              <TableCell>Module Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No modules found</TableCell>
              </TableRow>
            ) : (
              modules.map(([endpoint, data]) => (
                <TableRow key={endpoint}>
                  <TableCell>{endpoint}</TableCell>
                  <TableCell>{data.moduleName}</TableCell>
                  <TableCell>{data.description}</TableCell>
                  <TableCell align="center">
                    <Button color="error" variant="outlined" onClick={() => handleDeleteModule(endpoint)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Snackbar Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ModuleManagement;
