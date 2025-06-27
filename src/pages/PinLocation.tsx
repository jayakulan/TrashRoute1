import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Alert, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadScript, GoogleMap, OverlayView } from '@react-google-maps/api';

// Sri Lanka bounds and center
const SRI_LANKA_BOUNDS = {
  north: 10.0,
  south: 5.7,
  east: 82.2,
  west: 79.8,
};
const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

const PinLocation: React.FC = () => {
  const [location, setLocation] = useState({
    lat: SRI_LANKA_CENTER.lat,
    lng: SRI_LANKA_CENTER.lng,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [pinPlaced, setPinPlaced] = useState(false);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (
          latitude >= SRI_LANKA_BOUNDS.south &&
          latitude <= SRI_LANKA_BOUNDS.north &&
          longitude >= SRI_LANKA_BOUNDS.west &&
          longitude <= SRI_LANKA_BOUNDS.east
        ) {
          setLocation({ lat: latitude, lng: longitude });
          setPinPlaced(true);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocation({ lat, lng });
      setPinPlaced(true);
      setConfirmed(false);
    }
  };

  const handleClosePopup = () => {
    setConfirmed(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, position: 'relative' }}>
      {/* Centered Pop-up Notification */}
      <Fade in={confirmed} unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.25)',
          }}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              bgcolor: '#43a047',
              color: 'white',
              borderRadius: 2,
              boxShadow: '0 8px 32px 0 #b7e0a5',
              letterSpacing: 0.5,
              textAlign: 'center',
              minWidth: 320,
              maxWidth: '90vw',
              py: 3,
              position: 'relative',
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClosePopup}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            📍 Location pinned successfully!<br />
            <span style={{ fontWeight: 400, fontSize: '0.95rem' }}>
              Latitude: {location.lat}, Longitude: {location.lng}
            </span>
          </Alert>
        </Box>
      </Fade>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: 'Montserrat, Arial Black, Arial, sans-serif',
            fontWeight: 900,
            color: '#388e3c',
            letterSpacing: 1,
            textShadow: '1px 2px 8px #b7e0a5',
            mb: 1,
          }}
        >
          📍 Pin Your Location
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: 'Roboto, Arial, sans-serif',
            color: '#388e3c',
            fontStyle: 'italic',
            fontWeight: 400,
            background: 'rgba(232, 245, 233, 0.7)',
            borderRadius: 2,
            px: 2,
            py: 1,
            display: 'inline-block',
            boxShadow: '0 2px 8px 0 #b7e0a5',
            mb: 2,
          }}
        >
          Click on the map to set your <b>exact pickup location</b>.<br />
          <span style={{ color: '#1976d2', fontWeight: 500 }}>Only locations within Sri Lanka are allowed.</span>
        </Typography>
      </Box>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={location}
          zoom={8}
          onClick={handleMapClick}
          options={{
            restriction: {
              latLngBounds: {
                north: SRI_LANKA_BOUNDS.north,
                south: SRI_LANKA_BOUNDS.south,
                east: SRI_LANKA_BOUNDS.east,
                west: SRI_LANKA_BOUNDS.west,
              },
              strictBounds: true,
            },
            minZoom: 7,
            maxZoom: 18,
          }}
        >
          {pinPlaced && (
            <OverlayView
              position={location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 36, lineHeight: 1 }}>📍</span>
                <Box sx={{ bgcolor: 'white', borderRadius: 1, p: 0.5, mt: 0.5, boxShadow: 1 }}>
                  <Typography variant="caption">
                    Lat: {location.lat.toFixed(5)}<br />Lng: {location.lng.toFixed(5)}
                  </Typography>
                </Box>
              </Box>
            </OverlayView>
          )}
        </GoogleMap>
      </LoadScript>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <TextField
          label="Latitude"
          value={location.lat}
          InputProps={{ readOnly: true }}
          sx={{ mr: 2, width: 150 }}
        />
        <TextField
          label="Longitude"
          value={location.lng}
          InputProps={{ readOnly: true }}
          sx={{ width: 150 }}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmed(true)}
            disabled={!pinPlaced}
          >
            Confirm Location
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PinLocation; 