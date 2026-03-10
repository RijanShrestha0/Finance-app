import React from 'react';
import ProfileCard from '../components/settings/ProfileCard';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="page-container">
        <div className='Empty'>
        </div>
        <div className='page-content'>
            <ProfileCard />
            

        </div>
    </div>
  );
};

export default Settings;
