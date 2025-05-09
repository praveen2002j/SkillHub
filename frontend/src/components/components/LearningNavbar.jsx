// LearningNavbar.js
import { Link, useSearchParams } from 'react-router-dom';
import { FaBook, FaPlus, FaUserGraduate } from 'react-icons/fa';
import './learningNavbar.css';

const LearningNavbar = () => {
  // read the current "template" filter from URL
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('template');
  // build a query string suffix if a filter is present
  const qs = filter ? `?template=${encodeURIComponent(filter)}` : '';

  return (
    <div className="learning-navbar">
      <div className="nav-left">
        <Link to={`/${qs}`} className="nav-title">
          SkillHub
        </Link>
      </div>

      <div className="nav-right">
        <Link to={`/allLearningProgress${qs}`} className="nav-link">
          <FaBook /> All Progress
        </Link>

        <Link to={`/addLearningProgress${qs}`} className="nav-link">
          <FaPlus /> Add Progress
        </Link>

        <Link to={`/myLearningProgress${qs}`} className="nav-link">
          <FaUserGraduate /> My Progress
        </Link>

        <Link to={`/newsfeed${qs}`} className="nav-link">
          🏠 Home
        </Link>
      </div>
    </div>
  );
};

export default LearningNavbar;