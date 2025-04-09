import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies



const handleLogout = async (setIsLoggedIn, setRole, navigate) => {
  const token =  localStorage.getItem('token');
  
  if (!token) {
    console.error('User is not logged in');
    return;
  }

  try {
    // Send a POST request to the /logout route with the token in the Authorization header
    const response = await fetch('https://hindicomicsbackend.onrender.com/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  // Send the token as a Bearer token
        'Content-Type': 'application/json',
      },
    });
  // If the response status is 401 (Unauthorized), it could mean the token is expired
  if (response.status === 401) {
    console.error('Token has expired');
    localStorage.removeItem('token');   // Remove expired token from localStorage
    localStorage.removeItem('uid');     // Remove the userId from localStorage
    localStorage.removeItem('role');    // Remove the role from localStorage
    localStorage.removeItem('name');    // Remove the userName from localStorage
    
    // Update the state and redirect to the login page
    setIsLoggedIn(false);
    setRole(null);
    navigate('/login');
    return;
  }
    const data = await response.json();
    
    console.log('Logout response:', data);



    localStorage.removeItem('token');       // Remove the token from cookies
    localStorage.removeItem('uid');      // Remove the userId from cookies
    localStorage.removeItem('role');        // Remove the role from cookies
    localStorage.removeItem('name'); 
    localStorage.removeItem('profileabc'); 
    localStorage.removeItem('subrole');
    // Update the state in the component
    setIsLoggedIn(false);
    setRole(null);

    // Redirect to login page or home page
    navigate('/login');

  } catch (error) {
    
    localStorage.removeItem('token');       // Remove the token from cookies
    localStorage.removeItem('uid');      // Remove the userId from cookies
    localStorage.removeItem('role');        // Remove the role from cookies
    localStorage.removeItem('name'); 
    localStorage.removeItem('profileabc'); 
    localStorage.removeItem('subrole');
    // Update the state in the component
    setIsLoggedIn(false);
    setRole(null);

    // Redirect to login page or home page
    navigate('/login');
    console.error('Error logging out:', error);
    alert('Error logging out. Please try again later.');
  }
};

export {  handleLogout };
