import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';

const MethodManagement = () => {
  const [methodName, setMethodName] = useState('');
  const [description, setDescription] = useState('');
  const [methods, setMethods] = useState([]);

  const token = localStorage.getItem('token'); // Assuming token is stored after login

  // 🔹 Fetch all methods from backend
  const fetchMethods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/rolemethod/get-methods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        // Firebase returns an object, convert to array
        setMethods(Object.entries(res.data));
      }
    } catch (err) {
      console.error('Error fetching methods:', err);
    }
  };

  // 🔹 Add a new method
  const handleAddMethod = async () => {
    if (!methodName) return alert('Please enter method name');
    try {
      await axios.post(
        'http://localhost:5000/rolemethod/add-method',
        { methodName, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMethodName('');
      setDescription('');
      fetchMethods();
    } catch (err) {
      console.error('Error adding method:', err);
      alert(err.response?.data?.message || 'Error adding method');
    }
  };

  // 🔹 Delete method
  const handleDeleteMethod = async (name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await axios.delete('http://localhost:5000/rolemethod/delete-method', {
        headers: { Authorization: `Bearer ${token}` },
        data: { methodName: name },
      });
      fetchMethods();
    } catch (err) {
      console.error('Error deleting method:', err);
      alert(err.response?.data?.message || 'Error deleting method');
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        HTTP Method Management
      </Typography>

      {/* Form */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          label="Method Name (GET, POST...)"
          value={methodName}
          onChange={(e) => setMethodName(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mr: 2, width: '40%' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddMethod}>
          Add Method
        </Button>
      </Paper>

      {/* Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Method Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {methods.map(([name, data]) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{data.description}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleDeleteMethod(name)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default MethodManagement;
