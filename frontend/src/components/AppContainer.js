import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import NewsFeed from './NewsFeed';
import NewsFeedContent from './NewsFeedContent';
import FollowingList from './FollowingList';
import FollowerList from './FollowerList';
import Profile from './Profile';
import MyProfile from './MyProfile';
import AllAccounts from './AllAccounts';
import UnauthorizedPage from './UnauthorizedPage';
import SkilllinkLanding from './SkilllinkLanding';
import ProgressTracker from '../components/Progress/ProgressTracker';
import ProgressDashboard from '../components/Progress/ProgressDashboard';
import EducationalContentPage from './EducationalContent/EducationalContentPage';
import Profile from './UserProfile/ProfileView';
import ProfileEdit from './UserProfile/ProfileEdit';
import CertificationForm from './UserProfile/CertificationForm';
import ExperienceForm from './UserProfile/ExperienceForm';
import LearningGoals from './UserProfile/LearningGoalForm';
import SkillForm from './UserProfile/SkillForm';

const userId = localStorage.getItem('psnUserId');

function AppContainer() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SkilllinkLanding />} />
        <Route path="/s" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/newsfeed" element={<NewsFeed />}>
          <Route path="" element={<NewsFeedContent />} />
          <Route path="following" element={<FollowingList />} />
          <Route path="follower" element={<FollowerList />} />
          {/*<Route path="profile" element={<Profile />} />
          <Route path="myprofile" element={<MyProfile />} />*/}
          <Route path="/profile" element={<Profile />} />
          <Route path="/skills" element={<SkillForm />} />
          <Route path="/certifications" element={<CertificationForm />} />
          <Route path="/experiences" element={<ExperienceForm />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/learning-goals" element={<LearningGoals />} />
          <Route path="allaccounts" element={<AllAccounts />} />
          <Route
            path="progress"
            element={<ProgressTracker userId={userId} />}
          />
          <Route
            path="dashboard"
            element={<ProgressDashboard userId={userId} />}
          />
          <Route path="education" element={<EducationalContentPage />} />
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default AppContainer;
