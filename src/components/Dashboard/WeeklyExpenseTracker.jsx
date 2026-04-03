import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-xs font-medium shadow-xl"
        style={{
          backgroundColor: isDark ? '#0f1e35' : '#fff',
          border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
          color: isDark ? '#f1f5f9' : '#0f172a',
        }}
      >
        <p className="font-semibold mb-0.5" style={{ color: '#94a3b8' }}>{label}</p>
        <p className="font-bold" style={{ color: '#2563eb' }}>{formatCurrency(payload[0]?.value || 0)}</p>
      </div>
    );
  }
  return null;
};

export const WeeklyExpenseTracker = () => {
  const { transactions, theme } = useFinance();
  const isDark = theme === 'dark';

  const weeklyData = useMemo(() => {
    const now = new Date(2026, 3, 2);

    const getWeekStart = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const currentWeekStart = getWeekStart(now);
    const weeks = [];

    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const expense = transactions
        .filter(t => {
          if (t.type !== 'expense') return false;
          const d = new Date(t.date);
          return d >= weekStart && d <= weekEnd;
        })
        .reduce((s, t) => s + t.amount, 0);

      const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      weeks.push({ week: label, expense });
    }

    return weeks;
  }, [transactions]);

  const latest = weeklyData[weeklyData.length - 1]?.expense ?? 0;
  const previous = weeklyData[weeklyData.length - 2]?.expense ?? 0;
  const avg = weeklyData.reduce((s, w) => s + w.expense, 0) / (weeklyData.length || 1);
  const trend = previous > 0 ? ((latest - previous) / previous) * 100 : 0;
  const isUp = trend > 0;

  const maxVal = Math.max(...weeklyData.map(w => w.expense), 1);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Weekly Expense Tracker</h2>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#94a3b8' }}>Last 6 weeks spending trend</p>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ backgroundColor: isDark ? '#0f1e35' : '#f1f5f9', border: '1px solid var(--border)', color: '#64748b' }}
          >
            This Week: <span style={{ color: 'var(--foreground)' }}>{formatCurrency(latest)}</span>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ backgroundColor: isDark ? '#0f1e35' : '#f1f5f9', border: '1px solid var(--border)', color: '#64748b' }}
          >
            Avg: <span style={{ color: 'var(--foreground)' }}>{formatCurrency(avg)}</span>
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{
              backgroundColor: isUp ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
              color: isUp ? '#ef4444' : '#10b981',
            }}
          >
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="w-full h-50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barCategoryGap={20} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="expense" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {weeklyData.map((entry, index) => {
                const isLatest = index === weeklyData.length - 1;
                const intensity = maxVal > 0 ? entry.expense / maxVal : 0;
                return (
                  <Cell
                    key={index}
                    fill={isLatest ? '#2563eb' : `rgba(37,99,235,${0.25 + intensity * 0.45})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};