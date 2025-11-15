import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
} from '@mui/material';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [points, setPoints] = useState('');
  const [username, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [roleOptions, setRoleOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [orgTree, setOrgTree] = useState([]);

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
  const [selectedManager, setSelectedManager] = useState('');

  // 🔹 Fetch dropdown data
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const [rolesRes, orgRes, managerRes] = await Promise.all([
          axios.get('http://localhost:5000/rolemethod/get-roles', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/rolemethod/organisation', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/auth/getManagers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRoleOptions(rolesRes.data || []);
        setOrgTree(orgRes.data.data || []);
        setManagerOptions(managerRes.data.managers || managerRes.data || []);
      } catch (err) {
        console.error('❌ Error fetching dropdown data:', err);
      }
    };

    fetchData();
  }, []);

  // 🔹 Flatten org tree for dropdown
  const flattenTree = (nodes, prefix = '') => {
    if (!Array.isArray(nodes)) return [];
    return nodes.flatMap((node) => {
      const label = prefix ? `${prefix} › ${node.name}` : node.name;
      const type = node.type ? `(${node.type})` : '';
      return [
        { id: node.id, label: `${label} ${type}` },
        ...(node.children ? flattenTree(node.children, label) : []),
      ];
    });
  };

  const flattenedOptions = flattenTree(orgTree);

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      setOpenSnackbar(true);
      return;
    }

    const userData = {
      email,
      password,
      role: selectedRole || 'user',
      points: points || 0,
      username,
      organisationUnit: selectedOrgUnit, // final selected org node ID
      manager: selectedManager || null,
      imageUrl: imageUrl || '',
    };

    try {
      const response = await axios.post('http://localhost:5000/auth/createuser', userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      setMessage(`User created successfully. Welcome, ${response.data.user.email}!`);
      setOpenSnackbar(true);
    } catch (err) {
      setError('Error creating user: ' + (err.response ? err.response.data.message : err.message));
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create User
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 500 }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Autocomplete
          options={roleOptions}
          getOptionLabel={(option) => option}
          value={selectedRole}
          onChange={(e, newValue) => setSelectedRole(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Role" variant="outlined" margin="normal" fullWidth required />
          )}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Autocomplete
          options={flattenedOptions}
          getOptionLabel={(option) => option.label}
          value={flattenedOptions.find((o) => o.id === selectedOrgUnit) || null}
          onChange={(e, newValue) => setSelectedOrgUnit(newValue?.id || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Organisation / Department / Team"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          )}
        />

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="manager-label">Manager (Optional)</InputLabel>
          <Select
            labelId="manager-label"
            value={selectedManager || ''}
            onChange={(e) => setSelectedManager(e.target.value)}
            label="Manager (Optional)"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {managerOptions.map((m) => (
              <MenuItem key={m.uid} value={m.uid}>
                {m.name} ({m.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Points (Optional)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />

        <TextField
          label="Image URL (Optional)"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Create Account
        </Button>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateUser;
