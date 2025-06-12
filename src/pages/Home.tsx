import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RecyclingIcon from '@mui/icons-material/Recycling';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RecyclingIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Waste Categorization',
      description: 'Easily categorize your waste for proper disposal and recycling.',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Efficient Pickup Service',
      description: 'Schedule pickups with the nearest waste processing company.',
    },
    {
      icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Tracking',
      description: 'Track your waste pickup request in real-time.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Smart Waste Management
              </Typography>
              <Typography variant="h5" paragraph>
                Connect with waste processing companies and manage your waste efficiently.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                  Choose Your Role
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/register?role=customer')}
                      sx={{ mb: 2 }}
                    >
                      Sign Up as Customer
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/login?role=customer')}
                    >
                      Login as Customer
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/register?role=company')}
                      sx={{ mb: 2 }}
                    >
                      Sign Up as Company
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/login?role=company')}
                    >
                      Login as Company
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.png"
                alt="Waste Management"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  margin: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Our Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Join our platform and contribute to a cleaner environment.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ bgcolor: 'white', color: 'secondary.main' }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;