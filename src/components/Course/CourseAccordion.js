import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Modal, TextField, Button } from '@mui/material';
import { ExpandMore, ExpandLess, Edit, Delete } from '@mui/icons-material';
import { decryptData } from '../Security/cryptoUtils';

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [openEditCourseModal, setOpenEditCourseModal] = useState(false);
  const [openEditSectionModal, setOpenEditSectionModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [oldCourseName, setOldCourseName] = useState('');
  const role = decryptData(localStorage.getItem("role"));  // Get role from localStorage
  const username = decryptData(localStorage.getItem("name"));  // Get role from localStorage

  // Fetch courses from the backend API
  useEffect(() => {
    axios.get('http://localhost:5000/courses')  // Replace with your actual API URL
      .then((response) => {
        const data = response.data;
        const courseList = Object.keys(data).map(courseKey => {
          const course = data[courseKey];
          return {
            name: course.name,
            writer: course.writer,
            date: course.date,
            duration: course.duration,
            rating: course.rating,
            description: course.description,
            courseSelected: course.courseSelected || {}
          };
        });
        setCourses(courseList);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const filteredCourses = role === 'admin' 
  ? courses 
  : courses.filter(course => 
      course.writer.replace(/\s+/g, '').toLowerCase() === username.replace(/\s+/g, '').toLowerCase()
  );
  // Handle course expansion and collapse
  const handleToggleCourse = (courseIndex) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseIndex]: !prev[courseIndex],
    }));
  };




  // Handle course edit modal open
