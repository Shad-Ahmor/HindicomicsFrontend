

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Divider, Avatar, Typography, Box } from '@mui/material'; // Import Drawer components
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../AuthHandler.js';
import MenuBar from './Menubar.js';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { decryptData ,decrypturl} from '../Security/cryptoUtils.js';


import MuiDrawer from '@mui/material/Drawer';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(10)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);


const Sidebar = ({  Setuserimg,open, handleDrawerClose, isLoggedIn, role, setIsLoggedIn, setRole, setError, setSuccess, setLoading, history, firebase }) => {
  const theme = useTheme();
  const [finalrole, setFinalRole] = useState([]);

  const navigate = useNavigate();
  // State to hold user profile data
  const [userProfile, setUserProfile] = useState({
    name: '',
    role: ''
  });
   // Fetch user profile data
   const encimg=localStorage.getItem("profileabc")
   const userimg = decryptData(encimg)
   Setuserimg(userimg);
  const handleNavigate = (route) => {
    navigate(route);
    handleDrawerClose(); // Close the drawer after navigation
  };

  const handleLoginButtonClick = () => {
    navigate('/login');
  };

  const handleLogoutButtonClick = () => {
    console.log("logout click");
    handleLogout(setIsLoggedIn, navigate, setError, setSuccess, setLoading, history);
  };

   // Function to check if user has permission for a given route
   const hasPermission = (baseurl, url, method) => {
    return finalrole.some(permission => 
      permission.baseurl === baseurl && 
      permission.url === url && 
      permission.method === method
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const userRole = localStorage.getItem('role'); 
    const userName = localStorage.getItem('name'); // Get the user's name
    if (token && userRole) {
      setIsLoggedIn(true);
      setRole(userRole);
      setUserProfile({ name: decryptData(userName).toLocaleUpperCase() || 'User', role: String(decryptData(userRole)).toLocaleUpperCase() });
    }
  }, [isLoggedIn, role, setIsLoggedIn, setRole]); // Runs when login/logout occurs
  
  const fetchpermission = async () => {
    try {
      const token = localStorage.getItem('token');
      const userrole = localStorage.getItem('role');
      const userlocal = localStorage.getItem("uid");
      const decryptrole = decryptData(userrole);


      const response = await axios.post(
        `https://hindicomicsbackend.onrender.comapi/role-permission`,
        {
          role: decryptrole,
          userId: userlocal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Only token in the Authorization header
          },
        }
      );
      setFinalRole(response.data);
    } catch (error) {
      console.error('Error fetching help settings:', error);
    }
  };

  useEffect(() => {
    fetchpermission();
  }, []);
  const usersubrole = localStorage.getItem('subrole');
  const decryptsubrole = decryptData(usersubrole)
  return (
    <div>
   <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          

          {open && (
          <>
        
           
            <Box sx={{ textAlign:'center' }}>
              <Typography variant="h6" color="black">
                {userProfile.name || 'User'}
              </Typography>
              <Typography variant="body2" color="black">
                {userProfile.role || 'Role'}
              </Typography>
            </Box>
          </>
        )}
        <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>

        </DrawerHeader>
        <Divider />
        
        <Divider sx={{ backgroundColor: '#fff' }} />
        <MenuBar decryptsubrole={decryptsubrole} open={open} handleNavigate={handleNavigate} hasPermission={hasPermission} isLoggedIn={isLoggedIn} handleLoginButtonClick={handleLoginButtonClick} handleLogoutButtonClick={handleLogoutButtonClick}/>
      </Drawer>
    </div>
  );
};

export default Sidebar;
