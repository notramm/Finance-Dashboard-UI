import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import { startOfMonth, subMonths, isSameMonth } from 'date-fns';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('finance-role') || 'viewer');

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  // Always default to light theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finance-theme') || 'light';
  });

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  useEffect(() => { localStorage.setItem('finance-role', role); }, [role]);
  useEffect(() => { localStorage.setItem('finance-transactions', JSON.stringify(transactions)); }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply initial theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    return { totalIncome: income, totalExpenses: expenses, balance, savingsRate: savingsRate.toFixed(1) };
  }, [transactions]);

  const addTransaction = (transaction) => {
    if (role !== 'admin') return;
    setTransactions(prev => [{
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString()
    }, ...prev]);
  };

  const updateTransaction = (updated) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTransaction = (id) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const toggleRole = () => setRole(prev => prev === 'admin' ? 'viewer' : 'admin');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const signOut = () => {
    setRole('viewer');
    setTheme('light');
    localStorage.removeItem('finance-role');
    localStorage.removeItem('finance-transactions');
    localStorage.removeItem('finance-theme');
    window.location.reload();
  };

  return (
    <FinanceContext.Provider value={{
      role, transactions, theme, filters, stats,
      setFilters, addTransaction, updateTransaction, deleteTransaction,
      toggleRole, toggleTheme, signOut
    }}>
      {children}
    </FinanceContext.Provider>
  );
};