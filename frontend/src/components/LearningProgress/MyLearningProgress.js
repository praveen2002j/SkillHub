// src/MyLearningProgress.js
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  FaBook,
  FaStar,
  FaFlagCheckered,
  FaLink,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEdit,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import './MyLearningProgress.css';
import LearningNavbar from '../components/LearningNavbar';

// pick bar‐color from a 0–100 value
const getProgressColor = val => {
  const n = parseInt(val, 10) || 0;
  if (n < 34)   return '#e74c3c';   // red
  if (n < 67)   return '#f39c12';   // orange
  return '#2ecc71';                 // green
};

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
 
    // read initial filter from ?template=…
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('template') || '';
  const [selectedTemplate, setSelectedTemplate] = useState(initialFilter);
    // ─── build query-suffix for filter persistence ───────────────────
  const filter = searchParams.get('template') || '';
  const qs     = filter ? `?template=${encodeURIComponent(filter)}` : '';

  const [userID, setUserID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserID(storedUserId);
    else console.error('No userId found in local storage');
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter(item => item.userID === storedUserId);
          setLearningProgress(filtered);
        } else {
          console.error('Failed to fetch learning progress data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this learning progress?')) return;
    try {
      const token = localStorage.getItem('psnToken');
      if (!token) {
        alert('You are not logged in. Please sign in.');
        window.location.href = '/signin';
        return;
      }
      const res = await fetch(`http://localhost:8080/learningProgress/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setLearningProgress(prev => prev.filter(p => p.id !== id));
        alert('Deleted successfully!');
      } else {
        alert('Failed to delete.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting.');
    }
  };

  const getMonthlySkillCounts = () => {
    const completed = learningProgress.filter(i => i.templateName === 'Completed Tutorials');
    const counts = completed.reduce((acc, item) => {
      if (!item.date) return acc;
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const name = d.toLocaleString('default', { month:'short', year:'numeric' });
      if (!acc[key]) acc[key] = { monthName: name, count: 0 };
      acc[key].count++;
      return acc;
    }, {});
    return Object.values(counts).sort((a,b)=> a.monthName.localeCompare(b.monthName));
  };

  const monthlyData = getMonthlySkillCounts();
  const chartData = {
    labels: monthlyData.map(i => i.monthName),
    datasets: [{
      label: 'Skills Completed',
      data: monthlyData.map(i => i.count),
      backgroundColor: 'rgba(62,169,159,0.6)',
      borderColor: 'rgba(62,169,159,1)',
      borderWidth: 1
    }]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Learning Progress', font: { size:16 } }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Skills', font: { weight:'bold' } },
        ticks: { stepSize:1 }
      },
      x: { title: { display:true, text:'Month', font:{ weight:'bold' } } }
    }
  };

  const getTemplateColor = name => {
    if (name==='Completed Tutorials') return '#3ea99f';
    if (name==='New Skill Learned') return '#5d8bf4';
    if (name==='Milestone Achieved') return '#ff7b54';
    return '#3ea99f';
  };

  const getTemplateIcon = name => {
    if (name==='Completed Tutorials') return <FaBook className="progress-card__icon"/>;
    if (name==='New Skill Learned') return <FaStar className="progress-card__icon"/>;
    if (name==='Milestone Achieved') return <FaFlagCheckered className="progress-card__icon"/>;
    return <FaBook className="progress-card__icon"/>;
  };


  // filter before render
  const visibleCards = selectedTemplate
  ? learningProgress.filter(p => p.templateName === selectedTemplate)
  : learningProgress;

  return (
    <div className="my-learning-progress">
      <LearningNavbar/>

      <div className="progress-chart">
        <div className="progress-chart__container">
          <Bar data={chartData} options={chartOptions}/>
        </div>
      </div>


      <div className="progress-filter">
        <label htmlFor="templateFilter">Show:</label>
        <select
          id="templateFilter"
          value={selectedTemplate}
          onChange={e => {
            const v = e.target.value;
            setSelectedTemplate(v);
            // update URL: add or remove the ?template= param
            if (v) searchParams.set('template', v);
            else    searchParams.delete('template');
            setSearchParams(searchParams, { replace: true });
          }}
        >
          <option value="">All</option>
          <option value="Completed Tutorials">Completed Tutorials</option>
          <option value="New Skill Learned">New Skill Learned</option>
          <option value="Milestone Achieved">Milestone Achieved</option>
        </select>
      </div>


      <div className='progress-container'>
        <div className='progress-container__inner'>
          {visibleCards.length > 0 ? (
            <div className="progress-grid">
               {visibleCards.map(item => (
                <div
                  key={item.id}
                  className="progress-card"
                  style={{ borderTop:`4px solid ${getTemplateColor(item.templateName)}` }}
                >
                  <div className="progress-card__header">
                    {getTemplateIcon(item.templateName)}
                    <h3 className="progress-card__title">{item.title}</h3>
                  </div>
                  <div className="progress-card__meta">
                    <span className="progress-card__meta-item">
                      <FaUser className="progress-card__meta-icon"/>
                      {item.fullName}
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
                  <p className="progress-card__description">{item.description}</p>

                  {/* Completed Tutorials */}
                  {item.templateName==='Completed Tutorials' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <FaCalendarAlt className="progress-card__detail-icon"/>
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{item.date}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="detail-label">Learning Skills:</span>
                        <span className="detail-value">{item.learningSkills}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="detail-label">Tutorial Name:</span>
                        <span className="detail-value">{item.tutorialName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaClock className="progress-card__detail-icon"/>
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{item.duration} hrs</span>
                      </div>
                      <div className="progress-card__progress-bar">
                        <div
                          className="progress-card__progress-fill"
                          style={{
                            width:`${item.completedProgress}%`,
                            backgroundColor: '#2ecc71'    // always green
                          }}
                        >
                          {item.completedProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="detail-label">Key Takeaways:</span>
                        <span className="detail-value">{item.keyTakeaways}</span>
                      </div>
                      {item.tutorialLink && (
                        <div className="progress-card__detail-item">
                          <FaLink className="progress-card__detail-icon"/>
                          <span className="detail-label">Link:</span>
                          <a
                            href={item.tutorialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="progress-card__link detail-value"
                          >
                            Open Tutorial
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Skill Learned */}
                  {item.templateName==='New Skill Learned' && (
                    <div className="progress-card__details">
                      <div className="progress-card__detail-item">
                        <span className="detail-label">Skill Name:</span>
                        <span className="detail-value">{item.skillName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="detail-label">Proficiency:</span>
                        <span className="detail-value">{item.proficiencyLevel}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaClock className="progress-card__detail-icon"/>
                        <span className="detail-label">Practice:</span>
                        <span className="detail-value">{item.practiceTime}</span>
                      </div>
                      <div className="progress-card__progress-bar">
                        <div
                          className="progress-card__progress-fill"
                          style={{
                            width:`${item.newProgress}%`,
                            backgroundColor: getProgressColor(item.newProgress)
                          }}
                        >
                          {item.newProgress}%
                        </div>
                      </div>
                      <div className="progress-card__detail-item">
                        <span className="detail-label">Confidence:</span>
                        <span className="detail-value">{item.confidenceLevel}</span>
                      </div>
                    </div>
                  )}

                  {/* Milestone Achieved */}
                  {item.templateName==='Milestone Achieved' && (
                     <div className="progress-card__details progress-card__details--scroll">
                      <div className="progress-card__detail-item" >
                        <span className="detail-label">Milestone:</span>
                        <span className="detail-value">{item.milestoneName}</span>
                      </div>
                      <div className="progress-card__detail-item">
                        <FaCalendarAlt className="progress-card__detail-icon"/>
                        <span className="detail-label">Achieved:</span>
                        <span className="detail-value">{item.dateAchieved}</span>
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
                      <div className="progress-card__detail-item" >
                        <span className="detail-label">Notes:</span>
                        <span className="detail-value">{item.notes}</span>
                      </div>
                    </div>
                  )}

                  <div className="progress-card__actions">
                    <button
                      className="progress-card__button progress-card__button--edit"
                      onClick={() => navigate(`/updateLearningProgress/${item.id}${qs}`)}
                    >
                      <FaEdit/> Edit
                    </button>
                    <button
                      className="progress-card__button progress-card__button--delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash/> Delete
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
                onClick={() => navigate(`/addLearningProgress${qs}`)}
                className="progress-empty__link"
              >
                <FaPlus/> Create a new learning progress
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyLearningProgress;
