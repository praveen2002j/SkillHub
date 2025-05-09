import React, { useState } from 'react';
import API from '../api/axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function ExperienceForm({ userId: propUserId, onAdded }) {
  const userId = propUserId || localStorage.getItem('userId');
  const [exp, setExp] = useState({
    title: '',
    company: '',
    startDate: null,
    endDate: null,
    description: '',
    employmentType: 'Full-time'
  });
  
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Self-employed',
    'Freelance',
    'Contract',
    'Internship',
    'Apprenticeship',
    'Seasonal'
  ];

  const handleChange = (e) => {
    setExp({ ...exp, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setExp({ ...exp, [name]: date });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formattedExp = {
        ...exp,
        startDate: exp.startDate ? exp.startDate.toISOString() : null,
        endDate: isCurrentJob ? null : (exp.endDate ? exp.endDate.toISOString() : null)
      };

      await API.post(`/api/profile/${userId}/experiences`, formattedExp, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      setExp({ 
        title: '', 
        company: '', 
        startDate: null, 
        endDate: null, 
        description: '',
        employmentType: 'Full-time'
      });
      setIsCurrentJob(false);
      
      setMessage('Experience added successfully!');
      setOpenSnackbar(true);
      
      if (onAdded) onAdded();
    } catch (err) {
      console.error('Failed to add experience:', err);
      setMessage('Failed to add experience. Please try again.');
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
          Add New Experience
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" onSubmit={handleAdd}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="title"
                value={exp.title}
                onChange={handleChange}
                required
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={exp.company}
                onChange={handleChange}
                required
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Employment Type</InputLabel>
                <Select
                  name="employmentType"
                  value={exp.employmentType}
                  onChange={handleChange}
                  label="Employment Type"
                  required
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}></Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={exp.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {!isCurrentJob && (
                <DatePicker
                  label="End Date"
                  value={exp.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                  disabled={isCurrentJob}
                />
              )}
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <Box display="flex" alignItems="center">
                  <input
                    type="checkbox"
                    id="currentJob"
                    checked={isCurrentJob}
                    onChange={(e) => setIsCurrentJob(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="currentJob">I currently work here</label>
                </Box>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={exp.description}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
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
                Add Experience
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

export default ExperienceForm;