import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const categoryIcons = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Bills: '📄', Health: '💊', Travel: '✈️', Education: '📚',
  Salary: '💼', 'Freelance Income': '💻', Investment: '📈',
  'Other Income': '💰', 'Other Expense': '📦',
};

export const RecentActivity = ({ onViewAll }) => {
  const { transactions, theme } = useFinance();
  const isDark = theme === 'dark';
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
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
          Recent Activity
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: '#2563eb' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            View All History
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      <div className="space-y-0.5">
        {recent.map((tx, idx) => {
          const isIncome = tx.type === 'income';
          const emoji = categoryIcons[tx.category] || '💳';

          return (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-3 py-3 rounded-xl transition-all cursor-default"
              style={{
                borderBottom: idx < recent.length - 1
                  ? `1px solid ${isDark ? 'rgba(30,58,95,0.25)' : '#f8fafc'}`
                  : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(30,58,95,0.3)' : '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                style={{ backgroundColor: isIncome ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)' }}
              >
                {emoji}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                  {tx.description}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  {formatDate(tx.date)} · {tx.category}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p
                  className="text-sm font-bold"
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