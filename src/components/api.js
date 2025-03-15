import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

// Configure axios instance (for example, in a central axios.js file)
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your base URL
});

// Add response interceptor to handle token expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // Pass the response as is if it's successful
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // Send a request to the logout API to invalidate the token
        await axios.post('https://hindicomicsbackend.onrender.comlogout');  // Replace with your actual logout endpoint
        
        // After logout, clear the local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('uid');
        
        // Use navigate from react-router-dom to redirect to the login page
        const navigate = useNavigate();
        navigate('/login');  // Redirect user to the login page

      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
      }
    }
    return Promise.reject(error);  // Return the error for the caller to handle
  }
);

export default api;
