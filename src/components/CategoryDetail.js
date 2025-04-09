import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Make sure to import useParams here
import api from './api';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'; // Import MUI icons for left and right arrows
import '../styles/css/CategoryDetail.css'; // Ensure the CSS file is correctly imported

const CategoryDetail = () => {
  const { category } = useParams(); // Get category name from the URL
  const [images, setImages] = useState([]); // State to store fetched images
  const sliderRef = useRef(null); // Reference to the container for horizontal scrolling
  const navigate = useNavigate();

  // Fetch images based on the category
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found.');
          navigate('/login');
          return;
        }
        if (!token) {
          console.error('Authorization token is missing');
          return;
        }
        const response = await api.get(`/dashboard/category-details/${category}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Add token to the request headers
          },
        });
        console.log(response.data);  // Log the response to check structure
        setImages(response.data.categoryData); // Assuming the correct data structure is 'categoryData'
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [category]);

  // Function to scroll left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // Scroll 300px to the left
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Scroll 300px to the right
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Left Arrow Button */}
      <IconButton
        sx={{
          position: 'absolute',
          left: '0',
          zIndex: 10,
          backgroundColor: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Light shadow for better visibility

        }}
        onClick={scrollLeft}
      >
        <ChevronLeft />
      </IconButton>

      {/* Image Slider */}
      <div
        ref={sliderRef}
        style={{
          display: 'flex',
          overflowX: 'scroll',
          paddingBottom: '20px',
          scrollBehavior: 'smooth',
          maxWidth: '70rem',
          justifyContent: 'center', // Center the slider images

        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="zoom-card"
            style={{
              marginRight: '20px', // Space between images
              display: 'inline-block',
              textAlign: 'center',
              paddingBottom: '10px', // Ensure space below the image
              position: 'relative',
              width: '250px', // Fixed width for each image card

            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={image.imgurl}
                alt={image.filename}
                className="zoom-image"
                style={{
                  width: '2rem',
                  height: '70vh',
                  display: 'block',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  marginBottom: '10px',
                  transition: 'transform 0.3s ease-in-out', // Smooth transition for zoom effect
                }}
              />
              {/* Reflection Effect */}
              <div
                style={{
                  content: '""',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '50%',
                  backgroundImage: `url(${image.imgurl})`,
                  backgroundSize: 'cover',
                  transform: 'scaleY(-1)',
                  opacity: '0.3',
                  filter: 'blur(5px)',
                  borderRadius: '0 0 15px 15px',
                }}
              />
            </div>
            <Typography
              className="filename"
              variant="body2"
              sx={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                position: 'absolute',
                bottom: '10px', // Position filename at the bottom of the image
                left: '50%',
                transform: 'translateX(-50%)', // Center the text
              }}
            >
              {image.filename}
            </Typography>
          </div>
        ))}
      </div>

      {/* Right Arrow Button */}
      <IconButton
        sx={{
          position: 'absolute',
          right: '0',
          zIndex: 10,
          backgroundColor: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Light shadow for better visibility

        }}
        onClick={scrollRight}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default CategoryDetail;
