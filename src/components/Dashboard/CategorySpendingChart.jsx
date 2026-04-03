import React, { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
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

// Smooth active shape — pops out with a subtle glow ring
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload, percent, value
  } = props;

  return (
    <g style={{ transition: 'all 0.25s ease' }}>
      {/* Outer glow ring */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.2}
      />
      {/* Main slice — slightly expanded */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 7}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
      {/* Center: category name */}
      <text
        x={cx} y={cy - 14}
        textAnchor="middle"
        fill={fill}
        style={{
          fontSize: '11px',
          fontWeight: 700,
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        {payload.name}
      </text>
      {/* Center: amount */}
      <text
        x={cx} y={cy + 4}
        textAnchor="middle"
        fill="var(--foreground)"
        style={{
          fontSize: '14px',
          fontWeight: 800,
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        {formatCurrency(value)}
      </text>
      {/* Center: percent */}
      <text
        x={cx} y={cy + 20}
        textAnchor="middle"
        fill="#94a3b8"
        style={{
          fontSize: '10px',
          fontWeight: 600,
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        {(percent * 100).toFixed(1)}% of total
      </text>
    </g>
  );
};

export const CategorySpendingChart = () => {
  const { transactions, theme } = useFinance();
  const isDark = theme === 'dark';
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

  const onEnter = useCallback((_, index) => setActiveIndex(index), []);
  const onLeave = useCallback(() => setActiveIndex(null), []);

  return (
    <div className="space-y-4">
      {/* Donut */}
      <div className="relative w-full h-47.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              animationBegin={300}
              animationDuration={1000}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke="none"
                  style={{
                    opacity: activeIndex !== null && activeIndex !== index ? 0.35 : 1,
                    transition: 'opacity 0.25s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Idle center label — only shows when nothing is hovered */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{
            opacity: activeIndex === null ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Total</p>
          <p className="text-lg font-bold" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            ${(total / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Legend rows */}
      <div className="space-y-1">
        {data.slice(0, 4).map((entry, idx) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
          const isActive = activeIndex === idx;
          return (
            <div
              key={entry.name}
              className="flex items-center justify-between px-2 py-1 rounded-lg"
              style={{
                backgroundColor: isActive ? `${entry.color}14` : 'transparent',
                cursor: 'default',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: entry.color,
                    transition: 'transform 0.2s ease',
                    transform: isActive ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isActive ? entry.color : '#64748b',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {entry.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                  {formatCurrency(entry.value)}
                </span>
                <span className="text-[10px] font-semibold w-7 text-right" style={{ color: '#94a3b8' }}>
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