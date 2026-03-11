import { useMemo } from 'react';
import { useTransactions } from './useTransactions';

export const useBudgetPageData = () => {
  const { transactions, budgetLimit, currency, activeFilter, stats } = useTransactions();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter((transaction) => {
        if (transaction.type !== 'Expense') {
          return false;
        }

        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions, currentMonth, currentYear]);

  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (transaction.type !== 'Expense') {
        return;
      }

      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() !== currentMonth || transactionDate.getFullYear() !== currentYear) {
        return;
      }

      totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
    });

    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [transactions, currentMonth, currentYear]);

  const monthlyUtilization = budgetLimit > 0 ? (monthlyExpenses / budgetLimit) * 100 : 0;
  const remainingBudget = budgetLimit - monthlyExpenses;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = now.getDate();
  const averageDailySpend = currentDay > 0 ? monthlyExpenses / currentDay : 0;
  const projectedSpend = averageDailySpend * daysInMonth;

  const budgetStatus = monthlyUtilization >= 100
    ? 'Overspent'
    : monthlyUtilization >= 80
      ? 'Near Limit'
      : 'Healthy';

  return {
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
  };
};
