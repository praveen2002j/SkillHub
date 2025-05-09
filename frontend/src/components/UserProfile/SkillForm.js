import React, { useState } from 'react';
import API from '../api/axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

function SkillForm({ userId: propUserId, onAdded }) {
  const [skill, setSkill] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [skills, setSkills] = useState([]); // For displaying recently added skills

  const userId = propUserId || localStorage.getItem('userId');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return;

    try {
      await API.post(`/api/profile/${userId}/skills`, { skill }, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Update local skills state for display
      setSkills(prev => [...prev, skill]);
      
      setSkill('');
      setMessage('Skill added successfully!');
      setSeverity('success');
      setOpenSnackbar(true);
      
      onAdded?.();

    } catch (err) {
      console.error('Failed to add skill:', err);
      setMessage('Failed to add skill. It may already exist.');
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleRemoveRecentSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Skill
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleAdd} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Enter skill (e.g., JavaScript, Project Management)"
            InputProps={{
              startAdornment: <AddCircleOutlineIcon color="action" sx={{ mr: 1 }} />
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ height: '40px' }}
          >
            Add
          </Button>
        </Stack>
      </Box>

      {skills.length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Recently Added:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {skills.map((skillItem, index) => (
              <Chip
                key={index}
                label={skillItem}
                onDelete={() => handleRemoveRecentSkill(index)}
                deleteIcon={<CancelIcon />}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default SkillForm;