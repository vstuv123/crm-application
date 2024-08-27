import { Container, Grid, Typography, Button, Box } from '@mui/material';
import '../components/Header.css';
import MetaData from '../components/layout/MetaData';
import { Link, useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useAuth } from '../context/userContext';

const Home = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();

  const handleStarted = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }else {
      navigate("/profile");
    }
  }
  return (
    <>
        <MetaData title={"CRM - Home Page"} />
        <div>
      {/* Hero Section */}
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(to right, #3A1C71, #D76D77, #FFAF7B)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom>
            Manage Your Customer Relationships Effectively
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 4}}>
            Streamline your business processes and build stronger customer relationships with our intuitive CRM.
          </Typography>
          <Button variant="contained" color="secondary" sx={{ mt: 4}} size="large" onClick={handleStarted}>
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Key Features
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <BarChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6">Track Sales</Typography>
            <Typography>Monitor your sales pipeline with ease.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <SettingsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6">Automate Tasks</Typography>
            <Typography>Save time with workflow automation.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <PieChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6">Insightful Analytics</Typography>
            <Typography>Get valuable insights from your data.</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 5,
          backgroundColor: '#3A1C71',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to Elevate Your Customer Management?
        </Typography>
        <Button variant="contained" color="secondary" size="large" onClick={handleStarted}>
          Try It Now
        </Button>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          backgroundColor: '#2C2C2C',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">© 2024 CRM Application. All rights reserved.</Typography>
        <Typography variant="body2">
          <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>
            About
          </Link>{' '}
          |{' '}
          <Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>
            Contact
          </Link>{' '}
          |{' '}
          <Link to="/privacy" style={{ color: '#fff', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </div>
    </>
  )
}

export default Home
