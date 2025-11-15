import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, IconButton, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const AddLesson = () => {
  const [courses, setCourses] = useState([]); // State to store courses
  const [sections, setSections] = useState([]); // State to store sections for the selected course
  const [selectedCourse, setSelectedCourse] = useState(''); // Selected course
  const [selectedSection, setSelectedSection] = useState(''); // Selected section
  const [formData, setFormData] = useState([]); // Form data state to handle lessons
  const [newCourse, setNewCourse] = useState(''); // State for custom course
  const [newSection, setNewSection] = useState(''); // State for custom section

  // Fetch courses from the backend when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/courses')
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

  // Fetch sections for a specific course when a course is selected
  useEffect(() => {
    if (selectedCourse && selectedCourse !== 'custom') {
      // Fetch sections for the selected course
      axios
        .get(`http://localhost:5000/courses/${selectedCourse}/sections`)
        .then((response) => {
          if (response.data) {
            setSections(response.data); // Store sections data for the selected course
          } else {
            setSections([]); // Set empty array if no sections are returned
          }
        })
        .catch((error) => {
          console.error('Error fetching sections:', error);
        });
    } else {
      setSections([]); // Clear sections if custom course is selected
    }
  }, [selectedCourse]);

  // Handle course change
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedSection(''); // Reset section when course is changed
    setNewCourse(''); // Reset custom course value
  };

  // Handle section change
  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
    setNewSection(''); // Reset custom section value
  };

  // Handle lesson data change
  const handleLessonDataChange = (e, lessonIndex) => {
    const { name, value } = e.target;
    const updatedData = [...formData];
    updatedData[lessonIndex][name] = value;
    setFormData(updatedData);
  };

  // Add a new lesson
  const addLesson = () => {
    setFormData([
      ...formData,
      {
        title: '',
        duration: '',
        videoUrl: '',
        learners: '',
        difficulty: ''
      }
    ]);
  };

  // Remove a lesson
  const removeLesson = (lessonIndex) => {
    const updatedData = formData.filter((_, index) => index !== lessonIndex);
    setFormData(updatedData);
  };

  // Submit the form to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the payload to send to the backend
      const lessonsToSubmit = formData.map((lesson) => ({
        title: lesson.title || undefined,
        duration: lesson.duration || undefined,
        videoUrl: lesson.videoUrl || undefined,
        learners: lesson.learners || undefined,
        difficulty: lesson.difficulty || undefined
      })).filter(lesson => Object.values(lesson).some(value => value !== undefined)); // Filter out lessons with empty fields

      const coursePayload = {
        courses: [{
          courseSelected: {
            [selectedSection]: { lessons: lessonsToSubmit }
          }
        }],
        selectedCourseName: selectedCourse === 'custom' ? newCourse : selectedCourse
      };

      // Send the lessons to the backend
      await axios.post('http://localhost:5000/courses/addlesson', coursePayload);

      alert('Lessons added successfully!');
      setFormData([]); // Clear the form after submission
    } catch (error) {
      console.error('Error adding lessons:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Lessons to Course
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Course Selection */}
        <FormControl fullWidth required variant="outlined" sx={{ marginBottom: 2 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            label="Course"
            name="course"
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
            <MenuItem value="custom">Custom Course</MenuItem>
          </Select>
        </FormControl>

        {/* Custom Course Input */}
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

        {/* Section Selection */}
        {selectedCourse && (
          <FormControl fullWidth required variant="outlined" sx={{ marginBottom: 2 }}>
            <InputLabel>Section</InputLabel>
            <Select
              value={selectedSection}
              onChange={handleSectionChange}
              label="Section"
              name="section"
            >
              {Object.keys(sections).map((sectionName) => (
                <MenuItem key={sectionName} value={sectionName}>
                  {sectionName}
                </MenuItem>
              ))}
              <MenuItem value="custom">Custom Section</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Custom Section Input */}
        {selectedSection === 'custom' && (
          <TextField
            label="Custom Section Name"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
        )}

        {/* Render Lessons */}
        <Box sx={{ marginTop: 2 }}>
          <Button
            onClick={addLesson}
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            sx={{ marginBottom: 2 }}
          >
            Add Lesson
          </Button>

          {/* Render each lesson */}
          {formData.map((lesson, lessonIndex) => (
            <Box key={lessonIndex} sx={{ marginBottom: 2 }}>
              <Typography variant="h6">Lesson {lessonIndex + 1}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Lesson Title"
                    name="title"
                    value={lesson.title}
                    onChange={(e) => handleLessonDataChange(e, lessonIndex)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Duration"
                    name="duration"
                    value={lesson.duration}
                    onChange={(e) => handleLessonDataChange(e, lessonIndex)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Video URL"
                    name="videoUrl"
                    value={lesson.videoUrl}
                    onChange={(e) => handleLessonDataChange(e, lessonIndex)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Number of Learners"
                    name="learners"
                    value={lesson.learners}
                    onChange={(e) => handleLessonDataChange(e, lessonIndex)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Difficulty"
                    name="difficulty"
                    value={lesson.difficulty}
                    onChange={(e) => handleLessonDataChange(e, lessonIndex)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {/* Remove Lesson Button */}
              <IconButton
                onClick={() => removeLesson(lessonIndex)}
                sx={{ color: 'red', marginTop: 1 }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* Submit Button */}
        <Button type="submit" variant="contained" sx={{ marginTop: 4 }}>
          Submit Lessons
        </Button>
      </form>
    </Container>
  );
};

export default AddLesson;
