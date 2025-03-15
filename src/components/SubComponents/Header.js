import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Open Drawer Icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Close Drawer Icon

const Header = ({ handleDrawerOpen, handleDrawerClose, open }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 ,
                backgroundColor: '#4d0099',
              }}>
      <Toolbar>
        {/* Open drawer button */}
        {!open && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              display: { xs: 'block', sm: 'block' },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Close drawer button */}
        {open && (
          <IconButton
            color="inherit"
            aria-label="close drawer"
            onClick={handleDrawerClose}
            edge="start"
            sx={{
              mr: 2,
              display: { xs: 'block', sm: 'block' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        <Typography variant="h6" noWrap component="div">
          Hindi Comics
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
