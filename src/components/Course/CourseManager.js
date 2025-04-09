import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', details: '' });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newSection, setNewSection] = useState({ sectionName: '', instructor: '' });

  useEffect(() => {
    axios.get('/api/courses')
      .then(response => {
        setCourses(Object.values(response.data)); // assuming response returns a map of courses
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const handleAddCourse = () => {
    axios.post('/api/addcourse', newCourse)
      .then(response => {
        alert('Course added successfully');
        setNewCourse({ name: '', details: '' }); // reset form
      })
      .catch(error => {
        console.error('Error adding course:', error);
      });
  };

  const handleAddSection = (courseId) => {
    axios.post(`/api/${courseId}/sections`, newSection)
      .then(response => {
        alert('Section added successfully');
        setNewSection({ sectionName: '', instructor: '' }); // reset form
      })
      .catch(error => {
        console.error('Error adding section:', error);
      });
  };

  return (
    <div>
      <h1>Course Manager</h1>

      <div>
        <h2>Add Course</h2>
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Course Details"
          value={newCourse.details}
          onChange={(e) => setNewCourse({ ...newCourse, details: e.target.value })}
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>

      <div>
        <h2>Available Courses</h2>
        {courses.map(course => (
          <div key={course.id}>
            <h3>{course.name}</h3>
            <button onClick={() => setSelectedCourse(course)}>View Sections</button>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div>
          <h3>Sections of {selectedCourse.name}</h3>
          <input
            type="text"
            placeholder="Section Name"
            value={newSection.sectionName}
            onChange={(e) => setNewSection({ ...newSection, sectionName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Instructor"
            value={newSection.instructor}
            onChange={(e) => setNewSection({ ...newSection, instructor: e.target.value })}
          />
          <button onClick={() => handleAddSection(selectedCourse.name)}>Add Section</button>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
