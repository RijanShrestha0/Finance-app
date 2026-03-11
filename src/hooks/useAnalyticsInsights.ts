import { useMemo } from 'react';
import { useTransactions } from './useTransactions';

export const useAnalyticsInsights = () => {
  const { filteredTransactions, currency, activeFilter } = useTransactions();

  const insights = useMemo(() => {
    const income = filteredTransactions
      .filter((transaction) => transaction.type === 'Income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = filteredTransactions
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    const expenseCategoryTotals: Record<string, number> = {};
    filteredTransactions.forEach((transaction) => {
      if (transaction.type !== 'Expense') {
        return;
      }
      expenseCategoryTotals[transaction.category] = (expenseCategoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const topCategories = Object.entries(expenseCategoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const monthlyMap: Record<string, { income: number; expense: number }> = {};
    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'Income') {
        monthlyMap[key].income += transaction.amount;
      } else {
        monthlyMap[key].expense += transaction.amount;
      }
    });

    const monthlyRows = Object.entries(monthlyMap)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
      .map(([month, values]) => ({
        month,
        income: values.income,
        expense: values.expense,
        net: values.income - values.expense,
      }));

    const avgExpenseTx = filteredTransactions.filter((transaction) => transaction.type === 'Expense');
    const averageExpense = avgExpenseTx.length > 0 ? expenses / avgExpenseTx.length : 0;

    return {
      income,
      expenses,
      savings,
      savingsRate,
      topCategories,
      monthlyRows,
      averageExpense,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  return {
    currency,
    activeFilter,
    insights,
  };
};
