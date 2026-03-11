import { useState } from 'react';
import { useTransactions } from './useTransactions';
import useNotifications from './useNotifications';
import { useAuth } from './useAuth';

export const useTransactionsForm = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { 
    transactions, 
    addTransaction, 
    incomeCategories, 
    expenseCategories, 
    addCategory, 
    currency,
    budgetLimit
  } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [type, setType] = useState<'Income' | 'Expense'>('Expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const currentCategories = type === 'Income' ? incomeCategories : expenseCategories;

  const handleSave = () => {
    if (!amount || !category || !date) {
      addNotification('Please fill in all required fields');
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      addNotification('Please enter a valid amount');
      return;
    }

    let budgetAlertMessage: string | null = null;

    if (type === 'Expense' && budgetLimit > 0) {
      const selectedDate = new Date(date);
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();

      const monthExpenses = transactions
        .filter((transaction) => {
          if (transaction.type !== 'Expense') {
            return false;
          }

          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
          );
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const projectedExpenses = monthExpenses + parsedAmount;
      const threshold80 = budgetLimit * 0.8;
      const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      const scope = user?.id || 'unknown-user';
      const eightyPercentKey = `budgetAlert80_${scope}_${monthKey}`;
      const overspendKey = `budgetAlertOver_${scope}_${monthKey}`;

      if (monthExpenses < threshold80 && projectedExpenses >= threshold80) {
        const remainingBeforeLimit = Math.max(budgetLimit - projectedExpenses, 0);
        budgetAlertMessage = `Alert: This expense brings you above 80% of budget. Remaining before limit: ${currency} ${remainingBeforeLimit.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`;
        localStorage.setItem(eightyPercentKey, 'true');
      }

      if (monthExpenses <= budgetLimit && projectedExpenses > budgetLimit) {
        const overspendBy = projectedExpenses - budgetLimit;
        budgetAlertMessage = `Warning: This expense will exceed your budget by ${currency} ${overspendBy.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`;
        localStorage.setItem(overspendKey, 'true');
      }
    }

    addTransaction({
      date: date.replace(/-/g, '/'),
      category,
      description,
      amount: parsedAmount,
      type,
    });

    addNotification(`New ${type.toLowerCase()} added: ${currency} ${parsedAmount.toLocaleString()}`);

    // Keep threshold warning as the most visible toast when both notifications are fired.
    if (budgetAlertMessage) {
      addNotification(budgetAlertMessage);
    }
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (currentCategories.includes(newCategory.trim())) {
      addNotification('Category already exists');
      return;
    }
    addCategory(newCategory.trim(), type);
    setCategory(newCategory.trim());
    setNewCategory('');
    setIsModalOpen(false);
    addNotification(`New category "${newCategory.trim()}" added to ${type}`);
  };

  const handleCancel = () => {
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return {
    transactions,
    currency,
    isModalOpen,
    setIsModalOpen,
    newCategory,
    setNewCategory,
    type,
    setType,
    amount,
    setAmount,
    category,
    setCategory,
    date,
    setDate,
    description,
    setDescription,
    currentCategories,
    handleSave,
    handleAddCategory,
    handleCancel
  };
};
