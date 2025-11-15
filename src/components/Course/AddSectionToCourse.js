import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, IconButton, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const AddSectionToCourse = () => {
  const [courses, setCourses] = useState([]); // State to store courses
  const [sections, setSections] = useState([]); // State to store sections for the selected course
  const [selectedCourse, setSelectedCourse] = useState(''); // Selected course
  const [newCourse, setNewCourse] = useState(''); // State for custom course
  const [newSection, setNewSection] = useState(''); // State for custom section
  const [instructor, setInstructor] = useState(''); // State for instructor

  // Fetch courses from the backend when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/courses') // Adjust the URL to your API
      .then((response) => {
        const fetchedCourses = Object.keys(response.data).map((key) => ({
          id: key, // key is the course name
          name: response.data[key].name, // name of the course
        }));
        setCourses(fetchedCourses); // Set the courses in state
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  // Handle course change
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setNewCourse(''); // Reset custom course value
  };

  // Handle Add Section
  const addSection = async () => {
    if (!instructor || !newSection) {
      alert('Please provide both section name and instructor');
      return;
    }

    try {
      const sectionData = {
        sectionName: newSection,
        instructor, // Pass instructor value to the backend
      };

      // Send the new section to the backend, using the course name as part of the URL
      await axios.post(`http://localhost:5000/courses/${selectedCourse}/sections`, sectionData);
      alert('Section added successfully!');
      setNewSection(''); // Reset new section field
      setInstructor(''); // Reset instructor field
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  // Handle delete section
  const deleteSection = (sectionName) => {
    const updatedSections = sections.filter((section) => section !== sectionName);
    setSections(updatedSections);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Section to Course
      </Typography>

      <form>
        {/* Course Selection */}
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Course Name"
            value={selectedCourse}
            onChange={handleCourseChange}
            fullWidth
            variant="outlined"
            select
            SelectProps={{ native: true }}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </TextField>
        </div>

        {/* Custom Course Input (Optional) */}
        {selectedCourse === 'custom' && (
          <TextField
            label="Custom Course Name"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
        )}

        {/* Custom Section Input */}
        <TextField
          label="Add Custom Section"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        {/* Instructor Input */}
        <TextField
          label="Instructor"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        {/* Add Section Button */}
        <Button
          onClick={addSection}
          startIcon={<AddCircleOutlineIcon />}
          variant="contained"
          sx={{ marginBottom: 2 }}
        >
          Add Section
        </Button>
      </form>

      {/* Display Sections as List */}
      <div style={{ marginBottom: '16px' }}>
        {selectedCourse && sections.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Sections:
            </Typography>
            <List>
              {sections.map((section, index) => (
                <ListItem key={index} secondaryAction={
                  <IconButton edge="end" onClick={() => deleteSection(section)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                }>
                  <ListItemText primary={section} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </div>
    </Container>
  );
};

export default AddSectionToCourse;
