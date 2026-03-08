import { ExpensePieChart, SavingTrendChart } from './Charts';
import './ChartsGrid.css';

export const ChartsGrid = () => {
  return (
    <div className="charts-grid">
      <div>
        <ExpensePieChart />
      </div>
      <div>
        <SavingTrendChart />
      </div>
    </div>
  );
};
