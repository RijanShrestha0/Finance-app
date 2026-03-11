import { useEffect } from 'react';
import { useTransactions } from './useTransactions';
import useNotifications from './useNotifications';
import { useAuth } from './useAuth';

const useBudgetAlerts = (enabled = true) => {
  const { transactions, budgetLimit, currency } = useTransactions();
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!user || budgetLimit <= 0) {
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const eightyPercentKey = `budgetAlert80_${user.id}_${monthKey}`;
    const overspendKey = `budgetAlertOver_${user.id}_${monthKey}`;

    const monthlyExpenses = transactions
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

    const usageRatio = monthlyExpenses / budgetLimit;
    const hasEightyPercentAlert = localStorage.getItem(eightyPercentKey) === 'true';
    const hasOverspendAlert = localStorage.getItem(overspendKey) === 'true';

    if (usageRatio >= 1) {
      if (!hasOverspendAlert) {
        const overspendAmount = monthlyExpenses - budgetLimit;
        addNotification(
          `Budget overspent by ${currency} ${overspendAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`
        );
        localStorage.setItem(overspendKey, 'true');
      }

      if (!hasEightyPercentAlert) {
        localStorage.setItem(eightyPercentKey, 'true');
      }
      return;
    }

    if (usageRatio >= 0.8) {
      if (!hasEightyPercentAlert) {
        const remainingBeforeLimit = Math.max(budgetLimit - monthlyExpenses, 0);
        addNotification(
          `Alert: You have used 80% of your budget. Remaining before limit: ${currency} ${remainingBeforeLimit.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`
        );
        localStorage.setItem(eightyPercentKey, 'true');
      }
      localStorage.removeItem(overspendKey);
      return;
    }

    localStorage.removeItem(eightyPercentKey);
    localStorage.removeItem(overspendKey);
  }, [transactions, budgetLimit, currency, addNotification, enabled, user]);
};

export default useBudgetAlerts;
