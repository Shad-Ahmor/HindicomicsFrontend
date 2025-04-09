import React, { useState, useEffect } from 'react';
import api from './api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState({ id: '', answer: '', email: '', suggestion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();

  // Fetch existing suggestions
  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
            const response = await api.get('/suggestions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSuggestion({ ...newSuggestion, [name]: value });
  };

  // Handle form submission (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

        let newId = newSuggestion.id || Date.now().toString(); // Generate an ID if missing

        const suggestionData = { 
            id: newId, 
            answer: newSuggestion.answer, 
            email: newSuggestion.email, 
            suggestion: newSuggestion.suggestion 
        };

        let response;
        if (isEditing) {
            response = await api.put(`/suggestions/${selectedSuggestionId}`, suggestionData, { headers });
        } else {
            response = await api.post('/suggestions/create', suggestionData, { headers });
        }

        if (response.status === 200 || response.status === 201) {
            fetchSuggestions();
            setNewSuggestion({ id: '', answer: '', email: '', suggestion: '' });
            setIsEditing(false);
            setOpenForm(false);
        }
    } catch (error) {
        console.error('Error submitting suggestion:', error);
    }
};


  // Handle edit
  const handleEdit = (id) => {
    const suggestion = suggestions.find((s) => s.id === id);
    if (suggestion) {
      setNewSuggestion({ ...suggestion });
      setIsEditing(true);
      setSelectedSuggestionId(id);
      setOpenForm(true);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
            await api.delete(`/suggestions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuggestions();
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  // Table columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'answer', headerName: 'Answer', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'suggestion', headerName: 'Suggestion', width: 250 },
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

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
            Add New Suggestion
          </Button>
        </Grid>
      </Grid>

      {/* Data Grid for Suggestions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Suggestions List</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={suggestions} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
        </div>
      </Box>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>{isEditing ? 'Edit Suggestion' : 'Add New Suggestion'}</DialogTitle>
        <DialogContent>
          <TextField label="Answer" name="answer" value={newSuggestion.answer} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" name="email" value={newSuggestion.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Suggestion" name="suggestion" value={newSuggestion.suggestion} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{isEditing ? 'Update' : 'Add'} Suggestion</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SuggestionsPage;
