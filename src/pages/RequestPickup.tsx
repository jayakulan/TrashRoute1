import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { WasteCategory, PickupRequest } from '../types';
import apiService from '../services/api';

const steps = ['Select Waste Type', 'Location Details', 'Schedule Pickup', 'Review & Confirm'];

const RequestPickup: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{
    categoryId: string;
    quantity: number;
    unit: 'kg' | 'lbs' | 'pieces';
  }[]>([]);
  const [location, setLocation] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [schedule, setSchedule] = useState({
    date: '',
    timeSlot: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWasteCategories();
    getCurrentLocation();
  }, []);

  const loadWasteCategories = async () => {
    try {
      const response = await apiService.getWasteCategories();
      if (response.success && response.data) {
        setWasteCategories(response.data);
      }
    } catch (err) {
      setError('Failed to load waste categories');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation((prev) => ({
            ...prev,
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
        },
        () => {
          setError('Failed to get current location');
        }
      );
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const pickupData: Partial<PickupRequest> = {
        wasteCategories: selectedCategories,
        pickupAddress: location,
        scheduledDate: new Date(schedule.date),
        scheduledTimeSlot: schedule.timeSlot,
        status: 'pending',
      };

      const response = await apiService.createPickupRequest(pickupData);
      if (response.success) {
        // Navigate to confirmation page or show success message
        setActiveStep(steps.length);
      }
    } catch (err) {
      setError('Failed to submit pickup request');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {wasteCategories.map((category) => (
              <Grid item xs={12} key={category.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{category.name}</Typography>
                    <Typography color="textSecondary" paragraph>
                      {category.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Quantity"
                          onChange={(e) => {
                            const quantity = Number(e.target.value);
                            setSelectedCategories((prev) => {
                              const existing = prev.find((c) => c.categoryId === category.id);
                              if (existing) {
                                return prev.map((c) =>
                                  c.categoryId === category.id ? { ...c, quantity } : c
                                );
                              }
                              return [...prev, { categoryId: category.id, quantity, unit: 'kg' }];
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Unit</InputLabel>
                          <Select
                            value={
                              selectedCategories.find((c) => c.categoryId === category.id)?.unit ||
                              'kg'
                            }
                            onChange={(e) => {
                              const unit = e.target.value as 'kg' | 'lbs' | 'pieces';
                              setSelectedCategories((prev) => {
                                const existing = prev.find((c) => c.categoryId === category.id);
                                if (existing) {
                                  return prev.map((c) =>
                                    c.categoryId === category.id ? { ...c, unit } : c
                                  );
                                }
                                return [...prev, { categoryId: category.id, quantity: 0, unit }];
                              });
                            }}
                          >
                            <MenuItem value="kg">Kilograms</MenuItem>
                            <MenuItem value="lbs">Pounds</MenuItem>
                            <MenuItem value="pieces">Pieces</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={location.street}
                  onChange={(e) => setLocation({ ...location, street: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={location.zipCode}
                  onChange={(e) => setLocation({ ...location, zipCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={location.country}
                  onChange={(e) => setLocation({ ...location, country: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    center={{
                      lat: location.coordinates.latitude,
                      lng: location.coordinates.longitude,
                    }}
                    zoom={15}
                  >
                    <Marker
                      position={{
                        lat: location.coordinates.latitude,
                        lng: location.coordinates.longitude,
                      }}
                    />
                  </GoogleMap>
                </LoadScript>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Pickup Date"
                InputLabelProps={{ shrink: true }}
                value={schedule.date}
                onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Time Slot</InputLabel>
                <Select
                  value={schedule.timeSlot}
                  onChange={(e) => setSchedule({ ...schedule, timeSlot: e.target.value })}
                >
                  <MenuItem value="morning">Morning (8:00 AM - 12:00 PM)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (12:00 PM - 4:00 PM)</MenuItem>
                  <MenuItem value="evening">Evening (4:00 PM - 8:00 PM)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Request
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Selected Waste Categories:</Typography>
                {selectedCategories.map((category) => {
                  const categoryDetails = wasteCategories.find((c) => c.id === category.categoryId);
                  return (
                    <Typography key={category.categoryId}>
                      {categoryDetails?.name}: {category.quantity} {category.unit}
                    </Typography>
                  );
                })}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Pickup Location:</Typography>
                <Typography>
                  {location.street}, {location.city}, {location.state} {location.zipCode},{' '}
                  {location.country}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Schedule:</Typography>
                <Typography>
                  Date: {schedule.date}
                  <br />
                  Time Slot: {schedule.timeSlot}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Request Waste Pickup
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Thank you for your request!
          </Typography>
          <Typography>
            Your pickup request has been submitted successfully. You can track the status of your
            request in the dashboard.
          </Typography>
        </Box>
      ) : (
        <Box>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Submit Request' : 'Next'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default RequestPickup; 