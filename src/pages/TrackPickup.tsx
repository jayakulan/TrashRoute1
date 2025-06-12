import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { PickupRequest } from '../types';
import apiService from '../services/api';

const statusColors = {
  pending: 'warning',
  accepted: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const TrackPickup: React.FC = () => {
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPickupRequests();
  }, []);

  const loadPickupRequests = async () => {
    try {
      // In a real app, we would get the userId from the auth context
      const userId = 'current-user-id';
      const response = await apiService.getPickupRequests(userId);
      if (response.success && response.data) {
        setPickupRequests(response.data);
        if (response.data.length > 0) {
          setSelectedRequest(response.data[0]);
        }
      }
    } catch (err) {
      setError('Failed to load pickup requests');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Track Pickup Requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Your Requests
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pickupRequests.map((request) => (
              <Card
                key={request.id}
                sx={{
                  cursor: 'pointer',
                  bgcolor:
                    selectedRequest?.id === request.id ? 'action.selected' : 'background.paper',
                }}
                onClick={() => setSelectedRequest(request)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                      Request #{request.id.slice(0, 8)}
                    </Typography>
                    <Chip
                      label={statusLabels[request.status]}
                      color={statusColors[request.status] as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled for: {formatDate(request.scheduledDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time Slot: {request.scheduledTimeSlot}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedRequest ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Request Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Status</Typography>
                    <Chip
                      label={statusLabels[selectedRequest.status]}
                      color={statusColors[selectedRequest.status] as any}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Waste Categories</Typography>
                    {selectedRequest.wasteCategories.map((category) => (
                      <Typography key={category.categoryId}>
                        {category.quantity} {category.unit}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Pickup Location</Typography>
                    <Typography>
                      {selectedRequest.pickupAddress.street},{' '}
                      {selectedRequest.pickupAddress.city},{' '}
                      {selectedRequest.pickupAddress.state}{' '}
                      {selectedRequest.pickupAddress.zipCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '300px' }}
                        center={{
                          lat: selectedRequest.pickupAddress.coordinates?.latitude || 0,
                          lng: selectedRequest.pickupAddress.coordinates?.longitude || 0,
                        }}
                        zoom={15}
                      >
                        <Marker
                          position={{
                            lat: selectedRequest.pickupAddress.coordinates?.latitude || 0,
                            lng: selectedRequest.pickupAddress.coordinates?.longitude || 0,
                          }}
                        />
                      </GoogleMap>
                    </LoadScript>
                  </Grid>
                  {selectedRequest.status === 'pending' && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          // Implement cancel request functionality
                        }}
                      >
                        Cancel Request
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a request to view details
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackPickup; 