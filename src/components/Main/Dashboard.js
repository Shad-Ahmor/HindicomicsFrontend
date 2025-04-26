import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, Typography, Box, Grid } from '@mui/material'; // For displaying the counts and layout
import { styled } from '@mui/system'; // For creating the Neomorphism effect
import { FaBook, FaRegFileAlt, FaClipboardList, FaUsers, FaUserCog, FaUserAlt } from 'react-icons/fa'; // Icons
import { useNavigate } from 'react-router-dom'; // For navigation

// Google Charts imports
import { Chart } from 'react-google-charts';
import ShineBorder from './ShineBorder';

// Neomorphism Effect Style
const NeomorphicCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #e0e0e0, #ffffff)',
  boxShadow: '8px 8px 15px #d1d1d1, -8px -8px 15px #ffffff',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',  // Horizontally center the children
  justifyContent: 'center',  // Vertically center the children
  minWidth: 200,
  height: 150, // Set a fixed height
  textAlign: 'center',  // Ensure text is also centered
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
    <Box >
      {/* 3D Pie Chart Section */}
          
      <Grid container spacing={3} sx={{ marginBottom: 1 }}>
  <Grid item xs={12} md={6}>
    <ShineBorder>
      <Card
        className="transition-all duration-300 hover:scale-105"
        sx={{
          mt: 2,
          pr: 1,
          pl: 1,
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width={'100%'}
          height={'40vh'}
        />
      </Card>
    </ShineBorder>
  </Grid>

  <Grid item xs={12} md={6}>
    <ShineBorder>
      <Card
        className="transition-all duration-300 hover:scale-105"
        sx={{
          mt: 2,
          pr: 1,
          pl: 1,
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Chart
          chartType="PieChart"
          data={catchartData}
          options={catoptions}
          width={'100%'}
          height={'40vh'}
        />
      </Card>
    </ShineBorder>
  </Grid>
</Grid>

      {/* Category Cards Section */}
     {/* Category Cards Section */}
<Grid container spacing={1} >
  {/* Hindi Comics Card */}
  <Grid item xs={12} sm={6} md={1.7}>
    <ShineBorder>
      <NeomorphicCard
        className="transition-all duration-300 hover:scale-105"
        sx={{
          aspectRatio: '1',
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
        onClick={() => handleCategoryClick('HindiComics')}
      >
        <FaRegFileAlt size={30} color="#4caf50" />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Hindi Comics
        </Typography>
        <Typography variant="h5"color="primary">
          {categoryCounts.HindiComics}
        </Typography>
      </NeomorphicCard>
    </ShineBorder>
  </Grid>

  {/* Hindi Books Card */}
  <Grid item xs={12} sm={6} md={1.7}>
    <ShineBorder>
      <NeomorphicCard
        sx={{
          aspectRatio: '1',
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
        onClick={() => handleCategoryClick('HindiBooks')}
      >
        <FaBook size={30} color="#ff9800" />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Hindi Books
        </Typography>
        <Typography variant="h5"color="primary">
          {categoryCounts.HindiBooks}
        </Typography>
      </NeomorphicCard>
    </ShineBorder>
  </Grid>

  {/* Hindi Dubbed Card */}
  <Grid item xs={12} sm={6} md={1.7}>
    <ShineBorder>
      <NeomorphicCard
        sx={{
          aspectRatio: '1',
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
        onClick={() => handleCategoryClick('HindiDubbed')}
      >
        <FaClipboardList size={30} color="#2196f3" />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Hindi Dubbed
        </Typography>
        <Typography variant="h5"color="primary">
          {categoryCounts.HindiDubbed}
        </Typography>
      </NeomorphicCard>
    </ShineBorder>
  </Grid>

  {/* Hindu Books Card */}
  <Grid item xs={12} sm={6} md={1.7}>
    <ShineBorder>
      <NeomorphicCard
        sx={{
          aspectRatio: '1',
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
        onClick={() => handleCategoryClick('HinduBooks')}
      >
        <FaBook size={30} color="#4caf50" />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Hindu Books
        </Typography>
        <Typography variant="h5"color="primary">
          {categoryCounts.HinduBooks}
        </Typography>
      </NeomorphicCard>
    </ShineBorder>
  </Grid>

  {/* Users Count Card */}
  <Grid item xs={12} sm={6} md={1.7}>
    <ShineBorder>
      <NeomorphicCard
        sx={{
          aspectRatio: '1',
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
      >
        <FaUsers size={30} color="#9c27b0" />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Users
        </Typography>
        <Typography variant="h5"color="primary">
          {roleCounts.user}
        </Typography>
      </NeomorphicCard>
    </ShineBorder>
  </Grid>

  {/* Admins Count Card */}
  <Grid item xs={12} sm={6} md={1.7}>
    <ShineBorder>
      <NeomorphicCard
        sx={{
          aspectRatio: '1',
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
      >
        <FaUserCog size={30} color="#ff5722" />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Admins
        </Typography>
        <Typography variant="h5"color="primary">
          {roleCounts.admin}
        </Typography>
      </NeomorphicCard>
    </ShineBorder>
  </Grid>

  {/* Editors Count Card */}
  <Grid item xs={12} sm={6} md={1.7}>
    <ShineBorder>
      <NeomorphicCard
        sx={{
          aspectRatio: '1',
          border: '2px solid transparent',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
        }}
      >
        <FaUserAlt size={30} color="#00bcd4" />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Editors
        </Typography>
        <Typography variant="h5"color="primary">
          {roleCounts.editor}
        </Typography>
      </NeomorphicCard>
    </ShineBorder>
  </Grid>
</Grid>

    </Box>
  );
};

export default Dashboard;
