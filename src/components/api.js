import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

// Configure axios instance (for example, in a central axios.js file)
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your base URL
});

// Add response interceptor to handle token expiration (401 Unauthorized)


// Add response interceptor to handle token expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // Pass the response as is if it's successful
  
  async (error) => {
    const token = localStorage.getItem('token');
    
    // Check if token is missing or expired
    if (!token || error.response?.status === 401) {
      console.error('Token is missing or expired');
      
      // Call the backend logout API to invalidate the token
      try {
        await axios.post(
          'http://localhost:5000/auth/logout', 
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token to the backend for logout
            },
          }
        );
      } catch (logoutError) {
        console.error('Error during logout API call:', logoutError);
      }

      // Clear local storage if token is missing or expired
      localStorage.clear();

      // Redirect to login page
      const navigate = useNavigate();
      navigate('/login');  // Redirect user to the login page
    }
    
    return Promise.reject(error);  // Return the error for the caller to handle
  }
);



export default api;
