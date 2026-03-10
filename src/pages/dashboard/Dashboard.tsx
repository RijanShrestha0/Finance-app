import React from 'react';
import StatsGrid from './StatsGrid';
// import './GlobalStyle.css';
import TransactionTable from './TransactionTable';
import FilterBar from './FilterBar';
import { ChartsGrid } from './ChartsGrid';

const Dashboard: React.FC = () => {
  return (
    <div className="page-container">
      <div className="Empty"></div>
      <div className="page-content">
        <FilterBar />
        <StatsGrid />
        <ChartsGrid />
        <TransactionTable />
      </div>
    </div>
  );
};

export default Dashboard;
