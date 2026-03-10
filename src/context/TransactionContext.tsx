import { createContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { startOfMonth, endOfMonth, subDays, startOfDay, endOfDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useAuth } from '../hooks/useAuth';
import { INITIAL_INCOME_CATEGORIES, INITIAL_EXPENSE_CATEGORIES } from '../constants';

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  reportReason?: string;
  isReported?: boolean;
  isDeleted?: boolean;
}

export interface TransactionStats {
  totalBalance: number;
  income: number;
  yearlyIncome: number;
  expenses: number;
  savings: number;
  trends: {
    totalBalance: number;
    income: number;
    expenses: number;
    savings: number;
  };
}

export interface TransactionContextType {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  stats: TransactionStats;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  incomeCategories: string[];
  expenseCategories: string[];
  addCategory: (category: string, type: 'Income' | 'Expense') => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  changeCurrency: (newCurrency: string) => void;
  budgetLimit: number;
  setBudgetLimit: (limit: number) => void;
  resetAccount: () => void;
  reportTransaction: (id: string, reason: string, shouldDelete: boolean) => void;
  allTransactions: Transaction[];
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  // Initialize with stored data if available, regardless of user auth status
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions_default');
    return saved ? JSON.parse(saved) : [];
  });

  const [incomeCategories, setIncomeCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('incomeCategories_default');
    return saved ? JSON.parse(saved) : INITIAL_INCOME_CATEGORIES;
  });
  
  const [expenseCategories, setExpenseCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('expenseCategories_default');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSE_CATEGORIES;
  });

  const [activeFilter, setActiveFilter] = useState('Month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [currency, setCurrency] = useState<string>(() => {
    const saved = localStorage.getItem('currency_default');
    return saved || 'Rs.';
  });

  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    const saved = localStorage.getItem('budgetLimit_default');
    return saved ? parseFloat(saved) : 0;
  });

  const [stats, setStats] = useState<TransactionStats>({
    totalBalance: 0,
    income: 0,
    yearlyIncome: 0,
    expenses: 0,
    savings: 0,
    trends: {
      totalBalance: 0,
      income: 0,
      expenses: 0,
      savings: 0,
    }
  });

  // Load user specific data when user changes
  useEffect(() => {
    if (user) {
      const savedTransactions = localStorage.getItem(`transactions_${user.id}`);
      setTransactions(savedTransactions ? JSON.parse(savedTransactions) : JSON.parse(localStorage.getItem('transactions_default') || '[]'));
      
      const savedIncome = localStorage.getItem(`incomeCategories_${user.id}`);
      setIncomeCategories(savedIncome ? JSON.parse(savedIncome) : JSON.parse(localStorage.getItem('incomeCategories_default') || JSON.stringify(INITIAL_INCOME_CATEGORIES)));
      
      const savedExpense = localStorage.getItem(`expenseCategories_${user.id}`);
      setExpenseCategories(savedExpense ? JSON.parse(savedExpense) : JSON.parse(localStorage.getItem('expenseCategories_default') || JSON.stringify(INITIAL_EXPENSE_CATEGORIES)));

      const savedCurrency = localStorage.getItem(`currency_${user.id}`);
      setCurrency(savedCurrency || localStorage.getItem('currency_default') || 'Rs.');

      const savedBudget = localStorage.getItem(`budgetLimit_${user.id}`);
      setBudgetLimit(savedBudget ? parseFloat(savedBudget) : parseFloat(localStorage.getItem('budgetLimit_default') || '0'));
    }
  }, [user]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('transactions_default', JSON.stringify(transactions));
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    localStorage.setItem('incomeCategories_default', JSON.stringify(incomeCategories));
    if (user) {
      localStorage.setItem(`incomeCategories_${user.id}`, JSON.stringify(incomeCategories));
    }
  }, [incomeCategories, user]);

  useEffect(() => {
    localStorage.setItem('expenseCategories_default', JSON.stringify(expenseCategories));
    if (user) {
      localStorage.setItem(`expenseCategories_${user.id}`, JSON.stringify(expenseCategories));
    }
  }, [expenseCategories, user]);

  useEffect(() => {
    localStorage.setItem('currency_default', currency);
    if (user) {
      localStorage.setItem(`currency_${user.id}`, currency);
    }
  }, [currency, user]);

  useEffect(() => {
    localStorage.setItem('budgetLimit_default', budgetLimit.toString());
    if (user) {
      localStorage.setItem(`budgetLimit_${user.id}`, budgetLimit.toString());
    }
  }, [budgetLimit, user]);

  useEffect(() => {
    // Filter out deleted transactions for stats calculation
    const activeTransactions = transactions.filter(t => !t.isDeleted);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
    const firstDayPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0);

    // Filter transactions
    const currentMonthTransactions = activeTransactions.filter(t => {
      const d = new Date(t.date);
      return d >= firstDayCurrentMonth;
    });

    const prevMonthTransactions = activeTransactions.filter(t => {
      const d = new Date(t.date);
      return d >= firstDayPrevMonth && d <= lastDayPrevMonth;
    });

    // Current Month Stats
    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const currentExpenses = currentMonthTransactions
      .filter((t) => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);

    // Prev Month Stats
    const prevIncome = prevMonthTransactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const prevExpenses = prevMonthTransactions
      .filter((t) => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);

    // Total Stats (All time)
    const totalIncome = activeTransactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = activeTransactions
      .filter((t) => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalBalance = totalIncome - totalExpenses;

    // Balance at end of prev month
    const prevTotalIncome = activeTransactions
      .filter(t => new Date(t.date) <= lastDayPrevMonth && t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    const prevTotalExpenses = activeTransactions
      .filter(t => new Date(t.date) <= lastDayPrevMonth && t.type === 'Expense')
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

    // Filtered transactions based on global dateRange
    const filteredTransactions = activeTransactions.filter(t => {
      if (!dateRange?.from) return true;
      const d = new Date(t.date);
      if (dateRange.to) {
        return d >= startOfDay(dateRange.from) && d <= endOfDay(dateRange.to);
      }
      return d >= startOfDay(dateRange.from);
    });

    // Calculate 1 year income
    const oneYearAgo = subDays(new Date(), 365);
    const yearlyIncome = activeTransactions
      .filter(t => t.type === 'Income' && new Date(t.date) >= oneYearAgo)
      .reduce((acc, t) => acc + t.amount, 0);

    // Calculate stats for the filtered range
    const filteredIncome = filteredTransactions
      .filter(t => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    const filteredExpenses = filteredTransactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);

    setStats({
      totalBalance,
      income: filteredIncome,
      yearlyIncome,
      expenses: filteredExpenses,
      savings: filteredIncome - filteredExpenses,
      trends
    });
  }, [transactions, dateRange]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'default-user'
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const addCategory = (category: string, type: 'Income' | 'Expense') => {
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

  const changeCurrency = (newCurrency: string) => {
    if (newCurrency === currency) return;

    // Mock exchange rates relative to NPR (Rs.)
    const rates: Record<string, number> = {
      'Rs.': 1,
      '$': 135,
      '€': 145,
      '₹': 1.6,
      'A$': 90
    };

    const oldRate = rates[currency] || 1;
    const newRate = rates[newCurrency] || 1;
    
    // Convert all amounts: amount_in_npr = amount * oldRate; new_amount = amount_in_npr / newRate
    const conversionFactor = oldRate / newRate;

    setTransactions(prev => prev.map(t => ({
      ...t,
      amount: Number((t.amount * conversionFactor).toFixed(2))
    })));

    setBudgetLimit(prev => Number((prev * conversionFactor).toFixed(2)));
    setCurrency(newCurrency);
  };

  const resetAccount = () => {
    // Reset in-memory state so UI updates immediately.
    setTransactions([]);
    setIncomeCategories(INITIAL_INCOME_CATEGORIES);
    setExpenseCategories(INITIAL_EXPENSE_CATEGORIES);
    setCurrency('Rs.');
    setBudgetLimit(0);
    setActiveFilter('Month');
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    });

    // Clear default storage used for guest/default mode.
    localStorage.removeItem('transactions_default');
    localStorage.removeItem('incomeCategories_default');
    localStorage.removeItem('expenseCategories_default');
    localStorage.removeItem('currency_default');
    localStorage.removeItem('budgetLimit_default');

    // Clear user-specific storage when authenticated.
    if (user) {
      localStorage.removeItem(`transactions_${user.id}`);
      localStorage.removeItem(`incomeCategories_${user.id}`);
      localStorage.removeItem(`expenseCategories_${user.id}`);
      localStorage.removeItem(`currency_${user.id}`);
      localStorage.removeItem(`budgetLimit_${user.id}`);
    }
  };

  const reportTransaction = (id: string, reason: string, shouldDelete: boolean) => {
    setTransactions(prev => prev.map(t => 
      t.id === id 
        ? { ...t, isReported: true, reportReason: reason, isDeleted: shouldDelete }
        : t
    ));
  };

  // All transactions including deleted ones for CSV export
  const allTransactions = useMemo(() => transactions, [transactions]);

  // Visible transactions (exclude deleted ones)
  const visibleTransactions = useMemo(() => {
    return transactions.filter(t => !t.isDeleted);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return visibleTransactions.filter(t => {
      if (!dateRange?.from) return true;
      const d = new Date(t.date);
      if (dateRange.to) {
        return d >= startOfDay(dateRange.from) && d <= endOfDay(dateRange.to);
      }
      return d >= startOfDay(dateRange.from);
    });
  }, [visibleTransactions, dateRange]);

  return (
    <TransactionContext.Provider value={{ 
      transactions: visibleTransactions, 
      filteredTransactions,
      stats, 
      addTransaction, 
      incomeCategories, 
      expenseCategories, 
      addCategory,
      dateRange,
      setDateRange,
      activeFilter,
      setActiveFilter,
      currency,
      setCurrency,
      changeCurrency,
      budgetLimit,
      setBudgetLimit,
      resetAccount,
      reportTransaction,
      allTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
