import { useState } from 'react';
import { useTransactions } from './useTransactions';
import useNotifications from './useNotifications';

export const useTransactionsForm = () => {
  const { addNotification } = useNotifications();
  const { 
    transactions, 
    addTransaction, 
    incomeCategories, 
    expenseCategories, 
    addCategory, 
    currency 
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

    addTransaction({
      date: date.replace(/-/g, '/'),
      category,
      description,
      amount: parseFloat(amount),
      type,
    });

    addNotification(`New ${type.toLowerCase()} added: ${currency} ${parseFloat(amount).toLocaleString()}`);
    
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
