import { useMemo } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import './Charts.css';

const COLORS = ['#4ADE80', '#60A5FA', '#F472B6', '#FBBF24', '#818CF8', '#A78BFA', '#F87171'];

export const ExpensePieChart = () => {
    const { filteredTransactions } = useTransactions();

    const expensesData = useMemo(() => {
        const expenses = filteredTransactions.filter(tx => tx.type === 'Expense');
        const categoryTotals: Record<string, number> = {};

        expenses.forEach(tx => {
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        });

        return Object.entries(categoryTotals).map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
        }));
    }, [filteredTransactions]);

    if (expensesData.length === 0) {
        return(
            <div className="chart-card">
                <h3 className="chart-header">Expenses Categories</h3>
                <div className="pie-chart-empty">No expense data yet</div>
            </div>
        );
    }
    return (
        <div className="chart-card">
        <h3 className="chart-header">Expenses Categories</h3>
        <div className="pie-chart-wrapper">
            <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={expensesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
            </div>
            <div className="pie-chart-legend">
            {expensesData.map((item) => (
                <div key={item.name} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: item.color }} />
                <span className="legend-label">{item.name}</span>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}

// export default ExpensePieChart;

export const SavingTrendChart = () => {
  const { transactions, filteredTransactions, activeFilter, currency } = useTransactions();
      const { trendData, trendPercentage } = useMemo(() => {
    // Sort by date
    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const dailyData: Record<string, number> = {};
    let cumulative = 0;

    // We also need to know the balance *before* the filtered range to show a continuous trend
    const firstDateInRange = sorted.length > 0 ? new Date(sorted[0].date) : new Date();
    const olderTransactions = transactions.filter(t => new Date(t.date) < firstDateInRange);
    const initialBalance = olderTransactions.reduce((acc, t) => {
      return acc + (t.type === 'Income' ? t.amount : -t.amount);
    }, 0);

    cumulative = initialBalance;

    sorted.forEach(t => {
      const amount = t.type === 'Income' ? t.amount : -t.amount;
      cumulative += amount;
      dailyData[t.date] = cumulative;
    });

    const data = Object.entries(dailyData).map(([name, value]) => ({
      name,
      value
    }));

    // Calculate trend percentage
    const startValue = initialBalance;
    const endValue = cumulative;
    let percentage = 0;
    if (startValue !== 0) {
      percentage = ((endValue - startValue) / Math.abs(startValue)) * 100;
    } else if (endValue !== 0) {
      percentage = 100; 
    }

    return { trendData: data, trendPercentage: percentage };
  }, [transactions, filteredTransactions]);

  if (trendData.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-header">Saving Trend ({activeFilter})</h3>
        <div className="pie-chart-empty">No data for this period</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header-with-trend">
        <h3 className="chart-header">Saving Trend ({activeFilter})</h3>
        <span className={`trend-badge ${trendPercentage >= 0 ? 'trend-up' : 'trend-down'}`}>
          {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
        </span>
      </div>
      <div className="trend-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trendPercentage >= 0 ? "#10B981" : "#EF4444"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={trendPercentage >= 0 ? "#10B981" : "#EF4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                borderRadius: '12px', 
                border: '1px solid var(--border-subtle)', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                color: 'var(--text-main)'
              }}
              itemStyle={{ color: 'var(--text-main)' }}
              formatter={(value: number | undefined) => [`${currency} ${value?.toLocaleString() ?? '0'}`, 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={trendPercentage >= 0 ? "#10B981" : "#EF4444"} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
