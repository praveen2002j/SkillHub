import React, { useEffect, useState } from 'react';
import { FaBook, FaStar, FaFlagCheckered, FaLink, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';
import './Learn.css';
import LearningNavbar from '../components/LearningNavbar';


function AllLearningProgress() {
  const [learningProgress, setLearningProgress] = useState([]);

  ///////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/learningProgress', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('psnToken')}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLearningProgress(data);
        } else {
          console.error('Failed to fetch learning progress data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const getTemplateColor = (templateName) => {
    switch(templateName) {
      case 'Completed Tutorials':
        return '#3ea99f'; // Teal
      case 'New Skill Learned':
        return '#5d8bf4'; // Blue
      case 'Milestone Achieved':
        return '#ff7b54'; // Orange
      default:
        return '#3ea99f'; // Default teal
    }
  };

  const getTemplateIcon = (templateName) => {
    switch(templateName) {
      case 'Completed Tutorials':
        return <FaBook className="progress-card__icon" />;
      case 'New Skill Learned':
        return <FaStar className="progress-card__icon" />;
      case 'Milestone Achieved':
        return <FaFlagCheckered className="progress-card__icon" />;
      default:
        return <FaBook className="progress-card__icon" />;
    }
  };

  return (
    <div className="learning-progress">
     <LearningNavbar />

      <div className='progress-container'>
        <div className='progress-container__inner'>
          {learningProgress.length > 0 ? (
            <div className="progress-grid">
              {learningProgress.map((item) => (
                <div 
                  key={item.id} 
                  className="progress-card"
                  style={{ borderTop: `4px solid ${getTemplateColor(item.templateName)}` }}
                >
                  <div className="progress-card__header">
                    {getTemplateIcon(item.templateName)}
                    <h3 className="progress-card__title">{item.title}</h3>
                  </div>
                  
                  <div className="progress-card__meta">
                    <span className="progress-card__meta-item">
                      <FaUser className="progress-card__meta-icon" />
                      {item.fullName}
                    </span>
                    <span className="progress-card__meta-item">
                      <span className="progress-card__template" style={{ backgroundColor: getTemplateColor(item.templateName) }}>
                        {item.templateName}
                      </span>
                    </span>
                  </div>
                  
                  <p className="progress-card__description">{item.description}</p>
                  
                  {/* Completed Tutorials */}
                  {item.templateName === 'Completed Tutorials' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <FaCalendarAlt className="progress-card__detail-icon" />
                        <span>Date: {item.date}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span>Learning Skills: {item.learningSkills}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span>Tutorial Name: {item.tutorialName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaClock className="progress-card__detail-icon" />
                        <span>Duration: {item.duration}</span>
                      </div>
                      <div className="progress-card__progress-bar">
                        <div 
                          className="progress-card__progress-fill" 
                          style={{ 
                            width: `${item.completedProgress}%`,
                            backgroundColor: getTemplateColor(item.templateName)
                          }}
                        >
                          {item.completedProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span>Key Takeaways: {item.keyTakeaways}</span>
                      </div>
                      {item.tutorialLink && (
                        <div className="progress-card__detail-item">
                          <FaLink className="progress-card__detail-icon" />
                          <a href={item.tutorialLink} target="_blank" rel="noopener noreferrer" className="progress-card__link">
                            Tutorial Link
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* New Skill Learned */}
                  {item.templateName === 'New Skill Learned' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <span>Skill Name: {item.skillName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span>Proficiency Level: {item.proficiencyLevel}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaClock className="progress-card__detail-icon" />
                        <span>Practice Time: {item.practiceTime}</span>
                      </div>
                      <div className="progress-card__progress-bar">
                        <div 
                          className="progress-card__progress-fill" 
                          style={{ 
                            width: `${item.newProgress}%`,
                            backgroundColor: getTemplateColor(item.templateName)
                          }}
                        >
                          {item.newProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span>Confidence Level: {item.confidenceLevel}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Milestone Achieved */}
                  {item.templateName === 'Milestone Achieved' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <span>Milestone Name: {item.milestoneName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaCalendarAlt className="progress-card__detail-icon" />
                        <span>Date Achieved: {item.dateAchieved}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span>Proof: {item.proof}</span>
                      </div>
                      <div className="progress-card__progress-bar">
                        <div 
                          className="progress-card__progress-fill" 
                          style={{ 
                            width: `${item.milestoneProgress}%`,
                            backgroundColor: getTemplateColor(item.templateName)
                          }}
                        >
                          {item.milestoneProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span>Notes: {item.notes}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="progress-empty">
              <p className="progress-empty__message">No learning progress data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllLearningProgress;