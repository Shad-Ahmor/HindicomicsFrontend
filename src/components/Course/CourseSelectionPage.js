import { useState, useEffect } from "react";
import axios from "axios";
import SpotlightCard from "./SpotlightCard"; // Your SpotlightCard component
import { useNavigate } from 'react-router-dom';
import { encryptData, decryptData } from '../Security/cryptoUtils.js'; // Import the library functions

const CourseSelectionPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://hindicomicsbackend.onrender.comcourses");
        console.log(res.data); // Add this line to check the response

        // Extract courseId (keys like 'QA', 'Backend', etc.) and combine it with course details
        const coursesArray = Object.entries(res.data).map(([courseId, courseDetails]) => ({
          id: courseId, // The dynamic courseId (like 'QA')
          ...courseDetails
        }));

        setCourses(coursesArray); // Set the courses with dynamic courseId
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseSelection = async (courseId) => {
    const userId = decryptData(localStorage.getItem("uid"));
    if (!userId) {
      console.error("User ID is not defined");
      return;
    }

    try {
      // Send both userId and courseId to the backend
      const res = await axios.post("https://hindicomicsbackend.onrender.comcourses/select", { userId, courseId });
      console.log(res.data); // Log success message from backend
      setSelectedCourse(courseId);
      navigate(`/course/${courseId}`); // Navigate to the course page dynamically

    } catch (error) {
      console.error("Error selecting course", error);
    }
  };

  return (
    <div>
      <h1>Select a Course</h1>
      <div className="course-cards">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map((course, index) => (
         

            <SpotlightCard
              key={index} // Use 'index' as the key here or use a unique ID if available
              className="course-card"
              spotlightColor="rgba(0, 229, 255, 0.2)"
             
            >   <div  onClick={() => handleCourseSelection(course.id)}>
              <h3 >{course.name}</h3> {/* Use course.id */}
              <p>{course.description}</p> </div>
            </SpotlightCard>
           
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default CourseSelectionPage;
