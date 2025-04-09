import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const TrackActivity = ({ startTime, userId, page }) => {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found.');
          navigate('/login'); 
          return;
        }
        const { data } = await api.post('/users', { database: 'main' }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = data.find((user) => user.id === userId);
        if (user) setUserEmail(user.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, [userId]);  // Only fetch email when userId changes

  useEffect(() => {
    if (userEmail) {
      const trackUserActivity = async () => {
        try {
          const sessionDuration = Math.floor((Date.now() - startTime) / 1000);  // Convert ms to seconds
          if (sessionDuration==0){
            sessionDuration=1;
          }
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token not found.');
            navigate('/login');  // Redirect to login if no token exists
            return;
          }
          await api.post('/useractivity/track', {
            userEmail,
            page,
            sessionDuration,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error('Error tracking user activity:', error);
        }
      };

      trackUserActivity();
    }
  }, [userEmail, startTime, page]);  // Track activity after userEmail is set

  return null;
};

export default TrackActivity;
