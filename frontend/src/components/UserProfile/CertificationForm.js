import React, { useState } from 'react';
import API from '../api/axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function CertificationForm({ userId: propUserId, onAdded }) {
  const userId = propUserId || localStorage.getItem('userId');
  const [cert, setCert] = useState({
    name: '',
    issuer: '',
    date: null,
    credentialId: '',
    credentialUrl: ''
  });
  
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setCert({ ...cert, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setCert({ ...cert, date });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formattedCert = {
        ...cert,
        date: cert.date ? cert.date.toISOString() : null
      };

      await API.post(`/api/profile/${userId}/certifications`, formattedCert, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      setCert({ 
        name: '', 
        issuer: '', 
        date: null,
        credentialId: '',
        credentialUrl: ''
      });
      
      setMessage('Certification added successfully!');
      setOpenSnackbar(true);
      
      if (onAdded) onAdded();
    } catch (err) {
      console.error('Failed to add certification:', err);
      setMessage('Failed to add certification. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Certification
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" onSubmit={handleAdd}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Certification Name"
                name="name"
                value={cert.name}
                onChange={handleChange}
                required
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issued By"
                name="issuer"
                value={cert.issuer}
                onChange={handleChange}
                required
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date Obtained"
                value={cert.date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credential ID (Optional)"
                name="credentialId"
                value={cert.credentialId}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Credential URL (Optional)"
                name="credentialUrl"
                value={cert.credentialUrl}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                placeholder="https://example.com/verify-certificate"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Add Certification
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}

export default CertificationForm;