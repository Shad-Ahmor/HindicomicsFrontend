import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';

const JokeForm = ({ jokeId, onSave }) => {
  const [category, setCategory] = useState('');
  const [joke, setJoke] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (jokeId) {
      const fetchJoke = async () => {
        try {
          const response = await api.get(`https://hindicomicsbackend.onrender.comjokes/${jokeId}`);
          const { category, joke, likes, dislikes } = response.data;
          setCategory(category);
          setJoke(joke);
          setLikes(likes);
          setDislikes(dislikes);
        } catch (error) {
          console.error("Error fetching joke:", error);
        }
      };
      fetchJoke();
    }
  }, [jokeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jokeData = { category, joke, likes, dislikes };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found.');
      navigate('/');  // Redirect to login if no token exists
      return;
    }
    try {
      if (jokeId) {
        // Edit existing joke
        const response = await api.put(
          `https://hindicomicsbackend.onrender.comjokes/${jokeId}`,
          jokeData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          onSave();
        }
      } else {
        // Add new joke
        const response = await api.post(
          `https://hindicomicsbackend.onrender.comjokes/create`,
          jokeData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 201) {
          onSave();
        }
      }
    } catch (error) {
      console.error("Error saving joke:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">{jokeId ? 'Edit Joke' : 'Create Joke'}</Typography>

      <TextField
        label="Category"
        variant="outlined"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
      />

      <TextField
        label="Joke"
        variant="outlined"
        multiline
        rows={4}
        value={joke}
        onChange={(e) => setJoke(e.target.value)}
        placeholder="Use '**' for bold text, '\\n' for new line"
        fullWidth
      />

      <TextField
        label="Likes"
        variant="outlined"
        type="number"
        value={likes}
        onChange={(e) => setLikes(Number(e.target.value))}
        fullWidth
      />

      <TextField
        label="Dislikes"
        variant="outlined"
        type="number"
        value={dislikes}
        onChange={(e) => setDislikes(Number(e.target.value))}
        fullWidth
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={() => onSave()}>Cancel</Button>
        <Button variant="contained" color="primary" type="submit">Save Joke</Button>
      </Box>
    </Box>
  );
};

export default JokeForm;
