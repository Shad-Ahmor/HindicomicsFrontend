import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CoursePage = () => {
  const { courseId } = useParams(); // Retrieve courseId from the URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/courses/${courseId}`); // API call to get course details
        setCourse(res.data); // Set course details in state
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };

    fetchCourse();
  }, [courseId]); // Runs whenever courseId changes

  if (!course) return <div>Loading...</div>; // Show loading state while the course is being fetched

  return (
    <div>
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <p><strong>Duration:</strong> {course.duration}</p>
      {/* Add more details as necessary */}
    </div>
  );
};

export default CoursePage;
