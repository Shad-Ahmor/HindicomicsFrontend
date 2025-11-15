import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Header = ({ handleDrawerOpen, handleDrawerClose, open }) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        background: 'linear-gradient(145deg, #fafafa, #ffffff)',
        color: '#333',
        boxShadow:
          '0 4px 12px rgba(0,0,0,0.08), inset 1px 1px 4px rgba(255,255,255,0.6)',
        borderBottom: '1px solid #e0e0e0',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 70,
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!open ? (
            <Tooltip title="Open Sidebar" arrow>
              <IconButton
                onClick={handleDrawerOpen}
                sx={{
                  background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
                  boxShadow:
                    '2px 2px 5px rgba(0,0,0,0.1), -2px -2px 5px rgba(255,255,255,0.8)',
                  '&:hover': {
                    background: 'linear-gradient(145deg, #ede7f6, #ffffff)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                <MenuIcon sx={{ color: '#7b1fa2' }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Close Sidebar" arrow>
              <IconButton
                onClick={handleDrawerClose}
                sx={{
                  background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
                  boxShadow:
                    '2px 2px 5px rgba(0,0,0,0.1), -2px -2px 5px rgba(255,255,255,0.8)',
                  '&:hover': {
                    background: 'linear-gradient(145deg, #ede7f6, #ffffff)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                <ChevronLeftIcon sx={{ color: '#6a1b9a' }} />
              </IconButton>
            </Tooltip>
          )}

          {/* LOGO + TITLE */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon
              sx={{
                color: '#8e24aa',
                fontSize: 30,
                filter: 'drop-shadow(0px 0px 5px rgba(142,36,170,0.3))',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                letterSpacing: 0.5,
                fontSize: 20,
                background: 'linear-gradient(90deg, #6a1b9a, #8e24aa, #ab47bc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Hindi Comics
            </Typography>
          </Box>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 15,
              color: '#555',
            }}
          >
            Welcome Back 👋
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: '#ddd', mx: 1 }}
          />
          <Avatar
            alt="User"
            src="https://api.dicebear.com/7.x/personas/svg?seed=Comics"
            sx={{
              width: 42,
              height: 42,
              boxShadow:
                '2px 2px 6px rgba(0,0,0,0.12), -2px -2px 6px rgba(255,255,255,0.7)',
              border: '2px solid #fff',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
