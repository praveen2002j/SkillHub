import React, { useEffect, useState } from 'react';
import {
  FaBook,
  FaStar,
  FaFlagCheckered,
  FaLink,
  FaCalendarAlt,
  FaClock,
  FaUser
} from 'react-icons/fa';
import './Learn.css';
import LearningNavbar from '../components/LearningNavbar';

// pick bar‐color from a 0–100 value
const getProgressColor = val => {
  const n = parseInt(val, 10) || 0;
  if (n < 34)   return '#e74c3c';   // red
  if (n < 67)   return '#f39c12';   // orange
  return '#2ecc71';                 // green
};


function AllLearningProgress() {
  const [learningProgress, setLearningProgress] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/learningProgress', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('psnToken')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Fetch failed');
        setLearningProgress(await res.json());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const getTemplateColor = (name) => {
    switch (name) {
      case 'Completed Tutorials': return '#3ea99f';
      case 'New Skill Learned':    return '#5d8bf4';
      case 'Milestone Achieved':   return '#ff7b54';
      default:                     return '#3ea99f';
    }
  };

  const getTemplateIcon = (name) => {
    switch (name) {
      case 'Completed Tutorials': return <FaBook className="progress-card__icon"/>
      case 'New Skill Learned':    return <FaStar className="progress-card__icon"/>
      case 'Milestone Achieved':   return <FaFlagCheckered className="progress-card__icon"/>
      default:                     return <FaBook className="progress-card__icon"/>
    }
  };

  return (
    <div className="learning-progress">
      <LearningNavbar />

      <div className="progress-container">
        <div className="progress-container__inner">
          {learningProgress.length > 0 ? (
            <div className="progress-grid">
              {learningProgress.map(item => (
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
                      <FaUser className="progress-card__meta-icon"/>
                      <span className="field-value">{item.fullName}</span>
                    </span>
                    <span className="progress-card__meta-item">
                      <span
                        className="progress-card__template"
                        style={{ backgroundColor: getTemplateColor(item.templateName) }}
                      >
                        {item.templateName}
                      </span>
                    </span>
                  </div>

                  <p className="progress-card__description">
                    <span className="field-label">Description:</span>{' '}
                    <span className="field-value">{item.description}</span>
                  </p>

                  {/* Completed Tutorials */}
                  {item.templateName === 'Completed Tutorials' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <FaCalendarAlt className="progress-card__detail-icon"/>
                        <span className="field-label">Date:</span>{' '}
                        <span className="field-value">{item.date}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="field-label">Learning Skills:</span>{' '}
                        <span className="field-value">{item.learningSkills}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="field-label">Tutorial Name:</span>{' '}
                        <span className="field-value">{item.tutorialName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaClock className="progress-card__detail-icon"/>
                        <span className="field-label">Duration:</span>{' '}
                        <span className="field-value">{item.duration}</span>
                      </div>
                      <div className="progress-card__progress-bar">
                        <div
                          className="progress-card__progress-fill"
                          style={{
                            width: `${item.completedProgress}%`,
                             backgroundColor: '#2ecc71'
                          }}
                        >
                          {item.completedProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="field-label">Key Takeaways:</span>{' '}
                        <span className="field-value">{item.keyTakeaways}</span>
                      </div>
                      {item.tutorialLink && (
                        <div className="progress-card__detail-item">
                          <FaLink className="progress-card__detail-icon"/>
                          <a
                            href={item.tutorialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="progress-card__link"
                          >
                            <span className="field-label">Tutorial Link:</span>{' '}
                            <span className="field-value">Open</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Skill Learned */}
                  {item.templateName === 'New Skill Learned' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <span className="field-label">Skill Name:</span>{' '}
                        <span className="field-value">{item.skillName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="field-label">Proficiency Level:</span>{' '}
                        <span className="field-value">{item.proficiencyLevel}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaClock className="progress-card__detail-icon"/>
                        <span className="field-label">Practice Time:</span>{' '}
                        <span className="field-value">{item.practiceTime}</span>
                      </div>
                      <div className="progress-card__progress-bar">
                        <div
                          className="progress-card__progress-fill"
                          style={{
                            width: `${item.newProgress}%`,
                            backgroundColor: getProgressColor(item.newProgress)
                          }}
                        >
                          {item.newProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="field-label">Confidence Level:</span>{' '}
                        <span className="field-value">{item.confidenceLevel}</span>
                      </div>
                    </div>
                  )}

                  {/* Milestone Achieved */}
                  {item.templateName === 'Milestone Achieved' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <span className="field-label">Milestone Name:</span>{' '}
                        <span className="field-value">{item.milestoneName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaCalendarAlt className="progress-card__detail-icon"/>
                        <span className="field-label">Date Achieved:</span>{' '}
                        <span className="field-value">{item.dateAchieved}</span>
                      </div>
                      <figure className="progress-card__proof-figure">
                        <figcaption className="progress-card__proof-label">Proof:</figcaption>
                        {item.proofUrl
                          ? (
                            <img
                              src={
                                item.proofUrl.startsWith('http')
                                  ? item.proofUrl
                                  : `http://localhost:8080${item.proofUrl}`
                              }
                              alt="Milestone proof"
                              className="progress-card__proof-image"
                            />
                          )
                          : <span className="progress-card__proof-missing">No proof provided</span>
                        }
                      </figure>
                      <div className="progress-card__progress-bar">
                        <div
                          className="progress-card__progress-fill"
                          style={{
                            width: `${item.milestoneProgress}%`,
                            backgroundColor: '#2ecc71'
                          }}
                        >
                          {item.milestoneProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="field-label">Notes:</span>{' '}
                        <span className="field-value">{item.notes}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="progress-empty">
              <p className="progress-empty__message">
                No learning progress data available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllLearningProgress;
