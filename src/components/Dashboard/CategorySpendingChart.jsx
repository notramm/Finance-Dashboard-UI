import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
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

// Active shape that pops out and shows label inside
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
      {/* Center label */}
      <text x={cx} y={cy - 12} textAnchor="middle" fill={fill} fontSize={11} fontWeight={700} fontFamily="Outfit, sans-serif">
        {payload.name}
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--foreground)" fontSize={13} fontWeight={800} fontFamily="Outfit, sans-serif">
        {formatCurrency(value)}
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600} fontFamily="Outfit, sans-serif">
        {(percent * 100).toFixed(1)}% of total
      </text>
    </g>
  );
};

export const CategorySpendingChart = () => {
  const { transactions, theme } = useFinance();
  const [activeIndex, setActiveIndex] = useState(null);

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
      <div className="relative w-full h-47.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationBegin={400}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke="none"
                  opacity={activeIndex !== null && activeIndex !== index ? 0.45 : 1}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center idle label */}
        {activeIndex === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Total</p>
            <p className="text-lg font-bold" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
              ${(total / 1000).toFixed(1)}k
            </p>
          </div>
        )}
      </div>

      {/* Legend list */}
      <div className="space-y-1.5">
        {data.slice(0, 4).map((entry, idx) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
          const isActive = activeIndex === idx;
          return (
            <div
              key={entry.name}
              className="flex items-center justify-between py-0.5 px-1 rounded-lg transition-all cursor-default"
              style={{ backgroundColor: isActive ? `${entry.color}12` : 'transparent' }}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-medium" style={{ color: isActive ? entry.color : '#64748b' }}>{entry.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                  {formatCurrency(entry.value)}
                </span>
                <span className="text-[10px] font-semibold w-8 text-right" style={{ color: '#94a3b8' }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};