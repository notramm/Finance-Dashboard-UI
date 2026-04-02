import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { COLORS } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_COLORS = {
  Food: '#ef4444',
  Transport: '#f97316',
  Shopping: '#f59e0b',
  Entertainment: '#8b5cf6',
  Bills: '#10b981',
  Health: '#ec4899',
  Travel: '#06b6d4',
  Education: '#a78bfa',
  Other: '#94a3b8',
};

const CustomTooltip = ({ active, payload, isDark }) => {
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
        <p className="font-semibold mb-0.5" style={{ color: payload[0]?.payload?.color || '#94a3b8' }}>{payload[0]?.name}</p>
        <p className="font-bold">{formatCurrency(payload[0]?.value)}</p>
      </div>
    );
  }
  return null;
};

export const CategorySpendingChart = () => {
  const { transactions, theme } = useFinance();
  const isDark = theme === 'dark';

  const data = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94a3b8' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-4">
      {/* Donut chart */}
      <div className="relative w-full h-45">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationBegin={500}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Total</p>
          <p className="text-lg font-bold font-numeric" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            ${(total / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2">
        {data.slice(0, 4).map((entry) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
          return (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-medium" style={{ color: '#64748b' }}>{entry.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                  {formatCurrency(entry.value)}
                </span>
                <span className="text-[10px] font-semibold w-8 text-right" style={{ color: '#94a3b8' }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};