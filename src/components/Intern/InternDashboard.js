import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';
import '../css/ShineBorder.css';
import { decryptData } from '../Security/cryptoUtils';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  LinearProgress,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AirlineSeatFlatAngledIcon from '@mui/icons-material/AirlineSeatFlatAngled';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ShineBorder = ({ children }) => (
  <div className="shine-border-wrapper">
    <div className="shine-border-glow" />
    <div className="shine-border-content">{children}</div>
  </div>
);

const Dashboard = () => {
  const [attendance, setAttendance] = useState(0);
  const [leaves, setLeaves] = useState(0);
  const [absents, setAbsents] = useState(0);
  const [internshipStart, setInternshipStart] = useState('');
  const [internProgressPercent, setInternProgressPercent] = useState(0);
  const [projects, setProjects] = useState(0);
  const [courses, setCourses] = useState(0);
  const [completedAssignments, setCompletedAssignments] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [internshipType, setInternshipType] = useState('basic'); // default to basic

  useEffect(() => {
    const userId = decryptData(localStorage.getItem('uid'));
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`https://hindicomicsbackend.onrender.com/auth/attendance-summary/${userId}`);
        const data = response.data;
        setAttendance(data.totalAttendance);
        setLeaves(data.totalLeave);
        setAbsents(data.totalAbsent);
        setInternshipStart(data.internshipStart);
        setInternProgressPercent(data.internProgressPercent);
        setProjects(data.projects);
        setCourses(data.courses);
        setCompletedAssignments(data.completedAssignments);
        setTotalAssignments(data.totalAssignments);
      } catch (error) {
        console.error('Failed to fetch attendance summary:', error);
      }
    };

    fetchAttendance();
  }, []);

  const chartData = {
    labels: ['Attendance', 'Leave', 'Absent'],
    datasets: [
      {
        label: 'Days',
        data: [attendance, leaves, absents],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    animation: { duration: 1000 },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
      },
    },
  };

  const getProgressCategory = () => {
    if (!internshipStart || !completedAssignments) return 'Loading...';

    const startDate = new Date(internshipStart);
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    let totalDuration = 60; // default for 'basic'

    if (internshipType === 'plus') totalDuration = 90;
    else if (internshipType === 'pro') totalDuration = 120;

    const expectedAssignments = Math.floor(daysPassed / 6); // 1 assignment per 6 days
    const performanceRatio = completedAssignments / (expectedAssignments || 1); // avoid 0 div

    if (performanceRatio >= 1.1) return 'Outstanding';
    if (performanceRatio >= 1.0) return 'Best';
    if (performanceRatio >= 0.8) return 'Better';
    if (performanceRatio >= 0.6) return 'Good';
    if (performanceRatio >= 0.4) return 'Bad';
    if (performanceRatio >= 0.15) return 'Poor';
    return 'Worst';
  };

  const cards = [
    {
      title: 'Internship Start',
      subtitle: 'Start Date',
      icon: <CalendarMonthIcon sx={{ fontSize: 28, color: '#6366F1' }} />,
      value: internshipStart ? new Date(internshipStart).toLocaleDateString() : 'Loading...',
      color: '#6366F1',
    },
    {
      title: 'Attendance',
      subtitle: 'Days Present',
      icon: <CheckCircleIcon sx={{ fontSize: 28, color: '#22c55e' }} />,
      value: attendance,
      color: '#22c55e',
    },
    {
      title: 'Leaves',
      subtitle: 'Approved / Pending',
      icon: <EventBusyIcon sx={{ fontSize: 28, color: '#facc15' }} />,
      value: leaves,
      color: '#facc15',
    },
    {
      title: 'Absents',
      subtitle: 'Days Missed',
      icon: <AirlineSeatFlatAngledIcon sx={{ fontSize: 28, color: '#ef4444' }} />,
      value: absents,
      color: '#ef4444',
    },
    {
      title: 'Assignments Progress',
      subtitle: 'assignments completed',
      icon: <WorkIcon sx={{ fontSize: 28, color: '#4CAF50' }} />,
      value: (
        <div>
          <LinearProgress
            variant="determinate"
            value={internProgressPercent}
            sx={{
              height: '8px',
              borderRadius: '8px',
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: '8px',
                backgroundColor: '#4CAF50',
              },
            }}
          />
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#4CAF50', mt: 1 }}>
            {internProgressPercent}% Completed
          </Typography>
        </div>
      ),
      color: '#4CAF50',
    },
    {
      title: 'Assignments',
      subtitle: 'Completed / Total',
      icon: <WorkIcon sx={{ fontSize: 28, color: '#9c27b0' }} />,
      value: `${completedAssignments} / ${totalAssignments}`,
      color: '#9c27b0',
    },
    {
      title: 'Projects',
      subtitle: 'Assigned Projects',
      icon: <WorkIcon sx={{ fontSize: 28, color: '#03A9F4' }} />,
      value: projects,
      color: '#03A9F4',
    },
    {
      title: 'Courses',
      subtitle: 'Assigned Courses',
      icon: <SchoolIcon sx={{ fontSize: 28, color: '#FF5722' }} />,
      value: courses,
      color: '#FF5722',
    },
    {
      title: 'Condition',
      subtitle: 'Based on your efforts',
      icon: <EmojiEventsIcon sx={{ fontSize: 28, color: '#FFD700' }} />,
      value: internProgressPercent ? getProgressCategory() : 'Loading...',
      color: '#FFD700',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-tr from-gray-900 via-purple-900 to-black text-white">
      <div className="text-center mb-8" style={{ justifyContent: 'center', display: 'flex', marginTop: 10, marginBottom: 10 }}>
        <span style={{ fontSize: '2rem' }}>🧾</span>
        <Typography
          variant="h4"
          component="span"
          sx={{
            ml: 1,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #A07CFE, #FE8FB5, #FFBE7B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Intern Dashboard
        </Typography>
      </div>

      {[0, 3, 6].map((startIdx) => (
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 1, mt: 1 }} className="mb-8 mt-8" key={startIdx}>
          {cards.slice(startIdx, startIdx + 3).map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <ShineBorder>
                <Card
                  className="transition-all duration-300 hover:scale-105"
                  sx={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <CardHeader
                    avatar={card.icon}
                    title={<Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{card.title}</Typography>}
                    subheader={<Typography variant="caption" sx={{ color: '#555' }}>{card.subtitle}</Typography>}
                    sx={{
                      background: '#f3f4f6',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                    }}
                  />
                  <Divider />
                  <CardContent sx={{ paddingBottom: '12px' }}>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        color: card.color,
                      }}
                    >
                      {typeof card.value === 'string' || typeof card.value === 'number' ? card.value : null}
                    </Typography>
                    {typeof card.value === 'object' ? card.value : null}
                  </CardContent>
                </Card>
              </ShineBorder>
            </Grid>
          ))}
        </Grid>
      ))}

      <Grid container justifyContent="center" sx={{ mt: 8 }}>
        <Grid item xs={12} md={8}>
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 4, mt: 4, color: '#111' }}>
              📊 Attendance Overview (Bar Chart)
            </Typography>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
