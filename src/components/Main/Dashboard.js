import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, Typography, Box, Grid } from '@mui/material'; // For displaying the counts and layout
import { styled } from '@mui/system'; // For creating the Neomorphism effect
import { FaBook, FaRegFileAlt, FaClipboardList, FaUsers, FaUserCog, FaUserAlt } from 'react-icons/fa'; // Icons
import { useNavigate } from 'react-router-dom'; // For navigation

// Google Charts imports
import { Chart } from 'react-google-charts';

// Neomorphism Effect Style
const NeomorphicCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #e0e0e0, #ffffff)',
  boxShadow: '8px 8px 15px #d1d1d1, -8px -8px 15px #ffffff',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 180,
  height: '300px', // Set a fixed height
  overflow: 'hidden', // Prevent the graph from overflowing
}));

const Dashboard = () => {
  const [categoryCounts, setCategoryCounts] = useState({
    Btech: 0,
    HindiComics: 0,
    HindiBooks: 0,
    HindiDubbed: 0,
    HinduBooks: 0,
    IslamicBooks: 0,
  });

  const [roleCounts, setRoleCounts] = useState({
    user: 0,
    admin: 0,
    editor: 0,
  });
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fetch category counts from the API
    const fetchCategoryCounts = async () => {
      try {
        const token = localStorage.getItem('token');  // Assuming you stored the token in localStorage
        // If token is not found, handle accordingly (maybe redirect or show an error)
        if (!token) {
          console.error('Token not found');
          return;
        }
        const response = await api.get('/dashboard/role-counts', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });
        setCategoryCounts(response.data.categoriesCount);
        setRoleCounts(response.data.roleCounts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []); // Runs only once when the component mounts

  // Data for 3D Pie Chart (Google)
  const chartData = [
    ['Role', 'Count'],
    ['Users', roleCounts.user],
    ['Admins', roleCounts.admin],
    ['Editors', roleCounts.editor],
  ];
  const catchartData = [
    ['Category', 'Count'],
    ['Btech', categoryCounts.Btech],
    ['HindiComics', categoryCounts.HindiComics],
    ['HindiBooks', categoryCounts.HindiBooks],
    ['HindiDubbed', categoryCounts.HindiDubbed],
    ['HinduBooks', categoryCounts.HinduBooks],
    ['IslamicBooks', categoryCounts.IslamicBooks],
  ];

  // Chart options for the Google 3D Pie Chart
  const options = {
    title: 'Role Distribution',
    is3D: true,
    pieSliceText: 'label',  // Display labels on the slices
    slices: {
      0: { offset: 0.1 }, // Make the first slice (Users) pop out a little
    },
    pieStartAngle: 100,
    legend: {
      position: 'right', // Place the legend on the right side of the chart
      alignment: 'center',
      textStyle: {
        color: '#233238',
        fontSize: 14,
      },
    },
    colors: ['#4caf50', '#ff5722', '#00bcd4'],
  };

  const catoptions = {
    title: 'Category Distribution',
    is3D: true,
    pieSliceText: 'label',  // Display labels on the slices
    slices: {
      0: { offset: 0.1 }, // Make the first slice (Users) pop out a little
    },
    pieStartAngle: 100,
    legend: {
      position: 'right', // Place the legend on the right side of the chart
      alignment: 'center',
      textStyle: {
        color: '#233238',
        fontSize: 14,
      },
    },
    colors: ['#4caf50', '#ff5722', '#00bcd4'],
  };

  // Handle card click to navigate to detail view page
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`); // Navigate to category detail page
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* 3D Pie Chart Section */}
      <Grid container spacing={3} sx={{ marginBottom: 5 }}>
        <Grid item xs={12} md={8} lg={6}>
          <NeomorphicCard>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Role Distribution (3D Pie Chart)
            </Typography>
            <Chart
              chartType="PieChart"
              data={chartData}
              options={options}
              width={'100%'}
              height={'400px'}
            />
          </NeomorphicCard>
        </Grid>
        <Grid item xs={12} md={8} lg={6}>
          <NeomorphicCard>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Category
            </Typography>
            <Chart
              chartType="PieChart"
              data={catchartData}
              options={catoptions}
              width={'100%'}
              height={'400px'}
            />
          </NeomorphicCard>
        </Grid>
      </Grid>

      {/* Category Cards Section */}
      <Grid container spacing={3}>
        {/* Hindi Comics Card */}
        <Grid item xs={12} sm={3}>
          <NeomorphicCard sx={{ aspectRatio: '1', height: 'auto' }} onClick={() => handleCategoryClick('HindiComics')}>
            <FaRegFileAlt size={40} color="#4caf50" />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Hindi Comics
            </Typography>
            <Typography variant="h4" color="primary">
              {categoryCounts.HindiComics}
            </Typography>
          </NeomorphicCard>
        </Grid>

        {/* Hindi Books Card */}
        <Grid item xs={12} sm={3}>
          <NeomorphicCard sx={{ aspectRatio: '1', height: 'auto' }} onClick={() => handleCategoryClick('HindiBooks')}>
            <FaBook size={40} color="#ff9800" />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Hindi Books
            </Typography>
            <Typography variant="h4" color="primary">
              {categoryCounts.HindiBooks}
            </Typography>
          </NeomorphicCard>
        </Grid>

        {/* Hindi Dubbed Card */}
        <Grid item xs={12} sm={3}>
          <NeomorphicCard sx={{ aspectRatio: '1', height: 'auto' }} onClick={() => handleCategoryClick('HindiDubbed')}>
            <FaClipboardList size={40} color="#2196f3" />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Hindi Dubbed
            </Typography>
            <Typography variant="h4" color="primary">
              {categoryCounts.HindiDubbed}
            </Typography>
          </NeomorphicCard>
        </Grid>

        {/* Hindu Books Card */}
        <Grid item xs={12} sm={3}>
          <NeomorphicCard sx={{ aspectRatio: '1', height: 'auto' }} onClick={() => handleCategoryClick('HinduBooks')}>
            <FaBook size={40} color="#4caf50" />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Hindu Books
            </Typography>
            <Typography variant="h4" color="primary">
              {categoryCounts.HinduBooks}
            </Typography>
          </NeomorphicCard>
        </Grid>

        {/* Users Count Card */}
        <Grid item xs={12} sm={3}>
          <NeomorphicCard sx={{ aspectRatio: '1', height: 'auto' }}>
            <FaUsers size={40} color="#9c27b0" />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Users
            </Typography>
            <Typography variant="h4" color="primary">
              {roleCounts.user}
            </Typography>
          </NeomorphicCard>
        </Grid>

        {/* Admins Count Card */}
        <Grid item xs={12} sm={3}>
          <NeomorphicCard sx={{ aspectRatio: '1', height: 'auto' }}>
            <FaUserCog size={40} color="#ff5722" />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Admins
            </Typography>
            <Typography variant="h4" color="primary">
              {roleCounts.admin}
            </Typography>
          </NeomorphicCard>
        </Grid>

        {/* Editors Count Card */}
        <Grid item xs={12} sm={3}>
          <NeomorphicCard sx={{ aspectRatio: '1', height: 'auto' }}>
            <FaUserAlt size={40} color="#00bcd4" />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Editors
            </Typography>
            <Typography variant="h4" color="primary">
              {roleCounts.editor}
            </Typography>
          </NeomorphicCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
