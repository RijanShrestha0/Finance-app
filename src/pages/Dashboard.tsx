import React from 'react';
import StatsGrid from '../pages/dashboard/StatsGrid';
import './GlobalStyle.css';

const Dashboard: React.FC = () => {
  return (
    <div className="page-container">
      <div className="Empty"></div>
      <div className="page-content">
        <StatsGrid />
      </div>
    </div>
  );
};

export default Dashboard;
