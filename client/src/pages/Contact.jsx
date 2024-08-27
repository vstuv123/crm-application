
import { Container, Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';
import MetaData from '../components/layout/MetaData';

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = (e) => {
    e.preventDefault();

    const templateParams = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    const toastId = toast.loading("Sending your message...");

    Promise.all([
      emailjs.send('service_okjk9e3', 'template_uyme7em', templateParams, '5B3r6Ra6g1qdBDVKo'),
      emailjs.send('service_okjk9e3', 'template_05ckgh9', templateParams, '5B3r6Ra6g1qdBDVKo')
    ])
    //eslint-disable-next-line
    .then((responses) => {
      toast.dismiss(toastId);

      toast.success('Thank you for contacting us. We will get back to you shortly.');
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    })
    //eslint-disable-next-line
    .catch((err) => {
      toast.dismiss(toastId);
      toast.error('Failed to send your message. Please try again.');
    });
  }

  return (
    <>
    <MetaData title={"CRM - Contact Us"} />
    <Container sx={{ py: 5, mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 500}}>
        Contact Us
      </Typography>
      <Typography variant="body1" gutterBottom align="center">
        Have any questions or need support? Reach out to us and we’ll get back to you shortly.
      </Typography>
      <Box component="form" sx={{ mt: 3 }} onSubmit={handleMessage}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" variant="outlined" value={name} required onChange={(e) => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" variant="outlined" value={email} required onChange={(e) => setEmail(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Subject" variant="outlined" value={subject} required onChange={(e) => setSubject(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              variant="outlined"
              value={message}
              multiline
              rows={4}
              required
              onChange={(e) => setMessage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button variant="contained" type='submit' color="primary" size="large">
              Send Message
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h6">Our Office</Typography>
        <Typography variant="body1">CRM Street, Rawalpindi, Pakistan</Typography>
        <Typography variant="body1">Phone: +123 456 789</Typography>
        <Typography variant="body1">Email: mabdullah305858@gmail.com</Typography>
      </Box>
    </Container>
    </>
  );
};

export default Contact;
