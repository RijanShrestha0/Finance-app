import React from 'react';
import StatsGrid from '../pages/dashboard/StatsGrid';
import './GlobalStyle.css';
import TransactionTable from './dashboard/TransactionTable';
import FilterBar from './dashboard/FilterBar';
import { ChartsGrid } from './dashboard/ChartsGrid';

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
