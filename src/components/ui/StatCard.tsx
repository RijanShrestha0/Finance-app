import { TrendingDown, TrendingUp } from "lucide-react";
import './StatCard.css';

interface StatsCardProps {
    title: string;
    amount: string;
    trend: string;
    isPositive: boolean;
    varient?: 'dark' | 'light';
}

const StatCard = ({ title, amount, trend, isPositive, varient = 'light' }: StatsCardProps) => {
    const isDark = varient === 'dark';
    return (
        <div className={`stat-card ${isDark ? "stat-card-dark" : "stat-card-light"}`}>
            {isDark && (
                <div className="stat-card-bg-patterns">
                    <div className="stat-card-bg-gradient" />
                    <div className="stat-card-bg-lines" />
                </div>
            )}
            {!isDark && (
                <div className="stat-card-bg-blur" />
            )}
            
            <div className = "stat-card-content">
                <p className = "stat-card-title">{ title }</p>
                <h3 className = "stat-card-amount">{ amount }</h3>
                <div className = "stat-card-trend-container">
                    <div className = {`stat-card-trend ${isPositive ? "stat-card-trend-positive" : "stat-card-trend-negative"}`}>
                        {isPositive ? <TrendingUp className = "stat-card-trend-icon" /> : <TrendingDown className = "stat-card-trend-icon"></TrendingDown>}
                        { trend }
                    </div>
                    <span className = "stat-card-period">
                        from last month
                    </span>
                </div>
            </div>
        </div>
    )

}

export default StatCard;