

import { Container, Box, Typography, Button } from '@mui/material';
import aboutBackground from '../images/blackBackground.webp'
import { useNavigate } from 'react-router-dom';
import MetaData from '../components/layout/MetaData';

const About = () => {
    const navigate = useNavigate();
    const handleContact = () => {
        navigate("/contact");
    }
  return (
    <>
    <MetaData title={"CRM - About Us"} />
    <Box
      sx={{
        background: `url(${aboutBackground}) no-repeat center center`,
        backgroundSize: 'cover',
        py: 8,
        color: '#fff',
        mt: 1.5
      }}
    >
      <Container maxWidth="md">
        {/* Introduction Section */}
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
          About Us
        </Typography>
        <Typography variant="h6" align="center" paragraph sx={{ opacity: 0.9 }}>
          At CRM Application, we are dedicated to helping businesses strengthen their customer relationships.
          Our innovative CRM solutions are designed to make managing customer interactions simpler, more efficient, and more impactful.
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ opacity: 0.8 }}>
          Founded on the principles of integrity and innovation, we strive to deliver products that not only meet the needs of our clients 
          but also exceed their expectations. We believe that every business, regardless of size, deserves the tools to build lasting connections with their customers.
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ opacity: 0.8 }}>
          Our team is passionate about technology and customer success. We are constantly evolving our platform to ensure it remains at the forefront of the industry,
          helping our clients stay ahead in a rapidly changing world.
        </Typography>

        {/* Call to Action Section */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button variant="contained" color="secondary" size="large" onClick={handleContact}>
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default About;
