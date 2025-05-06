import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaBook, FaStar, FaFlagCheckered, FaLink, FaCalendarAlt, FaClock, FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './MyLearningProgress.css';
import LearningNavbar from '../components/LearningNavbar';




ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MyLearningProgress() {
  const [learningProgress, setLearningProgress] = useState([]);
  const [userID, setUserID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // ✅ Matches what's set during login
    console.log("LocalStorage userID:", storedUserId);

    if (storedUserId) {
      setUserID(storedUserId); // ✅ this is what sets the userID for use in fetch
    } else {
      console.error('No userId found in local storage');
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    console.log("LocalStorage userID:", storedUserId);
    setUserID(storedUserId);
  
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('psnToken');
        if (!token) {
          alert('You are not logged in. Please sign in.');
          return;
        }
  
        const response = await fetch('http://localhost:8080/learningProgress', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          data.forEach(item => {
            console.log("Item userID from backend:", item.userID);
            console.log("Compare with local userID:", storedUserId);
          });
          
          const filteredData = data.filter(item => item.userID === storedUserId);
          console.log("Filtered data:", filteredData);
          setLearningProgress(filteredData);
        } else {
          console.error('Failed to fetch learning progress data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning progress?')) {
      try {
        const token = localStorage.getItem('psnToken'); // ✅ Retrieve token
  
        if (!token) {
          alert('You are not logged in. Please sign in.');
          window.location.href = '/signin';
          return;
        }
  
        const response = await fetch(`http://localhost:8080/learningProgress/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // ✅ Include token here
          }
        });
  
        if (response.ok) {
          setLearningProgress(prev => prev.filter(progress => progress.id !== id));
          alert('Learning progress deleted successfully!');
        } else {
          alert('Failed to delete learning progress.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting learning progress.');
      }
    }
  };
  

  const getMonthlySkillCounts = () => {
    const completedTutorials = learningProgress.filter(
      item => item.templateName === 'Completed Tutorials'
    );

    const monthlyCounts = completedTutorials.reduce((acc, item) => {
      if (!item.date) return acc;
      const date = new Date(item.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!acc[monthYear]) {
        acc[monthYear] = {
          monthKey: monthYear,
          monthName: monthName,
          count: 0
        };
      }
      acc[monthYear].count += 1;
      return acc;
    }, {});

    return Object.values(monthlyCounts)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  };

  const monthlyData = getMonthlySkillCounts();
  const chartData = {
    labels: monthlyData.map(item => item.monthName),
    datasets: [
      {
        label: 'Skills Completed',
        data: monthlyData.map(item => item.count),
        backgroundColor: 'rgba(62, 169, 159, 0.6)',
        borderColor: 'rgba(62, 169, 159, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Learning Progress',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Skills',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (value % 1 === 0) {
              return value;
            }
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  const getTemplateColor = (templateName) => {
    switch(templateName) {
      case 'Completed Tutorials':
        return '#3ea99f';
      case 'New Skill Learned':
        return '#5d8bf4';
      case 'Milestone Achieved':
        return '#ff7b54';
      default:
        return '#3ea99f';
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
    <div className="my-learning-progress">
     <LearningNavbar />


      <div className="progress-chart">
        <div className="progress-chart__container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

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

                  <div className="progress-card__actions">
                    <button 
                      className="progress-card__button progress-card__button--edit"
                      onClick={() => navigate(`/updateLearningProgress/${item.id}`)}

                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="progress-card__button progress-card__button--delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="progress-empty">
              <p className="progress-empty__message">
                {userID
                  ? 'No relevant learning progress found.'
                  : 'User ID not found in local storage.'}
              </p>
              <button
                onClick={() => navigate('/addLearningProgress')}
                className="progress-empty__link"
              >
                <FaPlus /> Create a new learning progress
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyLearningProgress;