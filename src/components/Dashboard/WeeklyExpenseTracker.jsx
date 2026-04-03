import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length && payload[0].value > 0) {
    return (
      <div style={{
        backgroundColor: isDark ? '#0f1e35' : '#fff',
        border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}>
        <p style={{ color: '#94a3b8', fontWeight: 600, marginBottom: '3px' }}>{label}</p>
        <p style={{ color: '#2563eb', fontWeight: 700 }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const smartTick = (value) => {
  if (value === 0) return '$0';
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return `$${value}`;
};

export const WeeklyExpenseTracker = () => {
  const { transactions, theme } = useFinance();
  const isDark = theme === 'dark';

  const weeklyData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');

    // Find latest date across all transactions to anchor weeks
    let ref = new Date(2026, 3, 2);
    if (expenses.length > 0) {
      const latest = expenses.reduce((max, t) => {
        const d = new Date(t.date);
        return d > max ? d : max;
      }, new Date(0));
      if (latest > ref) ref = latest;
    }

    // Monday of the week containing ref
    const getMonday = (d) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const currentMonday = getMonday(ref);
    const weeks = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(currentMonday);
      start.setDate(currentMonday.getDate() - i * 7);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const total = expenses
        .filter(t => {
          const d = new Date(t.date);
          return d >= start && d <= end;
        })
        .reduce((s, t) => s + t.amount, 0);

      weeks.push({
        week: start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        expense: Math.round(total),
      });
    }

    return weeks;
  }, [transactions]);

  const latest = weeklyData[weeklyData.length - 1]?.expense ?? 0;
  const previous = weeklyData[weeklyData.length - 2]?.expense ?? 0;
  const nonZeroWeeks = weeklyData.filter(w => w.expense > 0);
  const avg = nonZeroWeeks.length > 0
    ? nonZeroWeeks.reduce((s, w) => s + w.expense, 0) / nonZeroWeeks.length
    : 0;
  const trend = previous > 0 ? ((latest - previous) / previous) * 100 : 0;
  const isUp = trend > 0;
  const maxVal = Math.max(...weeklyData.map(w => w.expense), 1);
  const yMax = Math.ceil(maxVal * 1.25 / 100) * 100 || 200;

  return (
    <div className="p-5 rounded-2xl" style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Weekly Expense Tracker</h2>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#94a3b8' }}>Last 6 weeks spending trend</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ backgroundColor: isDark ? '#0f1e35' : '#f1f5f9', border: '1px solid var(--border)', color: '#64748b' }}>
            This Week:&nbsp;<span style={{ color: 'var(--foreground)' }}>{formatCurrency(latest)}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ backgroundColor: isDark ? '#0f1e35' : '#f1f5f9', border: '1px solid var(--border)', color: '#64748b' }}>
            6wk Avg:&nbsp;<span style={{ color: 'var(--foreground)' }}>{formatCurrency(Math.round(avg))}</span>
          </div>
          {previous > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{ backgroundColor: isUp ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: isUp ? '#ef4444' : '#10b981' }}>
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barCategoryGap="35%" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="week" axisLine={false} tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Outfit, sans-serif', fontWeight: 500 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} domain={[0, yMax]}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              tickFormatter={smartTick} width={50} />
            <Tooltip content={<CustomTooltip isDark={isDark} />}
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', radius: 8 }} />
            <Bar dataKey="expense" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {weeklyData.map((entry, index) => {
                const isLatest = index === weeklyData.length - 1;
                const pct = entry.expense > 0 ? entry.expense / maxVal : 0;
                const opacity = isLatest ? 1 : 0.25 + pct * 0.55;
                return (
                  <Cell key={index} fill={isLatest ? '#2563eb' : `rgba(37,99,235,${opacity.toFixed(2)})`} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};