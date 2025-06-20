import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { PickupRequest, User } from '../types';
import apiService from '../services/api';

const wasteTypes = [
  'Glass',
  'Metal',
  'Plastics',
  'Paper',
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [wasteSubmitSuccess, setWasteSubmitSuccess] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      navigate('/login');
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userStr);
      const response = await apiService.getPickupRequests(user.id);
      if (response.success && response.data) {
        setPickupRequests(response.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleWasteTypeChange = (waste: string) => {
    setSelectedWasteTypes((prev) =>
      prev.includes(waste)
        ? prev.filter((w) => w !== waste)
        : [...prev, waste]
    );
  };

  const handleWasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWasteSubmitSuccess(true);
    setTimeout(() => setWasteSubmitSuccess(false), 3000);
  };

  const CustomerDashboard = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Waste Types to Dispose
      </Typography>
      <form onSubmit={handleWasteSubmit}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {wasteTypes.map((waste) => (
            <Button
              key={waste}
              variant={selectedWasteTypes.includes(waste) ? 'contained' : 'outlined'}
              color={selectedWasteTypes.includes(waste) ? 'primary' : 'inherit'}
              onClick={() => handleWasteTypeChange(waste)}
              sx={{ minWidth: 120 }}
              type="button"
            >
              {waste}
            </Button>
          ))}
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={selectedWasteTypes.length === 0}
        >
          Submit Waste Types
        </Button>
      </form>
      {wasteSubmitSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Waste types submitted successfully!
        </Alert>
      )}
    </Paper>
  );

  const CompanyDashboard = () => (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            New Requests
          </Typography>
          <Typography variant="h3">
            {pickupRequests.filter(req => req.status === 'pending').length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            In Progress
          </Typography>
          <Typography variant="h3">
            {pickupRequests.filter(req => req.status === 'in_progress').length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Completed Today
          </Typography>
          <Typography variant="h3">
            {pickupRequests.filter(req => 
              req.status === 'completed' && 
              new Date(req.updatedAt).toDateString() === new Date().toDateString()
            ).length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total Revenue
          </Typography>
          <Typography variant="h3">
            $
            {pickupRequests
              .filter(req => req.status === 'completed')
              .length * 50 // Example calculation
            }
          </Typography>
        </Paper>
      </Grid>

      {/* Pending Requests */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Pending Requests
          </Typography>
          <List>
            {pickupRequests
              .filter(req => req.status === 'pending')
              .map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Request #${request.id.slice(0, 8)}`}
                      secondary={`${request.pickupAddress.street}, ${request.pickupAddress.city}`}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        // Implement accept request functionality
                      }}
                    >
                      Accept
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </Paper>
      </Grid>

      {/* In Progress Pickups */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            In Progress
          </Typography>
          <List>
            {pickupRequests
              .filter(req => req.status === 'in_progress')
              .map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Request #${request.id.slice(0, 8)}`}
                      secondary={`${request.pickupAddress.street}, ${request.pickupAddress.city}`}
                    />
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => {
                        // Implement complete pickup functionality
                      }}
                    >
                      Complete
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography color="text.secondary">
          Here's an overview of your {user?.role === 'company' ? 'business' : 'waste management'} activities
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {user?.role === 'company' ? <CompanyDashboard /> : <CustomerDashboard />}
    </Container>
  );
};

export default Dashboard; 