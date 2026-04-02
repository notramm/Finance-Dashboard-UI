import React from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Edit2,
  Trash2,
  SearchX
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

const categoryEmoji = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Bills: '📄', Health: '💊', Travel: '✈️', Education: '📚',
  Salary: '💼', 'Freelance Income': '💻', Investment: '📈',
  'Other Income': '💰', 'Other Expense': '📦',
};

export const TransactionList = ({ onEditClick }) => {
  const { transactions, filters, role, deleteTransaction, theme } = useFinance();
  const isDark = theme === 'dark';

  const filtered = React.useMemo(() => {
    return transactions.filter(t => {
      const q = filters.search.toLowerCase();
      const matchSearch = t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchType = filters.type === 'all' || t.type === filters.type;
      const matchCat = filters.category === 'all' || t.category === filters.category;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, filters]);

  if (filtered.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1.5px dashed var(--border)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: isDark ? '#0f1e35' : '#f1f5f9' }}
        >
          <SearchX size={24} style={{ color: '#94a3b8' }} />
        </div>
        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Nothing found</h3>
        <p className="text-sm font-medium text-center max-w-xs" style={{ color: '#94a3b8' }}>
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(30,58,95,0.5)' : '#f1f5f9'}`, backgroundColor: isDark ? 'rgba(15,30,53,0.5)' : '#fafbfc' }}>
              <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Transaction</th>
              <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Category</th>
              <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Date</th>
              <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: '#94a3b8' }}>Amount</th>
              <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: '#94a3b8' }}>Status</th>
              {role === 'admin' && (
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: '#94a3b8' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.map((tx, idx) => {
                const isIncome = tx.type === 'income';
                const emoji = categoryEmoji[tx.category] || '💳';
                return (
                  <motion.tr
                    key={tx.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="group transition-colors"
                    style={{
                      borderBottom: idx < filtered.length - 1
                        ? `1px solid ${isDark ? 'rgba(30,58,95,0.3)' : '#f8fafc'}`
                        : 'none',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(30,58,95,0.2)' : '#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Transaction info */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                          style={{ backgroundColor: isIncome ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)' }}
                        >
                          {emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{tx.description}</p>
                          <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#94a3b8' }}>{tx.type}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor: isDark ? 'rgba(30,58,95,0.5)' : '#f1f5f9',
                          color: '#64748b',
                          border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
                        {formatDate(tx.date, 'MMM dd, yyyy')}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-3.5 text-right">
                      <span
                        className="text-sm font-bold font-numeric"
                        style={{ color: isIncome ? '#10b981' : '#ef4444' }}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: 'rgba(16,185,129,0.1)',
                          color: '#10b981',
                        }}
                      >
                        Completed
                      </span>
                    </td>

                    {/* Actions */}
                    {role === 'admin' && (
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditClick(tx)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#2563eb' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#ef4444' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};