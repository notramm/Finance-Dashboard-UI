import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { format, subMonths, eachMonthOfInterval, startOfMonth, isSameMonth } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2.5 rounded-xl text-xs font-medium shadow-xl"
        style={{
          backgroundColor: isDark ? '#0f1e35' : '#fff',
          border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
          color: isDark ? '#f1f5f9' : '#0f172a',
        }}
      >
        <p className="font-semibold mb-1" style={{ color: '#94a3b8' }}>{label}</p>
        <p className="font-bold" style={{ color: '#2563eb' }}>{formatCurrency(payload[0]?.value || 0)}</p>
      </div>
    );
  }
  return null;
};

export const BalanceTrendChart = () => {
  const { transactions, theme } = useFinance();
  const isDark = theme === 'dark';

  const data = React.useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(2026, 3, 2), 5),
      end: new Date(2026, 3, 2)
    });

    return months.map(month => {
      const monthTx = transactions.filter(t => isSameMonth(new Date(t.date), month));
      const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { name: format(month, 'MMM'), balance: income - expense, income, expense };
    });
  }, [transactions]);

  return (
    <div className="w-full h-65">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? 'rgba(30,58,95,0.4)' : '#f1f5f9'}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Outfit', fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Outfit', fontWeight: 500 }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#2563eb"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorBalance)"
            dot={false}
            activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
            animationBegin={300}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};