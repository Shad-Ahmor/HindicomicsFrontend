import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the current URL matches the 404 error page URL
    if (window.location.href === 'https://errors.infinityfree.net/errors/404/') {
      navigate('/'); // Redirect to the homepage (or Dashboard)
    }
  }, [navigate]);

  return null; // This component doesn't render anything, it just handles the redirect
};

export default ErrorRedirect;
