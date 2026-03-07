import React from 'react';
import StatsGrid from '../pages/dashboard/StatsGrid';
import './GlobalStyle.css';
import TransactionTable from './dashboard/TransactionTable';

const Dashboard: React.FC = () => {
  return (
    <div className="page-container">
      <div className="Empty"></div>
      <div className="page-content">
        <StatsGrid />
        <TransactionTable />
      </div>
    </div>
  );
};

export default Dashboard;
