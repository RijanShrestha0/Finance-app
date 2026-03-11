import { useTransactions } from "../../hooks/useTransactions";
import StatCard from "../../components/ui/StatCard";
import './StatsGrid.css';

const StatsGrid = () => {
    const { stats, currency } = useTransactions();
    const formatTrend = (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };
    return (
        <div className="stats-grid">
            <StatCard
                title = "Total Balance"
                amount = {`${currency} ${stats.totalBalance.toLocaleString()}`}
                trend = {formatTrend(stats.trends.totalBalance)}
                isPositive = {stats.trends.totalBalance >= 0}
                varient="dark"
            />
            <StatCard 
                title="Income" 
                amount={`${currency} ${stats.income.toLocaleString()}`} 
                trend={formatTrend(stats.trends.income)} 
                isPositive={stats.trends.income >= 0} 
            />
            <StatCard 
                title="Expenses" 
                amount={`${currency} ${stats.expenses.toLocaleString()}`} 
                trend={formatTrend(-stats.trends.expenses)} 
                isPositive={stats.trends.expenses <= 0}
            />
            <StatCard 
                title="Savings" 
                amount={`${currency} ${stats.savings.toLocaleString()}`} 
                trend={formatTrend(stats.trends.savings)} 
                isPositive={stats.trends.savings >= 0} 
            />
        </div>
    );
};

export default StatsGrid;