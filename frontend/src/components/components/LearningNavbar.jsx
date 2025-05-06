// LearningNavbar.js
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaUserGraduate } from 'react-icons/fa';
import './learningNavbar.css'; // (Optional: create this file for styling)

const LearningNavbar = () => {
  return (
    <div className="learning-navbar">
        <div className="nav-left">
            <Link to="/" className="nav-title">SkillHub</Link>
        </div>

        <div className="nav-right">
            <Link to="/allLearningProgress" className="nav-link">All Progress</Link>
            <Link to="/addLearningProgress" className="nav-link">Add Progress</Link>
            <Link to="/myLearningProgress" className="nav-link">My Progress</Link>
            <Link to="/newsfeed" className="nav-link">🏠 Home</Link> {/* ✅ New "Back to Home" Button */}
        </div>
    </div>

  );
};

export default LearningNavbar;
