
import { Container, Box, Typography } from '@mui/material';
import MetaData from '../components/layout/MetaData';

const PrivacyPolicy = () => {
  return (
    <>
    <MetaData title={"CRM - Privacy Policy"} />
    <Container sx={{ py: 5, mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 500 }}>
        Privacy Policy
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our CRM application.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information you provide directly to us, such as when you create an account, fill out a form, or communicate with us. This may include your name, email address, phone number, and any other information you choose to provide.
        </Typography>

        <Typography variant="h6" gutterBottom>
          How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use your information to provide, maintain, and improve our services, to communicate with you, and to protect our users and services.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Sharing of Information
        </Typography>
        <Typography variant="body1" paragraph>
          We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Typography variant="body1" paragraph>
          We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no security system is completely secure.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Changes to This Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1">
          If you have any questions about this Privacy Policy, please contact us at support@crm.com.
        </Typography>
      </Box>
    </Container>
    </>
  );
};

export default PrivacyPolicy;
