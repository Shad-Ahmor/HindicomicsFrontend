import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import RoutesConfig from './RoutesConfig';
import { useLocation, useNavigate } from 'react-router-dom';  // <-- Import useLocation and useNavigate
import { styled } from '@mui/material/styles';
import Header from './Header'; // Import the Header component
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import MuiAppBar from '@mui/material/AppBar';

const drawerWidth = 240;
const decryptData = (encimg) => {
  // Placeholder logic for decrypting the image data
  return encimg;  // Modify this with actual decryption logic
};  


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

function HindiComics({ setIsLoggedIn }) {
    const [role, setRole] = useState(null); // Initially set to null
    const [userId, setUserId] = useState(null); // Initially set to null
    const [userimg, Setuserimg] = useState('');
    
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedInState] = useState(false);
    const [token, settoken] = useState('');
    const location = useLocation(); // Get the current location
    const navigate = useNavigate(); // To redirect after login or logout
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuId = 'primary-search-account-menu';

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };


 


    // Ensure state is updated on initial load
    useEffect(() => {
        const usertoken = localStorage.getItem('token');
        if (usertoken) {
            setIsLoggedInState(true); // Set logged-in state if cookies exist
        } else {
            setIsLoggedInState(false); // If no cookies, consider the user logged out
        }
        setLoading(false); // Stop loading after checking auth status
    }, [location]);

    if (loading) return <div>Loading...</div>; // Avoid flickering until the auth state is resolved

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar 
            Setuserimg={Setuserimg}
                open={open} 
                handleDrawerClose={handleDrawerClose} 
                isLoggedIn={isLoggedIn} 
                role={role} 
                setIsLoggedIn={setIsLoggedIn} 
                setRole={setRole} 
                setError={setError} 
                setSuccess={setSuccess} 
                setLoading={setLoading} 
                history={navigate} 
            />

            {/* Header */}
               {/* Main content */}
               <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>

        <CssBaseline />
<AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
            {/* Right side header content */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Notification and Profile Section */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Profile Icon with Image */}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
         
               {userimg ?
                
                <div className="imageContainer">
                  <img src={userimg} className="image" alt="user profile" onClick={() => navigate('/profile')} />
                  
                </div>
                :
                <AccountCircle />
               }
              </IconButton>
            </Box>
          </Toolbar>
      </AppBar>
      </Box>
            {/* Styled AppBar */}
            <Box
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        p: 3,
                        transition: 'margin-left 0.3s ease', // Smooth transition when the sidebar is toggled
                        marginTop: '64px', // Adjust for AppBar height
                        marginLeft: open ? `${drawerWidth}px` : 0, // Adjust content based on Sidebar state
                    }}
                >
            <RoutesConfig 
                    setIsLoggedIn={setIsLoggedIn} 
                    isLoggedIn={isLoggedIn} 
                    history={navigate} 
                    token={token} 
                    settoken={settoken} 
                    setRole={setRole} 
                    role={role} 
                    setUserId={setUserId} 
                    userId={userId} 
                />
                </Box>
        </Box>
    );
}

export default HindiComics;