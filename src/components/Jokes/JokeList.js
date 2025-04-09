import React, { useEffect, useState } from 'react';
import JokeForm from './JokeForm';
import { Button, Card, CardContent, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';  // Import icons
import api from '../api';
import { useNavigate } from 'react-router-dom';

const JokeList = () => {
  const [jokes, setJokes] = useState([]);
  const [selectedJoke, setSelectedJoke] = useState(null);
  const [token, setToken] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.error('Token not found.');
        navigate('/login');  // Redirect to login if no token exists
        return;
      }
    setToken(storedToken); // Correct way to update state with the token
    if (storedToken) {
      const fetchJokes = async () => {
        try {
          const response = await api.post(`/jokes`, {
            database: 'jokes',
          }, {
            headers: {
              Authorization: `Bearer ${token}`,  // Ensure the correct format
            },
          });
      
          setJokes(response.data);
        } catch (error) {
          console.error("Error fetching jokes:", error);
        }
      };
      fetchJokes();
    }
  }, [token]); // Token is a dependency now

  const handleEdit = (id) => {
    setSelectedJoke(id);
    setOpenDialog(true); // Open the form dialog for editing
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(
        `/jokes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setJokes(jokes.filter(joke => joke.id !== id));
    } catch (error) {
      console.error("Error deleting joke:", error);
    }
  };

  const handleSave = () => {
    setSelectedJoke(null);
    setOpenDialog(false); // Close the dialog
    // Reload jokes after saving
    const fetchJokes = async () => {
      const response = await api.get(`/jokes/create`);
      setJokes(response.data);
    };
    fetchJokes();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Jokes List</Typography>
      
      {/* Create Joke Button with icon */}
      <Button 
  variant="contained" 
  color="primary" 
  onClick={() => setOpenDialog(true)}  // Open dialog to create joke
  sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', width: '10dp' }}  // Set width to 10dp
>
  <AddIcon sx={{ marginRight: 1 }} />
  Create Joke
</Button>


      {/* Dialog for creating/editing joke */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedJoke ? "Edit Joke" : "Create Joke"}</DialogTitle>
        <DialogContent>
          <JokeForm jokeId={selectedJoke} onSave={handleSave} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Joke List */}
      <Grid container spacing={3}>
        {jokes && jokes.map((joke) => (
          <Grid item xs={12} sm={6} md={4} key={joke.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Typography variant="h6">{joke.category}</Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: joke.joke }}></Typography>
                <div>
                  {/* Edit and Delete buttons with icons and text */}
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleEdit(joke.id)} 
                    fullWidth
                    sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                  >
                    <EditIcon sx={{ marginRight: 1 }} />
                    Edit
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleDelete(joke.id)} 
                    fullWidth
                    sx={{ marginTop: 1, display: 'flex', justifyContent: 'center' }}
                  >
                    <DeleteIcon sx={{ marginRight: 1 }} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default JokeList;
