import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Edit2, Trash2, SearchX, CheckSquare } from 'lucide-react';
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
  const isAdmin = role === 'admin';

  const [selectedIds, setSelectedIds] = useState([]);
  const selectAllRef = useRef(null);

  const filtered = React.useMemo(() => {
    return transactions.filter(t => {
      const q = filters.search.toLowerCase();
      const matchSearch = t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchType = filters.type === 'all' || t.type === filters.type;
      const matchCat = filters.category === 'all' || t.category === filters.category;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, filters]);

  const filteredIds = filtered.map(t => t.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.includes(id));
  const someSelected = filteredIds.some(id => selectedIds.includes(id));

  // Sync indeterminate state on checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  // Clear selection when filters change
  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => filteredIds.includes(id)));
  }, [transactions, filters]);

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : [...filteredIds]);
  };

  const toggleOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (!window.confirm(`Delete ${selectedIds.length} transaction${selectedIds.length > 1 ? 's' : ''}?`)) return;
    selectedIds.forEach(id => deleteTransaction(id));
    setSelectedIds([]);
  };

  const handleDeleteOne = (id) => {
    deleteTransaction(id);
    setSelectedIds(prev => prev.filter(x => x !== id));
  };

  if (filtered.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{ backgroundColor: 'var(--card-bg)', border: '1.5px dashed var(--border)' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: isDark ? '#0f1e35' : '#f1f5f9' }}>
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
    <div>
      {/* Bulk action bar */}
      <AnimatePresence>
        {isAdmin && selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between px-5 py-3 rounded-xl mb-3"
            style={{
              backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={16} style={{ color: '#ef4444' }} />
              <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                {selectedIds.length} transaction{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ color: '#94a3b8', backgroundColor: isDark ? 'rgba(30,58,95,0.4)' : '#f1f5f9' }}
              >
                Deselect All
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                style={{ backgroundColor: '#ef4444', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}
              >
                <Trash2 size={13} />
                Delete {selectedIds.length}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
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
              <tr style={{
                borderBottom: `1px solid ${isDark ? 'rgba(30,58,95,0.5)' : '#f1f5f9'}`,
                backgroundColor: isDark ? 'rgba(15,30,53,0.5)' : '#fafbfc',
              }}>
                {isAdmin && (
                  <th className="px-5 py-3.5 w-10">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                      title="Select all"
                    />
                  </th>
                )}
                {['Transaction', 'Category', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: '#94a3b8', textAlign: h === 'Amount' || h === 'Status' ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}
                {isAdmin && (
                  <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: '#94a3b8' }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((tx, idx) => {
                  const isIncome = tx.type === 'income';
                  const emoji = categoryEmoji[tx.category] || '💳';
                  const isSelected = selectedIds.includes(tx.id);

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
                          ? `1px solid ${isDark ? 'rgba(30,58,95,0.25)' : '#f8fafc'}`
                          : 'none',
                        backgroundColor: isSelected
                          ? (isDark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.04)')
                          : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = isDark ? 'rgba(30,58,95,0.2)' : '#fafbfc';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Checkbox */}
                      {isAdmin && (
                        <td className="px-5 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(tx.id)}
                            className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                          />
                        </td>
                      )}

                      {/* Info */}
                      <td className="px-5 py-3.5">
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
                      <td className="px-5 py-3.5">
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
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
                          {formatDate(tx.date, 'MMM dd, yyyy')}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-bold" style={{ color: isIncome ? '#10b981' : '#ef4444' }}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                        >
                          Completed
                        </span>
                      </td>

                      {/* Actions */}
                      {isAdmin && (
                        <td className="px-5 py-3.5 text-right">
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
                              onClick={() => handleDeleteOne(tx.id)}
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

        {/* Footer row count */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: `1px solid ${isDark ? 'rgba(30,58,95,0.3)' : '#f1f5f9'}` }}
        >
          <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            {isAdmin && selectedIds.length > 0 && (
              <span style={{ color: '#2563eb' }}> · {selectedIds.length} selected</span>
            )}
          </p>
          {isAdmin && filtered.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="text-xs font-semibold transition-colors"
              style={{ color: '#64748b' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};