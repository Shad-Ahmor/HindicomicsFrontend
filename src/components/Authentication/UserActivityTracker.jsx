import { useEffect, useRef } from 'react';

const UserActivityTracker = () => {
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    const updateActivity = () => {
      lastActivity.current = Date.now();
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    const interval = setInterval(async () => {
      const now = Date.now();
      const idleTime = now - lastActivity.current;

      if (idleTime >= 60 * 60 * 1000) { // 1 hour
        try {
          await fetch('https://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        } catch (err) {
          console.error('Logout failed:', err);
        } finally {
          localStorage.removeItem('token');
          window.location.reload(); // force redirect to login
        }
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, []);

  return null; // no UI
};

export default UserActivityTracker;
