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
  ListItemSecondary,
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const CustomerDashboard = () => (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total Pickups
          </Typography>
          <Typography variant="h3">
            {pickupRequests.length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Completed Pickups
          </Typography>
          <Typography variant="h3">
            {pickupRequests.filter(req => req.status === 'completed').length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Pending Pickups
          </Typography>
          <Typography variant="h3">
            {pickupRequests.filter(req => req.status === 'pending').length}
          </Typography>
        </Paper>
      </Grid>

      {/* Recent Pickups */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Recent Pickups</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/request-pickup')}
            >
              Request New Pickup
            </Button>
          </Box>
          <Timeline>
            {pickupRequests.slice(0, 5).map((request) => (
              <TimelineItem key={request.id}>
                <TimelineSeparator>
                  <TimelineDot color={
                    request.status === 'completed' ? 'success' :
                    request.status === 'in_progress' ? 'primary' :
                    request.status === 'pending' ? 'warning' : 'error'
                  } />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1">
                        Pickup #{request.id.slice(0, 8)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Scheduled for: {new Date(request.scheduledDate).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={request.status.replace('_', ' ').toUpperCase()}
                          color={
                            request.status === 'completed' ? 'success' :
                            request.status === 'in_progress' ? 'primary' :
                            request.status === 'pending' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Paper>
      </Grid>
    </Grid>
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