import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expenses';
}

interface TransactionStats {
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
  trends: {
    totalBalance: number;
    income: number;
    expenses: number;
    savings: number;
  };
}

interface TransactionContextType {
  transactions: Transaction[];
  stats: TransactionStats;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  incomeCategories: string[];
  expenseCategories: string[];
  addCategory: (category: string, type: 'Income' | 'Expenses') => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const initialIncomeCategories = ['Salary', 'Stock', 'Bonus', 'Investment', 'Gift'];
const initialExpenseCategories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Health'];

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [incomeCategories, setIncomeCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('incomeCategories');
    return saved ? JSON.parse(saved) : initialIncomeCategories;
  });
  
  const [expenseCategories, setExpenseCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('expenseCategories');
    return saved ? JSON.parse(saved) : initialExpenseCategories;
  });

  const [stats, setStats] = useState<TransactionStats>({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    trends: {
      totalBalance: 0,
      income: 0,
      expenses: 0,
      savings: 0,
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('incomeCategories', JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  useEffect(() => {
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
    const firstDayPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0);

    // Filter transactions
    const currentMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= firstDayCurrentMonth;
    });

    const prevMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= firstDayPrevMonth && d <= lastDayPrevMonth;
    });

    // Current Month Stats
    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const currentExpenses = currentMonthTransactions
      .filter((t) => t.type === 'Expenses')
      .reduce((acc, t) => acc + t.amount, 0);

    // Prev Month Stats
    const prevIncome = prevMonthTransactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const prevExpenses = prevMonthTransactions
      .filter((t) => t.type === 'Expenses')
      .reduce((acc, t) => acc + t.amount, 0);

    // Total Stats (All time)
    const totalIncome = transactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t) => t.type === 'Expenses')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalBalance = totalIncome - totalExpenses;

    // Balance at end of prev month
    const prevTotalIncome = transactions
      .filter(t => new Date(t.date) <= lastDayPrevMonth && t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    const prevTotalExpenses = transactions
      .filter(t => new Date(t.date) <= lastDayPrevMonth && t.type === 'Expenses')
      .reduce((acc, t) => acc + t.amount, 0);
    const prevTotalBalance = prevTotalIncome - prevTotalExpenses;

    // Calculate Trends
    const calculateTrend = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return ((current - prev) / Math.abs(prev)) * 100;
    };

    const trends = {
      income: calculateTrend(currentIncome, prevIncome),
      expenses: calculateTrend(currentExpenses, prevExpenses),
      totalBalance: calculateTrend(totalBalance, prevTotalBalance),
      savings: calculateTrend(currentIncome - currentExpenses, prevIncome - prevExpenses)
    };

    setStats({
      totalBalance,
      income: currentIncome,
      expenses: currentExpenses,
      savings: currentIncome - currentExpenses,
      trends
    });
  }, [transactions]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const addCategory = (category: string, type: 'Income' | 'Expenses') => {
    if (type === 'Income') {
      if (!incomeCategories.includes(category)) {
        setIncomeCategories((prev) => [...prev, category]);
      }
    } else {
      if (!expenseCategories.includes(category)) {
        setExpenseCategories((prev) => [...prev, category]);
      }
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      stats, 
      addTransaction, 
      incomeCategories, 
      expenseCategories, 
      addCategory 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