const handleEditCourseOpen = (course) => {
  setCurrentCourse(course);
  setOldCourseName(course.name);  // Save the old course name
  setOpenEditCourseModal(true);
};

  // Handle course edit modal close
  const handleCloseEditCourseModal = () => {
    setOpenEditCourseModal(false);
    setCurrentCourse(null);
  };

  // Handle section edit modal open
  const handleEditSectionOpen = (course, sectionName) => {
    setCurrentCourse(course);
    setCurrentSection(sectionName);
    setOpenEditSectionModal(true);
  };

  // Handle section edit modal close
  const handleCloseEditSectionModal = () => {
    setOpenEditSectionModal(false);
    setCurrentSection(null);
    setCurrentCourse(null);
  };

  // Handle delete course
  const handleDeleteCourse = (courseName) => {
    // Make an API request to delete the course
    axios.delete(`http://localhost:5000/courses/${courseName}`)
      .then(() => {
        // Remove the deleted course from the local state
        setCourses((prevCourses) => prevCourses.filter(course => course.name !== courseName));
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
      });
  };

  // Handle delete section
  const handleDeleteSection = (courseName, sectionName) => {
    // Make an API request to delete the section
    axios.delete(`http://localhost:5000/courses/${courseName}/sections/${sectionName}`)
      .then(() => {
        // Remove the deleted section from the local state
        setCourses((prevCourses) => prevCourses.map(course =>
          course.name === courseName
            ? {
                ...course,
                courseSelected: Object.keys(course.courseSelected).reduce((acc, sectionKey) => {
                  if (sectionKey !== sectionName) {
                    acc[sectionKey] = course.courseSelected[sectionKey];
                  }
                  return acc;
                }, {})
              }
            : course
        ));
      })
      .catch((error) => {
        console.error('Error deleting section:', error);
      });
  };

  // Handle section expansion and collapse
  const handleToggleSection = (courseIndex, sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [`${courseIndex}-${sectionName}`]: !prev[`${courseIndex}-${sectionName}`],
    }));
  };

  // Handle course form submit
  const handleSubmitEditCourse = () => {
    // Wrap currentCourse inside courseDetails
    axios.put(`http://localhost:5000/courses/${oldCourseName}`, {
      courseDetails: currentCourse  // Wrapping currentCourse in courseDetails
    })
    .then(() => {
      // Update the course in the state
      setCourses((prevCourses) => prevCourses.map(course =>
        course.name === oldCourseName ? currentCourse : course
      ));
      handleCloseEditCourseModal();
    })
    .catch((error) => {
      console.error('Error updating course:', error);
    });
  };
  
  // Handle section form submit
  const handleSubmitEditSection = () => {
    axios.put(`http://localhost:5000/courses/${currentCourse.name}/sections/${currentSection}`, currentCourse.courseSelected[currentSection])
      .then(() => {
        // Update the section in the state
        setCourses((prevCourses) => prevCourses.map(course =>
          course.name === currentCourse.name
            ? {
                ...course,
                courseSelected: {
                  ...course.courseSelected,
                  [currentSection]: currentCourse.courseSelected[currentSection]
                }
              }
            : course
        ));
        handleCloseEditSectionModal();
      })
      .catch((error) => {
        console.error('Error updating section:', error);
      });
  };


  if (filteredCourses.length === 0) {
    return <Typography variant="h6" align="center" color="textSecondary">No courses available for your username.</Typography>;
  }
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, padding: 2 , mt:4}}>
      <Table sx={{ minWidth: 650 }} aria-label="course table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={tableHeaderStyle}>Course</TableCell>
            <TableCell align="center" sx={tableHeaderStyle}>Created by</TableCell>
            <TableCell align="center" sx={tableHeaderStyle}>Creation Date</TableCell>
            <TableCell align="center" sx={tableHeaderStyle}>Course Duration</TableCell>
            <TableCell align="center" sx={tableHeaderStyle}>Name</TableCell>
            <TableCell align="center" sx={tableHeaderStyle}>Rating</TableCell>
            <TableCell align="center" sx={tableHeaderStyle}>Total Sections</TableCell>
            <TableCell align="center" sx={tableHeaderStyle}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCourses.map((course, courseIndex) => (
            
            <React.Fragment key={courseIndex}>
              {/* Course Row */}
              <TableRow>
                <TableCell align="center" sx={tableCellStyle}>{course.name}</TableCell>
                <TableCell align="center" sx={tableCellStyle}>{course.writer}</TableCell>
                <TableCell align="center" sx={tableCellStyle}>{course.date}</TableCell>
                <TableCell align="center" sx={tableCellStyle}>{course.duration}</TableCell>
                <TableCell align="center" sx={tableCellStyle}>{course.name}</TableCell>
                <TableCell align="center" sx={tableCellStyle}>{course.rating}</TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  {Object.keys(course.courseSelected).length}
                </TableCell>
                <TableCell align="center" sx={tableCellStyle}>
                  <IconButton onClick={() => handleToggleCourse(courseIndex)} sx={{ margin: '5px' }}>
                    {expandedCourses[courseIndex] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  {role !== "intern" && (
                    <>
                  <IconButton onClick={() => handleEditCourseOpen(course)} sx={{ margin: '5px' }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCourse(course.name)} sx={{ margin: '5px' }}>
                    <Delete />
                  </IconButton>
                  </>
                  )}
                </TableCell>
              </TableRow>

              {/* Course Details (Collapsed or Expanded) */}
              <Collapse in={expandedCourses[courseIndex]}>
                {Object.keys(course.courseSelected).map((sectionName, sectionIndex) => {
                  const section = course.courseSelected[sectionName];
                  return (
                    <React.Fragment key={sectionIndex}>
                      <TableRow>
                        <TableCell colSpan={7} sx={tableCellStyle}>
                          <Table sx={{ minWidth: 650 }} aria-label="section table">
                         
                         
                            <TableHead>
                              <TableRow>
                                <TableCell align="center" sx={tableHeaderStyle}>Section Name</TableCell>
                                <TableCell align="center" sx={tableHeaderStyle}>Instructor Name</TableCell>
                                <TableCell align="center" sx={tableHeaderStyle}>Total Lessons</TableCell>
                                <TableCell align="center" sx={tableHeaderStyle}>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell align="center" sx={tableCellStyle}>{sectionName}</TableCell>
                                <TableCell align="center" sx={tableCellStyle}>{section.instructor || 'No Instructor'}</TableCell>
                                <TableCell align="center" sx={tableCellStyle}>{section.lessons ? section.lessons.length : 0}</TableCell>
                                <TableCell align="center" sx={tableCellStyle}>
                                  <IconButton onClick={() => handleToggleSection(courseIndex, sectionName)} sx={{ margin: '5px' }}>
                                    {expandedSections[`${courseIndex}-${sectionName}`] ? <ExpandLess /> : <ExpandMore />}
                                  </IconButton>
                                  {role !== "intern" && (
                                    <>
                                  <IconButton onClick={() => handleEditSectionOpen(course, sectionName)} sx={{ margin: '5px' }}>
                                    <Edit />
                                  </IconButton>
                                  </>
                                  )}
                                  <IconButton onClick={() => handleDeleteSection(course.name, sectionName)} sx={{ margin: '5px' }}>
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          
                  
                          </Table>
                        </TableCell>
                      </TableRow>

                      {/* Section Lessons (Collapsed or Expanded) */}
                      <Collapse in={expandedSections[`${courseIndex}-${sectionName}`]}>
                        <TableRow>
                          <TableCell colSpan={7} sx={tableCellStyle}>
                            <LessonList lessons={section.lessons || []} />
                          </TableCell>
                        </TableRow>
                      </Collapse>
                    </React.Fragment>
                  );
                })}
              </Collapse>
            </React.Fragment>
          ))}
        </TableBody>



      </Table>

      {/* Edit Course Modal */}
      <Modal
        open={openEditCourseModal}
        onClose={handleCloseEditCourseModal}
        aria-labelledby="edit-course-modal-title"
        aria-describedby="edit-course-modal-description"
      >
        <div style={modalStyle}>
          <Typography variant="h6" gutterBottom>Edit Course</Typography>
          <TextField
            label="Course Name"
            value={currentCourse?.name || ''}
            onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Course Duration"
            value={currentCourse?.duration || ''}
            onChange={(e) => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Course Rating"
            value={currentCourse?.rating || ''}
            onChange={(e) => setCurrentCourse({ ...currentCourse, rating: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitEditCourse}
            style={{ marginTop: '10px' }}
          >
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Edit Section Modal */}
      <Modal
        open={openEditSectionModal}
        onClose={handleCloseEditSectionModal}
        aria-labelledby="edit-section-modal-title"
        aria-describedby="edit-section-modal-description"
      >
        <div style={modalStyle}>
          <Typography variant="h6" gutterBottom>Edit Section</Typography>
          <TextField
            label="Section Name"
            value={currentCourse?.courseSelected[currentSection]?.name || ''}
            onChange={(e) => setCurrentCourse({
              ...currentCourse,
              courseSelected: {
                ...currentCourse.courseSelected,
                [currentSection]: {
                  ...currentCourse.courseSelected[currentSection],
                  name: e.target.value
                }
              }
            })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Section Duration"
            value={currentCourse?.courseSelected[currentSection]?.duration || ''}
            onChange={(e) => setCurrentCourse({
              ...currentCourse,
              courseSelected: {
                ...currentCourse.courseSelected,
                [currentSection]: {
                  ...currentCourse.courseSelected[currentSection],
                  duration: e.target.value
                }
              }
            })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Instructor Name"
            value={currentCourse?.courseSelected[currentSection]?.instructor || ''}
            onChange={(e) => setCurrentCourse({
              ...currentCourse,
              courseSelected: {
                ...currentCourse.courseSelected,
                [currentSection]: {
                  ...currentCourse.courseSelected[currentSection],
                  instructor: e.target.value
                }
              }
            })}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitEditSection}
            style={{ marginTop: '10px' }}
          >
            Save Changes
          </Button>
        </div>
      </Modal>
    </TableContainer>
  );
};

const LessonList = ({ lessons }) => {
  if (!lessons || lessons.length === 0) {
    return <Typography variant="body2" color="textSecondary">No lessons available for this section.</Typography>;
  }

  return (
    <Table sx={{ minWidth: 650 }} aria-label="lesson table">
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={tableHeaderStyle}>Lesson Title</TableCell>
          <TableCell align="center" sx={tableHeaderStyle}>Duration</TableCell>
          <TableCell align="center" sx={tableHeaderStyle}>Difficulty</TableCell>
          <TableCell align="center" sx={tableHeaderStyle}>Learned by</TableCell>
          <TableCell align="center" sx={tableHeaderStyle}>Video URL</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {lessons.map((lesson, lessonIndex) => (
          <TableRow key={lessonIndex}>
            <TableCell align="center" sx={tableCellStyle}>{lesson.title}</TableCell>
            <TableCell align="center" sx={tableCellStyle}>{lesson.duration}</TableCell>
            <TableCell align="center" sx={tableCellStyle}>{lesson.difficulty}</TableCell>
            <TableCell align="center" sx={tableCellStyle}>{lesson.learners}</TableCell>
            <TableCell align="center" sx={tableCellStyle}>
              <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Styling for table cells
const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  backgroundColor: '#1976d2',
  color: 'white',
  fontWeight: 'bold',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: 24,
};

export default CourseTable;
