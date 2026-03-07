import { useTransactions } from "../../context/TransactionContext";
import StatCard from "../../components/ui/StatCard";
import './StatsGrid.css';

const StatsGrid = () => {
    const { stats } = useTransactions();
    const formatTrend = (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };
    return (
        <div className="stats-grid">
            <StatCard
                title = "Total Balance"
                amount = {`Rs. ${stats.totalBalance.toLocaleString()}`}
                trend = {formatTrend(stats.trends.totalBalance)}
                isPositive = {stats.trends.totalBalance >= 0}
                varient="dark"
            />
            <StatCard 
                title="Income" 
                amount={`Rs. ${stats.income.toLocaleString()}`} 
                trend={formatTrend(stats.trends.income)} 
                isPositive={stats.trends.income >= 0} 
            />
            <StatCard 
                title="Expenses" 
                amount={`Rs. ${stats.expenses.toLocaleString()}`} 
                trend={formatTrend(-stats.trends.expenses)} 
                isPositive={stats.trends.expenses <= 0}
            />
            <StatCard 
                title="Savings" 
                amount={`Rs. ${stats.savings.toLocaleString()}`} 
                trend={formatTrend(stats.trends.savings)} 
                isPositive={stats.trends.savings >= 0} 
            />
        </div>
    );
};

export default StatsGrid;