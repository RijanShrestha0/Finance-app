import React from 'react';
import FilterBar from '../dashboard/FilterBar';
import { ChartsGrid } from '../dashboard/ChartsGrid';
import StatsGrid from '../dashboard/StatsGrid';
import { useAnalyticsInsights } from '../../hooks/useAnalyticsInsights';
// import './GlobalStyle.css';
import './Analytics.css';

const Analytics: React.FC = () => {
  const { currency, activeFilter, insights } = useAnalyticsInsights();

  return (
    <div className="page-container">
        <div className='Empty'>
        </div>
        <div className='page-content'>
            <FilterBar />
            <StatsGrid />
            <ChartsGrid />

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3 className="analytics-card-title">Insights ({activeFilter})</h3>
                <div className="analytics-insight-list">
                  <div className="analytics-insight-row">
                    <span>Transactions</span>
                    <strong>{insights.transactionCount}</strong>
                  </div>
                  <div className="analytics-insight-row">
                    <span>Avg Expense / Tx</span>
                    <strong>{currency} {insights.averageExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="analytics-insight-row">
                    <span>Total Income</span>
                    <strong>{currency} {insights.income.toLocaleString()}</strong>
                  </div>
                  <div className="analytics-insight-row">
                    <span>Total Expense</span>
                    <strong>{currency} {insights.expenses.toLocaleString()}</strong>
                  </div>
                  <div className="analytics-insight-row">
                    <span>Savings Rate</span>
                    <strong className={insights.savings >= 0 ? 'analytics-positive' : 'analytics-negative'}>
                      {insights.savingsRate.toFixed(1)}%
                    </strong>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3 className="analytics-card-title">Top Expense Categories</h3>
                {insights.topCategories.length === 0 ? (
                  <p className="analytics-muted">No expense data for selected period.</p>
                ) : (
                  <div className="analytics-insight-list">
                    {insights.topCategories.map((item) => (
                      <div className="analytics-insight-row" key={item.category}>
                        <span>{item.category}</span>
                        <strong>{currency} {item.amount.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="analytics-card analytics-table-card">
              <h3 className="analytics-card-title">Monthly Breakdown</h3>
              {insights.monthlyRows.length === 0 ? (
                <p className="analytics-muted">No monthly trends available yet.</p>
              ) : (
                <div className="analytics-table-wrapper">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Income</th>
                        <th>Expense</th>
                        <th>Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.monthlyRows.map((row) => (
                        <tr key={row.month}>
                          <td>{row.month}</td>
                          <td>{currency} {row.income.toLocaleString()}</td>
                          <td>{currency} {row.expense.toLocaleString()}</td>
                          <td className={row.net >= 0 ? 'analytics-positive' : 'analytics-negative'}>
                            {currency} {row.net.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
        </div>
    </div>
  );
};

export default Analytics;
