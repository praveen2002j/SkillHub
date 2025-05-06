import React, { useState } from 'react';
import { FaBook, FaStar, FaFlagCheckered, FaArrowLeft } from 'react-icons/fa';
import './AddLearningProgress.css';
import LearningNavbar from '../components/LearningNavbar';


function AddLearningProgress() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    templateName: '',
    // Completed Tutorials
    learningSkills: '',
    date: '',
    tutorialName: '',
    duration: '',
    completedProgress: '',
    keyTakeaways: '',
    tutorialLink: '',
    // New Skill Learned
    skillName: '',
    proficiencyLevel: '',
    practiceTime: '',
    newProgress: '',
    confidenceLevel: '',
    // Milestone Achieved
    milestoneName: '',
    dateAchieved: '',
    proof: '',
    milestoneProgress: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const handleChange = (e) => {
    const { name, value } = e.target;
    // start by updating the field the user just changed
    const updated = { ...formData, [name]: value };
  
    // if they just switched template, auto-set the right progress to "100"
    if (name === 'templateName') {
      if (value === 'Completed Tutorials') {
        updated.completedProgress  = '100';
      } else if (value === 'Milestone Achieved') {
        updated.milestoneProgress = '100';
      }
    }
  
    setFormData(updated);
  
    // clear any existing error on that field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  

  const validateForm = () => {
    const newErrors = {};
    
    // Common fields validation
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.templateName) newErrors.templateName = 'Please select a template';
    
    // Template-specific validation
    if (formData.templateName === 'Completed Tutorials') {
      if (!formData.learningSkills.trim()) newErrors.learningSkills = 'Learning skills are required';
      if (!formData.date) newErrors.date = 'Date is required';
      if (!formData.tutorialName.trim()) newErrors.tutorialName = 'Tutorial name is required';
      if (!formData.duration || isNaN(formData.duration)) {
        newErrors.duration = 'Please enter a valid number';
      }
      
      if (!formData.completedProgress || isNaN(formData.completedProgress)) {
        newErrors.completedProgress = 'Please enter a valid number (0-100)';
      } else if (formData.completedProgress < 0 || formData.completedProgress > 100) {
        newErrors.completedProgress = 'Progress must be between 0 and 100';
      }
      if (!formData.keyTakeaways.trim()) newErrors.keyTakeaways = 'Key takeaways are required';
      if (formData.tutorialLink && !/^https?:\/\/.+\..+/.test(formData.tutorialLink)) {
        newErrors.tutorialLink = 'Please enter a valid URL';
      }
    }
    
    if (formData.templateName === 'New Skill Learned') {
      if (!formData.skillName.trim()) newErrors.skillName = 'Skill name is required';
      if (!formData.proficiencyLevel.trim()) newErrors.proficiencyLevel = 'Proficiency level is required';
      if (!formData.practiceTime.trim()) newErrors.practiceTime = 'Practice time is required';
      if (!formData.newProgress || isNaN(formData.newProgress)) {
        newErrors.newProgress = 'Please enter a valid number (0-100)';
      } else if (formData.newProgress < 0 || formData.newProgress > 100) {
        newErrors.newProgress = 'Progress must be between 0 and 100';
      }
      if (!formData.confidenceLevel.trim()) newErrors.confidenceLevel = 'Confidence level is required';
    }
    
    if (formData.templateName === 'Milestone Achieved') {
      if (!formData.milestoneName.trim()) newErrors.milestoneName = 'Milestone name is required';
      if (!formData.dateAchieved) newErrors.dateAchieved = 'Date achieved is required';
      if (!formData.proof.trim()) newErrors.proof = 'Proof is required';
      if (!formData.milestoneProgress || isNaN(formData.milestoneProgress)) {
        newErrors.milestoneProgress = 'Please enter a valid number (0-100)';
      } else if (formData.milestoneProgress < 0 || formData.milestoneProgress > 100) {
        newErrors.milestoneProgress = 'Progress must be between 0 and 100';
      }
      if (!formData.notes.trim()) newErrors.notes = 'Notes are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Retrieve userID and fullName from local storage
    const userID = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');

    if (!userID || !fullName) {
      alert('Please log in to submit your learning progress.');
      window.location.href = '/';
      return;
    }
    //////
    const data = { ...formData, userID, fullName }; // ✅ This is key!

    try {
      const token = localStorage.getItem('psnToken'); // get token from localStorage
      /////
      if (!token) {
        alert('You are not logged in. Please sign in.');
        window.location.href = '/signin'; // optional redirect
        return;
      }
      

      const response = await fetch('http://localhost:8080/learningProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // add this line
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Learning progress added successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          templateName: '',
          learningSkills: '',
          date: '',
          tutorialName: '',
          duration: '',
          completedProgress: '',
          keyTakeaways: '',
          tutorialLink: '',
          skillName: '',
          proficiencyLevel: '',
          practiceTime: '',
          newProgress: '',
          confidenceLevel: '',
          milestoneName: '',
          dateAchieved: '',
          proof: '',
          milestoneProgress: '',
          notes: '',
        });
        setErrors({});
      } else {
        //////
        const errorText = await response.text(); // fallback to text
        alert(errorText || 'Failed to add learning progress.');
        
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding learning progress.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTemplateIcon = () => {
    switch(formData.templateName) {
      case 'Completed Tutorials':
        return <FaBook className="form-template-icon" />;
      case 'New Skill Learned':
        return <FaStar className="form-template-icon" />;
      case 'Milestone Achieved':
        return <FaFlagCheckered className="form-template-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="add-learning-progress">
      <LearningNavbar />


      <div className="page-container">
        <div className="form-wrapper">

          <h2 className="form-title">
            {getTemplateIcon()}
            Add New Learning Progress
          </h2>
          
          <form onSubmit={handleSubmit} className="progress-form">
            <div className="form-section">
              <h3 className="form-section-title">Basic Information</h3>
              <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
                <label className="form-label">Title*</label>
                <input 
                  type='text' 
                  name='title' 
                  value={formData.title} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter a title for your progress"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>
              
              <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
                <label className="form-label">Description*</label>
                <textarea 
                  name='description' 
                  value={formData.description} 
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe your learning progress"
                  rows="4"
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
              
              <div className={`form-group ${errors.templateName ? 'has-error' : ''}`}>
                <label className="form-label">Template*</label>
                <select 
                  name='templateName' 
                  value={formData.templateName} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value=''>Select Template</option>
                  <option value='Completed Tutorials'>Completed Tutorials</option>
                  <option value='New Skill Learned'>New Skill Learned</option>
                  <option value='Milestone Achieved'>Milestone Achieved</option>
                </select>
                {errors.templateName && <span className="error-message">{errors.templateName}</span>}
              </div>
            </div>

            {/* Completed Tutorials Template */}
            {formData.templateName === 'Completed Tutorials' && (
              <div className="form-section">
                <h3 className="form-section-title">
                  <FaBook className="form-section-icon" />
                  Completed Tutorial Details
                </h3>
                
                <div className={`form-group ${errors.learningSkills ? 'has-error' : ''}`}>
                  <label className="form-label">Learning Skills*</label>
                  <input 
                    type='text' 
                    name='learningSkills' 
                    value={formData.learningSkills} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="What skills did you learn?"
                  />
                  {errors.learningSkills && <span className="error-message">{errors.learningSkills}</span>}
                </div>
                
                <div className="form-row">
                  <div className={`form-group ${errors.date ? 'has-error' : ''}`}>
                    <label className="form-label">Date*</label>
                    <input 
                      type='date' 
                      name='date' 
                      value={formData.date} 
                      onChange={handleChange}
                      className="form-input"
                      max={today} // Restrict to today and previous dates
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                  </div>
                  
                  <div className={`form-group ${errors.duration ? 'has-error' : ''}`}>
                    <label className="form-label">Duration (Hours)*</label>
                    <input 
                      type='number' 
                      name='duration' 
                      value={formData.duration} 
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 4"
                      min="0"
                      step="0.5" // optional if you want to allow 0.5-hour steps
                    />
                    {errors.duration && <span className="error-message">{errors.duration}</span>}
                  </div>

                </div>
                
                <div className={`form-group ${errors.tutorialName ? 'has-error' : ''}`}>
                  <label className="form-label">Tutorial Name*</label>
                  <input 
                    type='text' 
                    name='tutorialName' 
                    value={formData.tutorialName} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Name of the tutorial"
                  />
                  {errors.tutorialName && <span className="error-message">{errors.tutorialName}</span>}
                </div>
                
                <div className={`form-group ${errors.completedProgress ? 'has-error' : ''}`}>
                  <label className="form-label">Progress (%)*</label>
                  <input 
                    type='number' 
                    name='completedProgress' 
                    value={formData.completedProgress} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0-100"
                    min="0"
                    max="100"
                    disabled={formData.templateName === 'Completed Tutorials'}
                  />
                  {errors.completedProgress && <span className="error-message">{errors.completedProgress}</span>}
                </div>
                
                <div className={`form-group ${errors.keyTakeaways ? 'has-error' : ''}`}>
                  <label className="form-label">Key Takeaways*</label>
                  <textarea 
                    name='keyTakeaways' 
                    value={formData.keyTakeaways} 
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="What were your main learnings?"
                    rows="4"
                  />
                  {errors.keyTakeaways && <span className="error-message">{errors.keyTakeaways}</span>}
                </div>
                
                <div className={`form-group ${errors.tutorialLink ? 'has-error' : ''}`}>
                  <label className="form-label">Tutorial Link</label>
                  <input 
                    type='url' 
                    name='tutorialLink' 
                    value={formData.tutorialLink} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/tutorial"
                  />
                  {errors.tutorialLink && <span className="error-message">{errors.tutorialLink}</span>}
                </div>
              </div>
            )}

            {/* New Skill Learned Template */}
            {formData.templateName === 'New Skill Learned' && (
              <div className="form-section">
                <h3 className="form-section-title">
                  <FaStar className="form-section-icon" />
                  New Skill Details
                </h3>
                
                <div className={`form-group ${errors.skillName ? 'has-error' : ''}`}>
                  <label className="form-label">Skill Name*</label>
                  <input 
                    type='text' 
                    name='skillName' 
                    value={formData.skillName} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Name of the skill you learned"
                  />
                  {errors.skillName && <span className="error-message">{errors.skillName}</span>}
                </div>
                
                <div className="form-row">
                  <div className={`form-group ${errors.proficiencyLevel ? 'has-error' : ''}`}>
                    <label className="form-label">Proficiency Level*</label>
                    <select
                      name='proficiencyLevel' 
                      value={formData.proficiencyLevel} 
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    {errors.proficiencyLevel && <span className="error-message">{errors.proficiencyLevel}</span>}
                  </div>
                  
                  <div className={`form-group ${errors.practiceTime ? 'has-error' : ''}`}>
                    <label className="form-label">Practice Time*</label>
                    <input 
                      type='text' 
                      name='practiceTime' 
                      value={formData.practiceTime} 
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 10 hours"
                    />
                    {errors.practiceTime && <span className="error-message">{errors.practiceTime}</span>}
                  </div>
                </div>
                
                <div className={`form-group ${errors.newProgress ? 'has-error' : ''}`}>
                  <label className="form-label">Progress (%)*</label>
                  <input 
                    type='number' 
                    name='newProgress' 
                    value={formData.newProgress} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0-100"
                    min="0"
                    max="100"
                  />
                  {errors.newProgress && <span className="error-message">{errors.newProgress}</span>}
                </div>
                
                <div className={`form-group ${errors.confidenceLevel ? 'has-error' : ''}`}>
                  <label className="form-label">Confidence Level*</label>
                  <select
                    name='confidenceLevel' 
                    value={formData.confidenceLevel} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.confidenceLevel && <span className="error-message">{errors.confidenceLevel}</span>}
                </div>
              </div>
            )}

            {/* Milestone Achieved Template */}
            {formData.templateName === 'Milestone Achieved' && (
              <div className="form-section">
                <h3 className="form-section-title">
                  <FaFlagCheckered className="form-section-icon" />
                  Milestone Details
                </h3>
                
                <div className={`form-group ${errors.milestoneName ? 'has-error' : ''}`}>
                  <label className="form-label">Milestone Name*</label>
                  <input 
                    type='text' 
                    name='milestoneName' 
                    value={formData.milestoneName} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Name of the milestone"
                  />
                  {errors.milestoneName && <span className="error-message">{errors.milestoneName}</span>}
                </div>
                
                <div className="form-row">
                  <div className={`form-group ${errors.dateAchieved ? 'has-error' : ''}`}>
                    <label className="form-label">Date Achieved*</label>
                    <input 
                      type='date' 
                      name='dateAchieved' 
                      value={formData.dateAchieved} 
                      onChange={handleChange}
                      className="form-input"
                      max={today} // Restrict to today and previous dates
                    />
                    {errors.dateAchieved && <span className="error-message">{errors.dateAchieved}</span>}
                  </div>
                  
                  <div className={`form-group ${errors.milestoneProgress ? 'has-error' : ''}`}>
                    <label className="form-label">Progress (%)*</label>
                    <input 
                      type='number' 
                      name='milestoneProgress' 
                      value={formData.milestoneProgress} 
                      onChange={handleChange}
                      className="form-input"
                      placeholder="0-100"
                      min="0"
                      max="100"
                      disabled={formData.templateName === 'Milestone Achieved'}
                    />
                    {errors.milestoneProgress && <span className="error-message">{errors.milestoneProgress}</span>}
                  </div>
                </div>
                
                <div className={`form-group ${errors.proof ? 'has-error' : ''}`}>
                  <label className="form-label">Proof*</label>
                  <input 
                    type='text' 
                    name='proof' 
                    value={formData.proof} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Evidence of your achievement"
                  />
                  {errors.proof && <span className="error-message">{errors.proof}</span>}
                </div>
                
                <div className={`form-group ${errors.notes ? 'has-error' : ''}`}>
                  <label className="form-label">Notes*</label>
                  <textarea 
                    name='notes' 
                    value={formData.notes} 
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Describe the milestone and its significance"
                    rows="4"
                  />
                  {errors.notes && <span className="error-message">{errors.notes}</span>}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button 
                type='submit' 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Learning Progress'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLearningProgress;