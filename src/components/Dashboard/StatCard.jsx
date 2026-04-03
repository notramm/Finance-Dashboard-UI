import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const colorMap = {
  primary: { bg: 'rgba(37,99,235,0.08)', icon: '#2563eb', border: 'rgba(37,99,235,0.15)' },
  emerald: { bg: 'rgba(16,185,129,0.08)', icon: '#10b981', border: 'rgba(16,185,129,0.15)' },
  rose: { bg: 'rgba(239,68,68,0.08)', icon: '#ef4444', border: 'rgba(239,68,68,0.15)' },
  violet: { bg: 'rgba(139,92,246,0.08)', icon: '#8b5cf6', border: 'rgba(139,92,246,0.15)' },
  amber: { bg: 'rgba(245,158,11,0.08)', icon: '#f59e0b', border: 'rgba(245,158,11,0.15)' },
};

export const StatCard = ({ title, amount, icon: Icon, trend, trendType = 'up', colorClass = 'primary', isLoading = false, subtitle }) => {
  const isPositive = trendType === 'up';
  const colors = colorMap[colorClass] || colorMap.primary;

  if (isLoading) {
    return (
      <div className="p-5 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
        <div className="w-10 h-10 rounded-xl mb-4" style={{ backgroundColor: 'var(--border)' }} />
        <div className="w-20 h-3 rounded mb-2" style={{ backgroundColor: 'var(--border)' }} />
        <div className="w-28 h-7 rounded" style={{ backgroundColor: 'var(--border)' }} />
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-2xl cursor-default transition-all duration-200"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
        >
          <Icon size={20} style={{ color: colors.icon }} />
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold"
            style={{
              backgroundColor: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: isPositive ? '#10b981' : '#ef4444',
            }}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#94a3b8' }}>
        {title}
      </p>
      <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)', letterSpacing: '-0.03em' }}>
        {typeof amount === 'number' ? formatCurrency(amount) : amount}
      </h3>
      {subtitle && (
        <p className="text-xs font-medium mt-1.5" style={{ color: colors.icon }}>{subtitle}</p>
      )}
    </div>
  );
};