import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileEdit from './ProfileEdit';
import SkillForm from './SkillForm';
import CertificationForm from './CertificationForm';
import ExperienceForm from './ExperienceForm';
import LearningGoalForm from './LearningGoalForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Navbar from './Navbar';

import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  Avatar,
  Grid,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Edit,
  Add,
  Delete,
  Work,
  School,
  Code,
  Close,
  CheckCircle,
  RadioButtonUnchecked,
  BarChart,
  LocationOn,
  Link,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/system';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#246bff'];

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [openSkillForm, setOpenSkillForm] = useState(false);
  const [openCertForm, setOpenCertForm] = useState(false);
  const [openExpForm, setOpenExpForm] = useState(false);
  const [openGoalDialog, setOpenGoalDialog] = useState(false);

  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      setError("Failed to load profile. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      setGoalsLoading(true);
      const res = await axios.get(`http://localhost:8080/api/goals/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(Array.isArray(res.data) ? res.data : []);
      setGoalsError(null);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      setGoalsError("Failed to load goals. Please try again.");
      setGoals([]);
    } finally {
      setGoalsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchGoals();
  }, []);

  const handleDeleteSkill = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/api/profile/${userId}/skills/${index}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
    } catch (err) {
      console.error("Failed to delete skill", err);
      setError("Failed to delete skill");
    }
  };

  const handleToggleGoalCompletion = async (goalId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8080/api/goals/${goalId}`, 
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGoals();
    } catch (err) {
      console.error('Failed to update goal status:', err);
      setGoalsError("Failed to update goal status");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    border: '1px solid #e0e0e0'
  }));

  const SectionHeader = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: '1.25rem',
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main
    }
  }));

  const ProfileHeader = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundColor: '#2877ff',
    paddingBottom: theme.spacing(8),
    marginBottom: theme.spacing(6),
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#e0e0e0'
    }
  }));

  const ProfileContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    marginTop: theme.spacing(-8),
    zIndex: 1
  }));

  const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: '4px solid white',
    boxShadow: theme.shadows[3],
    marginBottom: theme.spacing(2)
  }));

  const getChartData = () => {
    if (!profile) return [];
    
    return [
      { name: 'Skills', value: profile.skills.length },
      { name: 'Experiences', value: profile.experiences.length },
      { name: 'Certifications', value: profile.certifications.length },
      { name: 'Active Goals', value: goals.filter(g => !g.completed).length },
      { name: 'Completed Goals', value: goals.filter(g => g.completed).length }
    ];
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button variant="contained" onClick={fetchProfile}>Retry</Button>
      </Container>
    );
  }

  if (!profile) return null;

  const chartData = getChartData();

  return (
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 2, sm: 3 }, maxWidth: '100%' }}>
      {/* Profile Header Section */}
      <Navbar/>
      <ProfileHeader>
        <Box sx={{ height: '200px', backgroundColor: '#2877ff' }}></Box>
        
        <ProfileContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', pl: 3 }}>
                <ProfileAvatar 
                  sx={{ 
                    fontSize: '3.5rem',
                    bgcolor: 'primary.main',
                    color: 'common.white'
                  }}
                >
                  {profile.name.charAt(0)}
                </ProfileAvatar>
                
                <Box sx={{ ml: 3, mb: 2 }}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {profile.name}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                    {profile.headline}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    {profile.location && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} /> {profile.location}
                      </Typography>
                    )}
                    
                    {profile.website && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <Link fontSize="small" sx={{ mr: 0.5 }} /> 
                        <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                           target="_blank" rel="noopener noreferrer"
                           style={{ textDecoration: 'none', color: 'inherit' }}>
                          {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pr: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setOpenEditForm(true)}
                sx={{ 
                  mb: 2,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#fff',
                  borderColor: '#fff',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  },
                }}
              >
                Edit profile
              </Button>
            </Grid>
          </Grid>
        </ProfileContent>
      </ProfileHeader>

      {/* Main Content */}
      <Grid container spacing={3} sx={{ maxWidth: '100%', margin: 0 }}>
        {/* Left Column - Main Profile Content */}
        <Grid item xs={12} lg={8} xl={9} sx={{ pr: { md: 2 } }}>
          {/* About Section */}
          <StyledCard>
            <CardContent>
              <SectionHeader variant="h5">
                About
              </SectionHeader>
              {profile.bio ? (
                <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {profile.bio}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No information provided
                </Typography>
              )}
            </CardContent>
          </StyledCard>

          {/* Activity Tabs */}
          <Paper sx={{ mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Experience" icon={<Work />} iconPosition="start" />
              <Tab label="Skills" icon={<Code />} iconPosition="start" />
              <Tab label="Education" icon={<School />} iconPosition="start" />
              <Tab label="Goals" icon={<Person />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader variant="h5">
                      Experience
                    </SectionHeader>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setOpenExpForm(true)}
                      sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                      Add experience
                    </Button>
                  </Box>
                  
                  {profile.experiences.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 4,
                      textAlign: 'center'
                    }}>
                      <Work sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        You haven't added any experience yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Showcase your work history and professional background
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenExpForm(true)}
                        sx={{ mt: 2, borderRadius: '20px', textTransform: 'none' }}
                      >
                        Add experience
                      </Button>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {profile.experiences.map((exp, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                            <Box sx={{ 
                              width: '100%',
                              display: 'flex',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                borderRadius: '8px'
                              }
                            }}>
                              <Box sx={{ 
                                minWidth: '56px', 
                                display: 'flex', 
                                justifyContent: 'center',
                                pt: 0.5
                              }}>
                                <Work sx={{ color: 'primary.main' }} />
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {exp.title}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                  {exp.company}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {exp.startDate} - {exp.endDate || "Present"} · 
                                  {exp.startDate && exp.endDate ? 
                                    ` ${new Date(exp.endDate).getFullYear() - new Date(exp.startDate).getFullYear()} yrs` : 
                                    ''}
                                </Typography>
                                {exp.description && (
                                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                                    {exp.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </ListItem>
                          {index < profile.experiences.length - 1 && (
                            <Divider component="li" sx={{ mx: 6 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </StyledCard>
            )}

            {activeTab === 1 && (
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader variant="h5">
                      Skills
                    </SectionHeader>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setOpenSkillForm(true)}
                      sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                      Add skill
                    </Button>
                  </Box>
                  
                  {profile.skills.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 4,
                      textAlign: 'center'
                    }}>
                      <Code sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        You haven't added any skills yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Highlight your professional skills and technologies you know
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenSkillForm(true)}
                        sx={{ mt: 2, borderRadius: '20px', textTransform: 'none' }}
                      >
                        Add skill
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {profile.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={() => handleDeleteSkill(index)}
                          deleteIcon={<Delete fontSize="small" />}
                          sx={{ 
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            backgroundColor: 'primary.lighter', // Optional if using theme
                            '& .MuiChip-deleteIcon': {
                              color: 'primary.main',
                              '&:hover': {
                                color: 'error.main'
                            // borderRadius: '4px',
                            // '& .MuiChip-deleteIcon': {
                            //   color: 'text.secondary',
                            //   '&:hover': {
                            //     color: 'error.main'
                              }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            )}

            {activeTab === 2 && (
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader variant="h5">
                      Education & Certifications
                    </SectionHeader>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setOpenCertForm(true)}
                      sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                      Add certification
                    </Button>
                  </Box>
                  
                  {profile.certifications.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 4,
                      textAlign: 'center'
                    }}>
                      <School sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        You haven't added any certifications yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Show your professional certifications and educational achievements
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenCertForm(true)}
                        sx={{ mt: 2, borderRadius: '20px', textTransform: 'none' }}
                      >
                        Add certification
                      </Button>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {profile.certifications.map((cert, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                            <Box sx={{ 
                              width: '100%',
                              display: 'flex',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                borderRadius: '8px'
                              }
                            }}>
                              <Box sx={{ 
                                minWidth: '56px', 
                                display: 'flex', 
                                justifyContent: 'center',
                                pt: 0.5
                              }}>
                                <School sx={{ color: 'primary.main' }} />
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {cert.name}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                  {cert.issuer}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Issued: {cert.date}
                                </Typography>
                                {cert.credentialId && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Credential ID: {cert.credentialId}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </ListItem>
                          {index < profile.certifications.length - 1 && (
                            <Divider component="li" sx={{ mx: 6 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </StyledCard>
            )}

            {activeTab === 3 && (
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionHeader variant="h5">
                      Learning Goals
                    </SectionHeader>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setOpenGoalDialog(true)}
                      sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                      Add goal
                    </Button>
                  </Box>
                  
                  {goalsLoading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                      <CircularProgress size={30} />
                    </Box>
                  ) : goalsError ? (
                    <Alert severity="error" sx={{ mb: 2 }}>{goalsError}</Alert>
                  ) : goals.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 4,
                      textAlign: 'center'
                    }}>
                      <Person sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        You haven't set any learning goals yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Track your professional development with learning goals
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenGoalDialog(true)}
                        sx={{ mt: 2, borderRadius: '20px', textTransform: 'none' }}
                      >
                        Add goal
                      </Button>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {goals.map((goal) => (
                        <React.Fragment key={goal._id}>
                          <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                            <Box sx={{ 
                              width: '100%',
                              display: 'flex',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                borderRadius: '8px'
                              }
                            }}>
                              <IconButton 
                                onClick={() => handleToggleGoalCompletion(goal._id, goal.completed)}
                                sx={{ mr: 1, alignSelf: 'flex-start' }}
                                size="small"
                              >
                                {goal.completed ? 
                                  <CheckCircle color="success" fontSize="small" /> : 
                                  <RadioButtonUnchecked fontSize="small" />}
                              </IconButton>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography 
                                  variant="subtitle1" 
                                  sx={{ 
                                    fontWeight: 600,
                                    textDecoration: goal.completed ? 'line-through' : 'none',
                                    color: goal.completed ? 'text.disabled' : 'text.primary'
                                  }}
                                >
                                  {goal.title}
                                </Typography>
                                {goal.description && (
                                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                                    {goal.description}
                                  </Typography>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                                  </Typography>
                                  <Box sx={{ 
                                    ml: 2,
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '12px',
                                    backgroundColor: goal.completed ? 'success.light' : 'warning.light',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}>
                                    <Typography variant="caption" sx={{ 
                                      fontWeight: 600,
                                      color: goal.completed ? 'success.dark' : 'warning.dark'
                                    }}>
                                      {goal.completed ? 'Completed' : 'In Progress'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </ListItem>
                          <Divider component="li" sx={{ mx: 6 }} />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </StyledCard>
            )}
          </Box>
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid item xs={12} lg={4} xl={3}>
          {/* Profile Stats Card */}
          <StyledCard>
            <CardContent>
              <SectionHeader variant="h5">
                Profile Stats
              </SectionHeader>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Skills</Typography>
                  <Typography variant="body2" fontWeight={600}>{profile.skills.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Experiences</Typography>
                  <Typography variant="body2" fontWeight={600}>{profile.experiences.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Certifications</Typography>
                  <Typography variant="body2" fontWeight={600}>{profile.certifications.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Active Goals</Typography>
                  <Typography variant="body2" fontWeight={600}>{goals.filter(g => !g.completed).length}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Profile Completion</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {
                      Math.min(
                        Math.floor(
                          (profile.skills.length > 0 ? 20 : 0) +
                          (profile.experiences.length > 0 ? 20 : 0) +
                          (profile.certifications.length > 0 ? 20 : 0) +
                          (goals.length > 0 ? 20 : 0) +
                          (profile.bio ? 20 : 0)
                        ),
                        100
                      )
                    }%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Skills Distribution Card */}
          <StyledCard >
            <CardContent >
              <SectionHeader variant="h5">
                Skills Distribution
              </SectionHeader>
              <Box sx={{ height: '300px', width: '700px' } }>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} items`, 'Count']}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* All Dialog Forms */}
      <ProfileEditDialog 
        open={openEditForm} 
        onClose={() => setOpenEditForm(false)} 
        userId={userId} 
        onUpdated={fetchProfile} 
      />
      
      <SkillFormDialog 
        open={openSkillForm} 
        onClose={() => setOpenSkillForm(false)} 
        userId={userId} 
        onAdded={fetchProfile} 
      />
      
      <CertificationFormDialog 
        open={openCertForm} 
        onClose={() => setOpenCertForm(false)} 
        userId={userId} 
        onAdded={fetchProfile} 
      />
      
      <ExperienceFormDialog 
        open={openExpForm} 
        onClose={() => setOpenExpForm(false)} 
        userId={userId} 
        onAdded={fetchProfile} 
      />
      
      <LearningGoalFormDialog 
        open={openGoalDialog} 
        onClose={() => setOpenGoalDialog(false)} 
        userId={userId} 
        onAdded={fetchGoals} 
      />
    </Container>
  );
};

// Reusable Dialog Components
const ProfileEditDialog = ({ open, onClose, userId, onUpdated }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        Edit Profile
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <ProfileEdit 
        userId={userId} 
        onUpdated={() => { 
          onUpdated(); 
          onClose(); 
        }} 
      />
    </DialogContent>
  </Dialog>
);

const SkillFormDialog = ({ open, onClose, userId, onAdded }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        Add Skill
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <SkillForm 
        userId={userId} 
        onAdded={() => { 
          onAdded(); 
          onClose(); 
        }} 
      />
    </DialogContent>
  </Dialog>
);

const CertificationFormDialog = ({ open, onClose, userId, onAdded }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        Add Certification
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <CertificationForm 
        userId={userId} 
        onAdded={() => { 
          onAdded(); 
          onClose(); 
        }} 
      />
    </DialogContent>
  </Dialog>
);

const ExperienceFormDialog = ({ open, onClose, userId, onAdded }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        Add Experience
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <ExperienceForm 
        userId={userId} 
        onAdded={() => { 
          onAdded(); 
          onClose(); 
        }} 
      />
    </DialogContent>
  </Dialog>
);

const LearningGoalFormDialog = ({ open, onClose, userId, onAdded }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        Add Learning Goal
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <LearningGoalForm 
        userId={userId} 
        onAdded={() => {
          onAdded(); 
          onClose();
        }} 
      />
    </DialogContent>
  </Dialog>
);

export default ProfileView;