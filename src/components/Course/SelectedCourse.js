import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { MdAccessTime, MdBarChart, MdPeople, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { FaPlayCircle, FaRegPlayCircle } from 'react-icons/fa';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import axios from 'axios';
import './SelectedCourse.css';

const SelectedCourse = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null); // Holds the course data
  const [lessonCompletion, setLessonCompletion] = useState([]); // Tracks lesson completion
  const [currentSection, setCurrentSection] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("qa");

  // Fetch course data from API using axios
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${courseId}`);
        const data = response.data;

        console.log(data);  // Check the structure of the response

        if (data.courseSelected) {
          setCourse(data);
          const initialCompletion = Object.values(data.courseSelected).map(course => 
            course.lessons.map(() => false)  // Initially, no lessons are completed
          );
          setLessonCompletion(initialCompletion);

          // Fetch user progress for the course
          const userId = 1; // Replace this with the actual userId (could come from the auth context)
          fetchProgress(userId, courseId); // Fetch progress
        } else {
          console.error('courseSelected is not available');
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Fetch user progress
  const fetchProgress = async (userId, courseId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:5000/courses/${userId}/progress/${courseId}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Only token in the Authorization header
        }});
      const { completedLessons, progress } = response.data;
      setLessonCompletion(completedLessons);  // Update the state with lesson completion data
      setProgress(progress);  // Update the progress
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };
  
  // Save progress
  const saveProgress = async (userId, courseId, completedLessons, progress) => {
    const token = localStorage.getItem("token");
  
    try {
      await axios.put(
        `http://localhost:5000/courses/${userId}/progress/${courseId}`,
        {
          completedLessons,  // This is the body of the request
          progress           // This is also part of the body of the request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Correctly setting the token in the Authorization header
          },
        }
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  
  
  // Toggle section visibility
  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Get the details of the current lesson
  const getLessonDetails = () => {
    const section = Object.values(course?.courseSelected || {})[currentSection];
    const lesson = section?.lessons[currentLesson];
    return lesson ? `${section.title} - ${lesson.title}` : section?.title;
  };

  // Handle when a video ends (lesson completed)
  const handleVideoEnded = () => {
    const newLessonCompletion = [...lessonCompletion];
    newLessonCompletion[currentSection][currentLesson] = true;
    setLessonCompletion(newLessonCompletion);
    setVideoCompleted(true);

    // Save progress after video completion
    const userId = 1; // Replace with the actual userId
    const updatedProgress = calculateProgress();
    saveProgress(userId, courseId, newLessonCompletion, updatedProgress);
  };

  // Calculate course completion progress
  const calculateProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;

    Object.values(course?.courseSelected || {}).forEach((section, sectionIndex) => {
      section.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.videoUrl) {
          totalLessons++;
          if (lessonCompletion[sectionIndex][lessonIndex]) {
            completedLessons++;
          }
        }
      });
    });

    const progressPercentage = (completedLessons / totalLessons) * 100;
    return progressPercentage;
  };

  useEffect(() => {
    if (course) {
      setProgress(calculateProgress());
    }
  }, [lessonCompletion, course]);

  // Handle next video
  const handleNextVideo = () => {
    if (currentLesson < course.courseSelected[Object.keys(course.courseSelected)[currentSection]].lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      setVideoCompleted(false);
    } else if (currentSection < Object.keys(course.courseSelected).length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentLesson(0);
      setVideoCompleted(false);
    }
  };

  // Handle previous video
  const handlePreviousVideo = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      setVideoCompleted(false);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentLesson(course.courseSelected[Object.keys(course.courseSelected)[currentSection - 1]].lessons.length - 1);
      setVideoCompleted(false);
    }
  };

  // Handle lesson click
  const handleLessonClick = (lessonIndex, sectionIndex) => {
    if (lessonIndex > 0 && !lessonCompletion[sectionIndex][lessonIndex - 1]) {
      return;
    }
    setCurrentLesson(lessonIndex);
    setCurrentSection(sectionIndex);
    setVideoCompleted(false);
  };

  // Extract YouTube video ID from URL
  const getVideoId = (url) => {
    const match = url.match(/[?&]v=([^&#]*)/);
    return match ? match[1] : null;
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  const { name, instructor, description, image, rating, date, duration, courseSelected } = course;

  return (
    <div className="container">
      <div className="leftsidebar">
        <div className="progressContainer">
          <div className="progressBar">
            <div className="progressFill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progressText">{Math.round(progress)}% Complete</p>
        </div>

        <div className="header">
          <div className="videoContainer">
            {currentLesson !== null ? (
              <ReactPlayer
                url={courseSelected[Object.keys(courseSelected)[currentSection]]?.lessons[currentLesson]?.videoUrl}
                className="customVideoPlayer"
                playing={true}
                controls={true}
                onEnded={handleVideoEnded}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,  // Removes YouTube logo
                      rel: 0,  // Prevents showing related videos at the end
                      showinfo: 0,  // Hides video info (like title) before the video starts
                      controls: 1,  // Keeps controls visible
                      iv_load_policy: 3,  // Hides annotations
                      fs: 0,  // Disables fullscreen button (optional)
                      cc_load_policy: 0,  // Disables closed captions (optional)
                      disablekb: 1,  // Disables keyboard controls (optional)
                      enablejsapi: 1,  // Allows for API interactions (optional)
                      modestbranding: 1,  // Additional check for branding removal
                    },
                  },
                }}
              />
            ) : (
              <div className="courseImageFallback">No video available</div>
            )}
          </div>

          <div className="actionBar">
            <button
              className="actionButton"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              {isBookmarked ? (
                <IoBookmark size={24} color="#0077B5" />
              ) : (
                <IoBookmarkOutline size={24} color="#0077B5" />
              )}
            </button>

            <button
              className="continueButton"
              onClick={handlePreviousVideo}
            >
              <span className="previousButtonText">Previous Video</span>
            </button>

            {videoCompleted && (
              <button
                className="continueButton"
                onClick={handleNextVideo}
              >
                <span className="continueButtonText">Next Video</span>
              </button>
            )}
          </div>

          <div className="container">
            <div className="headerContent">
              <h2 className="courseTitle">{currentLesson !== null ? courseSelected[Object.keys(courseSelected)[currentSection]]?.lessons[currentLesson]?.title : ""}</h2>
              <p className="instructor">{instructor}</p>

              <div className="statsContainer">
                <div className="stat">
                  <MdAccessTime size={16} color="#666" />
                  <span className="statText">{currentLesson !== null ? courseSelected[Object.keys(courseSelected)[currentSection]]?.lessons[currentLesson]?.duration : ""}</span>
                </div>
                <div className="stat">
                  <MdBarChart size={16} color="#666" />
                  <span className="statText">{currentLesson !== null ? courseSelected[Object.keys(courseSelected)[currentSection]]?.lessons[currentLesson]?.difficulty : ""}</span>
                </div>
                <div className="stat">
                  <MdPeople size={16} color="#666" />
                  <span className="statText">{currentLesson !== null ? courseSelected[Object.keys(courseSelected)[currentSection]]?.lessons[currentLesson]?.learners : ""}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tabButton ${activeTab === "qa" ? "activeTab" : ""}`}
              onClick={() => setActiveTab("qa")}
            >
              Q&A
            </button>
            <button
              className={`tabButton ${activeTab === "notebook" ? "activeTab" : ""}`}
              onClick={() => setActiveTab("notebook")}
            >
              Notebook
            </button>
          </div>

          <div className="tabContent">
            {activeTab === "qa" ? (
              <div className="qaContent">
                <h4>Q&A Section</h4>
                <p>Here you can have your Q&A content...</p>
              </div>
            ) : (
              <div className="notebookContent">
                <h4>Notebook Section</h4>
                <p>Here you can have your Notebook content...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="courseslist">
        <div className="contentContainer">
          <h3 className="sectionTitle">{getLessonDetails()}</h3>

          {Object.keys(courseSelected).map((sectionTitle, sectionIndex) => (
            <div key={sectionIndex} className="section">
              <button
                className="sectionHeader"
                onClick={() => {
                  setCurrentSection(sectionIndex);
                  setCurrentLesson(0);
                  toggleSection(sectionIndex);
                }}
              >
                <div className="sectionHeaderLeft">
                  <MdAccessTime
                    size={24}
                    color="#666"
                    style={{
                      transform: expandedSection === sectionIndex ? 'rotate(90deg)' : '',
                    }}
                  />
                  <span className="sectionHeaderTitle">{sectionTitle}</span>
                </div>
                {expandedSection === sectionIndex ? (
                  <MdExpandLess size={24} color="rgb(163 163 163)" />
                ) : (
                  <MdExpandMore size={24} color="rgb(163 163 163)" />
                )}
              </button>

              {expandedSection === sectionIndex && (
                <div className="expandedSection">
                  <div className="lessonsList">
                    {courseSelected[sectionTitle]?.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lessonIndex}
                        className={`lessonItem ${currentLesson === lessonIndex ? 'activeLessonItem' : ''}`}
                        onClick={() => handleLessonClick(lessonIndex, sectionIndex)}
                        disabled={lessonIndex > 0 && !lessonCompletion[sectionIndex][lessonIndex - 1]}
                      >
                        <div className="lessonItemLeft">
                          {currentLesson === lessonIndex ? (
                            <FaPlayCircle size={20} color="#0077B5" />
                          ) : (
                            <FaRegPlayCircle size={20} color="#666" />
                          )}

                          <div className="lessonDetails">
                            <span className={`lessonTitle ${currentLesson === lessonIndex ? 'activeLessonTitle' : ''}`}>
                              {lesson.title}
                            </span>
                          </div>
                          <div className="lessonDuration">
                             (<span>{lesson.duration}</span>)
                          </div>
                        </div>

                        <img
                          src={`https://img.youtube.com/vi/${getVideoId(lesson.videoUrl)}/0.jpg`} 
                          alt="lesson-thumbnail"
                          className="lessonImage"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectedCourse;
