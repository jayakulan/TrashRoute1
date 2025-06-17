import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const quickAccessItems = [
    { label: 'Schedule', icon: <ScheduleIcon />, path: '/schedule' },
    { label: 'Contact', icon: <ContactSupportIcon />, path: '/contact' },
    { label: 'My Account', icon: <AccountCircleIcon />, path: '/account' },
  ];

  const mainNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Request Pickup', path: '/request-pickup' },
    { label: 'Track Pickup', path: '/track-pickup' },
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
  ];

  return (
    <AppBar position="static">
      {/* Quick Access Bar */}
      <Toolbar variant="dense" sx={{ bgcolor: 'primary.dark' }}>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          {quickAccessItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => handleNavigate(item.path)}
              size="small"
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Toolbar>

      {/* Main Navigation Bar */}
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={Link}
          to="/"
        >
          <RecyclingIcon />
        </IconButton>
        
        {/* Brand Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            mr: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="span"
              sx={{
                fontFamily: 'Georgia, Times New Roman, Times, serif',
                fontWeight: 700,
                fontSize: 32,
                color: 'black',
                letterSpacing: 1,
                lineHeight: 1,
                p: 0,
                m: 0,
              }}
            >
              Trash
            </Box>
            {/* ROUTE letters, each with its own background and border */}
            {[...'ROUTE'].map((char, idx) => (
              <Box
                key={idx}
                component="span"
                sx={{
                  fontFamily: 'Arial Black, Arial, sans-serif',
                  fontWeight: 900,
                  fontSize: 32,
                  color: '#4b7c3a',
                  background: '#b7e0a5',
                  border: '2px solid #4b7c3a',
                  borderRadius: '4px',
                  ml: 0.2,
                  px: 0.7,
                  letterSpacing: 0,
                  textTransform: 'uppercase',
                  boxShadow: '1px 1px 0 #4b7c3a',
                  display: 'inline-block',
                  lineHeight: 1,
                  p: 0,
                  m: 0,
                }}
              >
                {char}
              </Box>
            ))}
          </Box>
        </Box>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'none' }}>
          TrashRoute
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {mainNavItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            {mainNavItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 