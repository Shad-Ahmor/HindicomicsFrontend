import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, Container, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddSectionToCourse from './AddSectionToCourse';
import AddLesson from './AddLesson';
import { decryptData } from '../Security/cryptoUtils';
import CourseAccordion from './CourseAccordion';

const AddCourse = () => {
  const [courseDetails, setCourseDetails] = useState({
    name: '', 
    category: '',
    date: null,
    description: '',
    duration: '',
    image: '',
    rating: 0,
    writer: '',
    courseSelected: '', // Keep this to track selected sections later
  });
  
  const [userSubrole, setUserSubrole] = useState(""); // Store user's subrole

  useEffect(() => {
    const storedSubrole = localStorage.getItem("subrole");
    const decryptsubrole = decryptData(storedSubrole);
    setUserSubrole(decryptsubrole || ""); // If no subrole, set empty string
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a courseData object with courseName and courseDetails
    const courseData = {
      courseName: courseDetails.name, 
      courseDetails, 
    };

    try {
      // Send the course data to the backend
      const response = await axios.post('http://localhost:5000/courses/addcourse', courseData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Error adding course');
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* Conditionally render based on user subrole */}
        {userSubrole.split(",").map(role => role.trim()).includes("admin") ? (
          <Box sx={{ width: '100%', padding: 2 }}>
            <Typography variant="h4" gutterBottom align="center">
              Add New Course
            </Typography>
            
            {/* Course Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Course Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Course Name"
                    variant="outlined"
                    fullWidth
                    value={courseDetails.name}
                    onChange={(e) => setCourseDetails({ ...courseDetails, name: e.target.value })}
                    required
                  />
                </Grid>

                {/* Course Details */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Course Details
                  </Typography>
                </Grid>

                {/* Date Picker */}
                <Grid item xs={12} sm={6}>
                  <ReactDatePicker
                    selected={courseDetails.date}
                    onChange={(date) => setCourseDetails({ ...courseDetails, date })}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                    style={{
                      width: '100%',
                      height: '50px',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Grid>

                {/* Category Selection */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={courseDetails.category}
                      onChange={(e) => setCourseDetails({ ...courseDetails, category: e.target.value })}
                      label="Category"
                    >
                      <MenuItem value="ui_ux">UI/Ux Designer</MenuItem>
                      <MenuItem value="frontend">Frontend Developer</MenuItem>
                      <MenuItem value="backend">Backend Developer</MenuItem>
                      <MenuItem value="fullstack">Fullstack Developer</MenuItem>
                      <MenuItem value="webops">Web Operations</MenuItem>
                      <MenuItem value="tester">Tester</MenuItem>
                      <MenuItem value="smm">Social Media Marketing</MenuItem>
                      <MenuItem value="ccw">Content Creator and Writer</MenuItem>
                      <MenuItem value="acc">AI Character Creator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Description */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={courseDetails.description}
                    onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
                    required
                  />
                </Grid>

                {/* Duration */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={courseDetails.duration}
                    onChange={(e) => setCourseDetails({ ...courseDetails, duration: e.target.value })}
                    required
                  />
                </Grid>

                {/* Image URL */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Image URL"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={courseDetails.image}
                    onChange={(e) => setCourseDetails({ ...courseDetails, image: e.target.value })}
                    required
                  />
                </Grid>

                {/* Rating */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rating"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={courseDetails.rating}
                    onChange={(e) => setCourseDetails({ ...courseDetails, rating: e.target.value })}
                    required
                    inputProps={{ min: 0, max: 5 }}
                  />
                </Grid>

                {/* Writer */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Writer"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={courseDetails.writer}
                    onChange={(e) => setCourseDetails({ ...courseDetails, writer: e.target.value })}
                    required
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="primary" fullWidth type="submit">
                    Add Course
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">You do not have the necessary permissions to add courses.</Typography>
          </Box>
        )}
      </Container>

      {/* Additional Components */}
      <AddSectionToCourse courseDetails={courseDetails} />
      <AddLesson />
      <CourseAccordion />
    </Box>
  );
};

export default AddCourse;
