import React, { useState } from 'react';
import API from '../api/axios';
import {
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

function LearningGoalForm({ userId, onAdded }) {
  const [goal, setGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    completed: false
  });

  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/api/goals', { ...goal, userId });
      setGoal({ title: '', description: '', targetDate: '', completed: false });
      setMessage('✅ Goal added successfully!');
      setOpenSnackbar(true);
      onAdded?.();
    } catch (err) {
      console.error('❌ Failed to add goal:', err);
      setMessage('❌ Error adding goal. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        name="title"
        value={goal.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Description"
        name="description"
        value={goal.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        label="Target Date"
        name="targetDate"
        type="date"
        value={goal.targetDate}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        margin="normal"
        required
      />
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Goal'}
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </form>
  );
}

export default LearningGoalForm;