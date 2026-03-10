import { useState, useEffect } from 'react';
import { useTransactions } from './useTransactions';
import { useTheme } from './useTheme';
import { useAuth } from './useAuth';
import useNotifications from './useNotifications';

export const useSettings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotifications();
  const { 
    currency, 
    changeCurrency, 
    budgetLimit, 
    setBudgetLimit, 
    resetAccount,
    transactions,
    stats
  } = useTransactions();

  const [localCurrency, setLocalCurrency] = useState(currency);
  const [localBudget, setLocalBudget] = useState(budgetLimit.toString());

  useEffect(() => {
    setLocalCurrency(currency);
    setLocalBudget(budgetLimit.toString());
  }, [currency, budgetLimit]);

  const getConversionFactor = (from: string, to: string) => {
    const rates: Record<string, number> = {
      'Rs.': 1,
      '$': 135,
      '€': 145,
      '₹': 1.6,
      'A$': 90
    };
    const oldRate = rates[from] || 1;
    const newRate = rates[to] || 1;
    return oldRate / newRate;
  };

  const handleCurrencyChange = (newCurrency: string) => {
    const factor = getConversionFactor(localCurrency, newCurrency);
    const currentBudget = parseFloat(localBudget) || 0;
    const convertedBudget = (currentBudget * factor).toFixed(2);
    
    setLocalCurrency(newCurrency);
    setLocalBudget(convertedBudget);
  };

  const handleSave = () => {
    const newBudget = parseFloat(localBudget) || 0;
    
    const factor = getConversionFactor(currency, localCurrency);
    const currentBalanceInNewCurrency = stats.totalBalance * factor;

    if (newBudget > currentBalanceInNewCurrency) {
      addNotification(`Budget limit (${localCurrency} ${newBudget.toLocaleString()}) cannot exceed total balance (${localCurrency} ${currentBalanceInNewCurrency.toLocaleString()})`);
      return;
    }

    if (localCurrency !== currency) {
      changeCurrency(localCurrency);
    }
    
    setBudgetLimit(newBudget);
    addNotification('Settings updated successfully');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your account? All transactions will be permanently deleted.')) {
      resetAccount();
      setLocalCurrency('Rs.');
      setLocalBudget('0');
      addNotification('Account reset successfully');
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      addNotification('No transactions to download');
      return;
    }

    const headers = ['Date', 'Category', 'Description', 'Amount', 'Type'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        `"${t.category.replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.amount,
        t.type
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addNotification('Transaction history exported successfully');
  };

  return {
    user,
    theme,
    toggleTheme,
    localCurrency,
    localBudget,
    setLocalBudget,
    handleCurrencyChange,
    handleSave,
    handleReset,
    handleExport
  };
};
