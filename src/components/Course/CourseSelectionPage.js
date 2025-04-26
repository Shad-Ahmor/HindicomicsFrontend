import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Button, Grid, Box, Rating, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { encryptData, decryptData } from "../Security/cryptoUtils.js"; // Import the library functions
import { LockPerson } from "@mui/icons-material";
import ShineBorder from "../Main/ShineBorder.js";

const CourseSelectionPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("none"); // Sort by: 'none', 'rating', 'date'
  const [sortOrder, setSortOrder] = useState("desc"); // Ascending or Descending order
  const [filterBy, setFilterBy] = useState("all"); // Filter by category
  const [filterByRating, setFilterByRating] = useState(0); // Filter by rating
  const [userSubrole, setUserSubrole] = useState(""); // Store user's subrole
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://hindicomicsbackend.onrender.com/courses");
        console.log(res.data); // Add this line to check the response

        // Extract courseId (keys like 'QA', 'Backend', etc.) and combine it with course details
        const coursesArray = Object.entries(res.data).map(([courseId, courseDetails]) => ({
          id: courseId, // The dynamic courseId (like 'QA')
          ...courseDetails
        }));

        setCourses(coursesArray); // Set the courses with dynamic courseId
        setFilteredCourses(coursesArray); // Initialize filtered courses
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    fetchCourses();
    const storedSubrole = localStorage.getItem("subrole");
    const decryptsubrole = decryptData(storedSubrole);
    setUserSubrole(decryptsubrole || ""); // If no subrole, set empty string
  }, []);

  // Function to handle course selection
  const handleCourseSelection = async (courseId, courseCategory) => {
    const userId = decryptData(localStorage.getItem("uid"));
    if (!userId) {
      console.error("User ID is not defined");
      return;
    }

    const subrolesArray = userSubrole.split(",").map(role => role.trim());
    if (subrolesArray.includes("admin") || subrolesArray.includes(courseCategory)) {
      try {
      // Send both userId and courseId to the backend
      const res = await axios.post("https://hindicomicsbackend.onrender.com/courses/select", { userId, courseId });
      console.log(res.data); // Log success message from backend
      setSelectedCourse(courseId);
      navigate(`/course/${courseId}`); // Navigate to the course page dynamically
    } catch (error) {
      console.error("Error selecting course", error);
    }
  } else {
    console.log("Access Denied: User's subrole does not match course category");
    // You can show a message or a lock icon here instead of navigation
  }
  };

  // Function to handle search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to apply filters and sorting to the courses
  const applyFiltersAndSort = () => {
    let filtered = [...courses];
  
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Filter by category (filterBy)
    if (filterBy !== "all") {
      filtered = filtered.filter((course) => course.category === filterBy);
    }
  
    // Filter by rating (filterByRating)
    if (filterByRating > 0) {
      filtered = filtered.filter((course) => course.rating >= filterByRating);
    }
  
    // Sort by selected criterion
    if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => (sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating));
    } else if (sortBy === "date") {
      filtered = filtered.sort((a, b) => (sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)));
    }
  
    setFilteredCourses(filtered);
  };
  

  // Function to reset filters and sorting
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("none");
    setSortOrder("desc");
    setFilterBy("all");
    setFilterByRating(0);
    setFilteredCourses(courses); // Reset the courses to the original list
  };

  // Function to generate a random color
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // useEffect to reapply filters and sorting when any relevant state changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchQuery, sortBy, filterBy, filterByRating, sortOrder, courses]);

  return (
    <div>
      {/* Search Bar */}
      <ShineBorder>
       <Card 
            className="transition-all duration-300 hover:scale-105"
            sx={{
             pt:2,
             pb:0,
                        pr:2,
                        pl:2,
                        height:'100px',

              border: '1px solid transparent',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '5px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
              '&:hover': { boxShadow: 2 }
            }}
          >
      <Box sx={{  display: "flex", justifyContent:"flex-start" }}>
        <TextField
          label="Search Courses"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: "50%" }}
        />
    
        <FormControl sx={{ margin: "0px 20px", width: "10%" }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ marginRight: 2, width: "10%" }}>
          <InputLabel>Sort Order</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort Order"
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </Select>
        </FormControl>


        <FormControl sx={{ marginRight: 2, width: "10%" }}>
  <InputLabel>Filter By Rating</InputLabel>
  <Select
    value={filterByRating}
    onChange={(e) => setFilterByRating(e.target.value)}
    label="Filter By Rating"
  >
    <MenuItem value={0}>All Ratings</MenuItem>
    <MenuItem value={1}>1 Star & above</MenuItem>
    <MenuItem value={2}>2 Stars & above</MenuItem>
    <MenuItem value={3}>3 Stars & above</MenuItem>
    <MenuItem value={4}>4 Stars & above</MenuItem>
    <MenuItem value={5}>5 Stars</MenuItem>
  </Select>
</FormControl>


        {/* Reset Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetFilters}
          sx={{ alignSelf: "center", width: "8%", height:"50px" }}
        >
          Reset
        </Button>
      </Box>
      </Card>
      </ShineBorder>

      <Grid container spacing={1} sx={{display: "flex", justifyContent:"flex-start"}}>
        {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
            <ShineBorder>
       <Card
            className="transition-all duration-300 hover:scale-105"
            sx={{
       
              border: '1px solid transparent',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '10px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
              '&:hover': { boxShadow: 2 }
            }}
          >
             
                <CardMedia
                  component="img"
                  alt={course.name}
                  height="200"
                  image={course.image || "https://via.placeholder.com/300"} // Placeholder image if course image is not available
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{fontSize:'1rem'}} gutterBottom>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {course.description}
                  </Typography>

                  {/* Writer Section */}
                  <Box sx={{ margin: "20px 0px" }}>
                    <Typography variant="body2" color="textSecondary">
                     <b> Instructor :</b> {course.writer || "N/A"}
                    </Typography>
                  </Box>

                  {/* Random Colorful Divider Before Rating */}
                  <Box
                    sx={{
                      height: "5px",
                      background: generateRandomColor(), // Apply random color
                      margin: "5px 0"
                    }}
                  ></Box>
            
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
  {userSubrole.split(",").map(role => role.trim()).includes("admin") || 
                   userSubrole.split(",").map(role => role.trim()).includes(course.category) ? (
                  
                                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCourseSelection(course.id, course.category)}
                    sx={{ width: "95%" }}
                  >
                    Enroll Now
                  </Button>
                ) : (
                  <Button
      variant="contained"
      color="primary"
      startIcon={<LockPerson />}  // Add the lock icon to the button
      disabled // Disable the button if the user can't access the course
      sx={{ width: "95%" }}
    >
      Enroll Now
    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', margin:'1.5rem'}}>

{/* Star Rating Section */}
<Box >
  <Rating name="course-rating" value={course.rating || 0} precision={0.5} readOnly />
</Box>

{/* Date Section */}
<Box >
  <Typography variant="body2" color="textSecondary">
{course.date || "N/A"}
  </Typography>
</Box>
</Box>
              </Card>
              </ShineBorder>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No courses available
          </Typography>
        )}
      </Grid>
     
    </div>
  );
};

export default CourseSelectionPage;
