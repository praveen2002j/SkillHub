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
    proof: null,
    milestoneProgress: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const DEFAULT_PROGRESS = 100;
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
      const pt = parseFloat(formData.practiceTime);
      if (isNaN(pt) || pt <= 0) {
        newErrors.practiceTime = 'Please enter a positive number of hours';
      }

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
      if (!formData.proof)                  newErrors.proof = 'Proof image is required';
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
  
    if (!validateForm()) return;
    setIsSubmitting(true);
  
    // pull user info
    const userID = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');
    if (!userID || !fullName) {
      alert('Please log in to submit your learning progress.');
      return window.location.href = '/';
    }
  
      // build a FormData and include the logged-in user info
  const payload = new FormData();
  payload.append('userID', userID);
  payload.append('fullName', fullName);

  // now append all other fields (skipping the file for now)
  Object.entries(formData).forEach(([key, val]) => {
    if (key === 'proof') return;
    payload.append(key, val);
  });

  // finally append the proof image
  if (formData.proof instanceof File) {
     payload.append('proofFile', formData.proof);   
  }

  
    try {
      const token = localStorage.getItem('psnToken');
      if (!token) {
        alert('You are not logged in. Please sign in.');
        return window.location.href = '/signin';
      }
       // <<< API CALL: create new record (201 Created) >>>
      const res = await fetch('http://localhost:8080/learningProgress', {
        method: 'POST',   // ← HTTP method
        headers: {
          Authorization: `Bearer ${token}`   // ← auth header
        },
        body: payload  // ← FormData (multipart/form-data)
      });
    // … handle response …
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Upload failed');
      }
  
      alert('Learning progress added successfully!');
      // reset form
      setFormData({
        title: '', description: '', templateName: '',
        learningSkills: '', date: '', tutorialName: '', duration: '',
        completedProgress: '', keyTakeaways: '', tutorialLink: '',
        skillName: '', proficiencyLevel: '', practiceTime: '',
        newProgress: '', confidenceLevel: '',
        milestoneName: '', dateAchieved: '', proof: null,
        milestoneProgress: '', notes: ''
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred while adding learning progress.');
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
                      type="number" 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 4"
                      min="0.1"        /* disallow zero or negative */
                      step="0.1"       /* allow decimal hours */
                      required
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
                
                <div className="form-group">
                  <label htmlFor="completedProgress">Completed Progress (%)</label>
                  <input
                    id="completedProgress"
                    type="number"
                    name="completedProgress"
                    value={DEFAULT_PROGRESS}
                    readOnly                   // ← makes it non‐editable
                    className="form-control"   // ← your existing styling
                  />
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
                    <label className="form-label">Practice Time (hrs)*</label>
                    <input 
                      type="number"
                      name="practiceTime"
                      value={formData.practiceTime || ''}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 4"
                      min="0.1"       /* disallow zero or negative */
                      step="0.1"      /* allow decimal hours */
                      required
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
                  <div className="form-group">
                  <label htmlFor="completedProgress">Completed Progress (%)</label>
                  <input
                    id="completedProgress"
                    type="number"
                    name="completedProgress"
                    value={DEFAULT_PROGRESS}
                    readOnly                   // ← makes it non‐editable
                    className="form-control"   // ← your existing styling
                  />
                </div>
                </div>
                
                <div className={`form-group ${errors.proof ? 'has-error' : ''}`}>
                  <label className="form-label">Proof (image upload)*</label>
                  <input
                    type="file"
                    name="proofFile"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      setFormData({ ...formData, proof: file });
                      if (errors.proof) setErrors({ ...errors, proof: '' });
                    }}
                    className="form-input"
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
