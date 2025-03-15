import './styles/css/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
// In index.js or App.js
import './styles/css/customScrollbar.css';

// import AutoLogout from './components/AutoLogout'; // Import AutoLogout component

// Use createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
   {/* <AutoLogout />  */}
    <App />
  </Router>
);
