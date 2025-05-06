import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Work,
  School,
  Code,
  Add
} from '@mui/icons-material';
import { styled } from '@mui/system';

const ProfileEdit = ({ userId: propUserId, onUpdated, onClose }) => {
  const userId = propUserId || localStorage.getItem('userId');
  const [data, setData] = useState({
    headline: '',
    bio: '',
    skills: [],
    experiences: [],
    certifications: []
  });
  const [message, setMessage] = useState({ text: '', severity: 'info' });
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/api/profile/${userId}`);
        setData({
          headline: res.data.headline || '',
          bio: res.data.bio || '',
          skills: res.data.skills || [],
          experiences: res.data.experiences || [],
          certifications: res.data.certifications || []
        });
      } catch (err) {
        setMessage({ text: 'Failed to load profile', severity: 'error' });
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData({
        ...data,
        skills: [...data.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...data.skills];
    updatedSkills.splice(index, 1);
    setData({ ...data, skills: updatedSkills });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/api/profile/${userId}`, data);
      setMessage({ text: 'Profile updated successfully!', severity: 'success' });
      if (onUpdated) {
        setTimeout(() => onUpdated(), 1500); // Wait a bit before closing to show success message
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({ text: 'Error updating profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    }
  }));

  if (loading && !data.headline) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Profile
      </Typography>

      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleUpdate}>
        <TextField
          fullWidth
          label="Professional Headline"
          variant="outlined"
          name="headline"
          value={data.headline}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Edit color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="About Me"
          variant="outlined"
          name="bio"
          value={data.bio}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Edit color="action" />
              </InputAdornment>
            ),
          }}
        />

        <SectionHeader variant="h6">
          <Code /> Skills
        </SectionHeader>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {data.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleRemoveSkill(index)}
              sx={{ fontSize: '0.875rem' }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add new skill"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
          >
            Add
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {onClose && (
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

// Optional: Wrap in dialog for modal usage
export const ProfileEditDialog = ({ open, onClose, ...props }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Edit Profile</DialogTitle>
    <DialogContent dividers>
      <ProfileEdit {...props} onClose={onClose} />
    </DialogContent>
  </Dialog>
);

export default ProfileEdit;