import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const categoryIcons = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Bills: '📄',
  Health: '💊',
  Travel: '✈️',
  Education: '📚',
  Salary: '💼',
  'Freelance Income': '💻',
  Investment: '📈',
  'Other Income': '💰',
  'Other Expense': '📦',
};

export const RecentActivity = () => {
  const { transactions, theme } = useFinance();
  const recent = transactions.slice(0, 5);

  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
          Recent Activity
        </h2>
        <button
          className="text-xs font-semibold transition-colors"
          style={{ color: '#2563eb' }}
        >
          View All History →
        </button>
      </div>

      {/* List */}
      <div className="space-y-1">
        {recent.map((tx, idx) => {
          const isIncome = tx.type === 'income';
          const emoji = categoryIcons[tx.category] || '💳';

          return (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-3 py-3 rounded-xl transition-all cursor-default group"
              style={{ borderBottom: idx < recent.length - 1 ? `1px solid ${theme === 'dark' ? 'rgba(30,58,95,0.3)' : '#f1f5f9'}` : 'none' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(30,58,95,0.3)' : '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                style={{
                  backgroundColor: isIncome ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                }}
              >
                {emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                  {tx.description}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  {formatDate(tx.date)} · {tx.category}
                </p>
              </div>

              {/* Amount + status */}
              <div className="text-right shrink-0">
                <p
                  className="text-sm font-bold font-numeric"
                  style={{ color: isIncome ? '#10b981' : '#ef4444' }}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#94a3b8' }}>
                  Completed
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};