import React from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../dashboard/FilterBar';
import { useBudgetPageData } from '../../hooks/useBudgetPageData';
import './Budget.css';
// import './GlobalStyle.css';

const Budget: React.FC = () => {
  const navigate = useNavigate();
  const {
    budgetLimit,
    currency,
    activeFilter,
    stats,
    monthlyExpenses,
    categoryBreakdown,
    monthlyUtilization,
    remainingBudget,
    projectedSpend,
    budgetStatus,
  } = useBudgetPageData();

  return (
    <div className="page-container">
        <div className='Empty'>
        </div>
        <div className='page-content'>
            <FilterBar />

            {budgetLimit <= 0 ? (
              <div className="budget-empty-card">
                <h2 className="budget-empty-title">No budget limit set yet</h2>
                <p className="budget-empty-text">
                  Set your budget in Settings to start tracking spending progress and alerts.
                </p>
                <button
                  className="budget-settings-btn"
                  onClick={() => navigate('/settings')}
                >
                  Go To Settings
                </button>
              </div>
            ) : (
              <>
                <div className="budget-kpi-grid">
                  <div className="budget-kpi-card">
                    <p className="budget-kpi-label">Budget Limit</p>
                    <p className="budget-kpi-value">{currency} {budgetLimit.toLocaleString()}</p>
                  </div>

                  <div className="budget-kpi-card">
                    <p className="budget-kpi-label">Spent This Month</p>
                    <p className="budget-kpi-value">{currency} {monthlyExpenses.toLocaleString()}</p>
                  </div>

                  <div className="budget-kpi-card">
                    <p className="budget-kpi-label">Remaining</p>
                    <p className={`budget-kpi-value ${remainingBudget < 0 ? 'budget-negative' : 'budget-positive'}`}>
                      {currency} {Math.abs(remainingBudget).toLocaleString()}
                      {remainingBudget < 0 ? ' over' : ''}
                    </p>
                  </div>

                  <div className="budget-kpi-card">
                    <p className="budget-kpi-label">Status</p>
                    <p className={`budget-status-pill ${budgetStatus === 'Healthy' ? 'status-healthy' : budgetStatus === 'Near Limit' ? 'status-warning' : 'status-danger'}`}>
                      {budgetStatus}
                    </p>
                  </div>
                </div>

                <div className="budget-progress-card">
                  <div className="budget-progress-header">
                    <h3>Monthly Utilization</h3>
                    <span>{monthlyUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="budget-progress-track">
                    <div
                      className={`budget-progress-fill ${monthlyUtilization < 80 ? 'fill-healthy' : monthlyUtilization < 100 ? 'fill-warning' : 'fill-danger'}`}
                      style={{ width: `${Math.min(monthlyUtilization, 100)}%` }}
                    />
                  </div>

                  <div className="budget-projection-row">
                    <p>
                      Current filter ({activeFilter}) expenses: <strong>{currency} {stats.expenses.toLocaleString()}</strong>
                    </p>
                    <p>
                      Projected month-end spend: <strong>{currency} {projectedSpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
                    </p>
                  </div>
                </div>

                <div className="budget-categories-card">
                  <h3>Top Expense Categories (This Month)</h3>
                  {categoryBreakdown.length === 0 ? (
                    <p className="budget-muted">No expenses recorded this month.</p>
                  ) : (
                    <div className="budget-category-list">
                      {categoryBreakdown.map((item) => (
                        <div key={item.category} className="budget-category-row">
                          <span>{item.category}</span>
                          <strong>{currency} {item.amount.toLocaleString()}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
        </div>
    </div>
  );
};

export default Budget;
