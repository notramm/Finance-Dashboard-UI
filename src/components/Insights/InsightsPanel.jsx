import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  Award,
  PieChart as PieIcon,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';
import { subMonths, isSameMonth, startOfMonth } from 'date-fns';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export const InsightsPanel = () => {
  const { transactions, stats, theme } = useFinance();
  const isDark = theme === 'dark';

  const insights = React.useMemo(() => {
    const now = new Date(2026, 3, 2);
    const currentMonth = startOfMonth(now);
    const lastMonth = startOfMonth(subMonths(now, 1));

    const currentExp = transactions
      .filter(t => t.type === 'expense' && isSameMonth(new Date(t.date), currentMonth))
      .reduce((s, t) => s + t.amount, 0);

    const lastExp = transactions
      .filter(t => t.type === 'expense' && isSameMonth(new Date(t.date), lastMonth))
      .reduce((s, t) => s + t.amount, 0);

    const expDiff = lastExp > 0 ? ((currentExp - lastExp) / lastExp) * 100 : 0;

    const categories = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const topCats = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const highest = topCats[0] || ['None', 0];
    const total = topCats.reduce((s, [, v]) => s + v, 0);

    let tip = "You're saving 30% of your income — great job!";
    if (stats.savingsRate < 10) tip = "Try to reduce entertainment spend to boost your savings rate.";
    else if (stats.savingsRate > 50) tip = "Exceptional saving! Consider putting surplus into investments.";

    return { highest, topCats, total, expDiff: expDiff.toFixed(1), isExpUp: expDiff > 0, tip };
  }, [transactions, stats]);

  const cardBase = {
    backgroundColor: 'var(--card-bg)',
    border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#2563eb' }}>
            Analysis
          </p>
          <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            Financial Insights
            <Zap size={20} className="text-amber-400" fill="currentColor" />
          </h1>
        </div>
        <p className="text-sm font-medium hidden md:block" style={{ color: '#94a3b8' }}>
          Smart analysis of your spending habits.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Highest Spending Hero Card */}
          <motion.div
            variants={item}
            className="p-6 rounded-2xl relative overflow-hidden text-white"
            style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10"
              style={{ backgroundColor: '#fff' }}
            />
            <div
              className="absolute -right-4 -bottom-12 w-48 h-48 rounded-full opacity-5"
              style={{ backgroundColor: '#fff' }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
                >
                  <Target size={22} />
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  {insights.isExpUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(insights.expDiff)}% vs last month
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-70">
                Highest Spending
              </p>
              <h3 className="text-xl font-bold mb-1">{insights.highest[0]}</h3>
              <p className="text-3xl font-bold font-numeric" style={{ letterSpacing: '-0.03em' }}>
                {formatCurrency(insights.highest[1])}
              </p>
            </div>
          </motion.div>

          {/* Daily Tip */}
          <motion.div variants={item} className="p-5 rounded-2xl" style={cardBase}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <Lightbulb size={18} style={{ color: '#f59e0b' }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Smart Tip</h3>
            </div>
            <p
              className="text-sm font-medium leading-relaxed pl-4 py-2"
              style={{
                color: '#64748b',
                borderLeft: '3px solid #f59e0b',
                backgroundColor: 'rgba(245,158,11,0.05)',
                borderRadius: '0 8px 8px 0',
              }}
            >
              {insights.tip}
            </p>
          </motion.div>

          {/* Monthly comparison */}
          <motion.div variants={item} className="p-5 rounded-2xl" style={cardBase}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: insights.isExpUp ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${insights.isExpUp ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}
              >
                {insights.isExpUp ? <TrendingUp size={18} style={{ color: '#ef4444' }} /> : <TrendingDown size={18} style={{ color: '#10b981' }} />}
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Monthly Comparison</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Income', value: formatCurrency(stats.totalIncome), color: '#10b981' },
                { label: 'Total Expenses', value: formatCurrency(stats.totalExpenses), color: '#ef4444' },
                { label: 'Net Balance', value: formatCurrency(stats.balance), color: '#2563eb' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-3 rounded-xl" style={{ backgroundColor: isDark ? '#0f1e35' : '#f8fafc' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>{label}</p>
                  <p className="text-sm font-bold font-numeric" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column: Top Categories */}
        <motion.div variants={item} className="p-5 rounded-2xl flex flex-col" style={cardBase}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <PieIcon size={18} style={{ color: '#10b981' }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Top Spending Categories</h3>
            </div>
            <Award size={18} style={{ color: '#f59e0b' }} />
          </div>

          <div className="space-y-4 flex-1">
            {insights.topCats.map(([cat, amount], idx) => {
              const pct = insights.total > 0 ? (amount / insights.total) * 100 : 0;
              const colors = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b'];
              const color = colors[idx] || '#94a3b8';

              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{cat}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold font-numeric" style={{ color: 'var(--foreground)' }}>
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-xs font-semibold w-9 text-right" style={{ color: '#94a3b8' }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: isDark ? '#1e3a5f' : '#f1f5f9' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.15 * idx, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary box */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{ backgroundColor: isDark ? '#0f1e35' : '#f8fafc', border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>
                  Total Expenses This Period
                </p>
                <p className="text-xl font-bold font-numeric" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
              >
                <ArrowUpRight size={18} style={{ color: '#ef4444' }} />
              </div>
            </div>

            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}` }}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: '#94a3b8' }}>Savings Rate</span>
                <span style={{ color: '#10b981' }}>{stats.savingsRate}%</span>
              </div>
              <div
                className="w-full h-1.5 rounded-full mt-2 overflow-hidden"
                style={{ backgroundColor: isDark ? '#1e3a5f' : '#e2e8f0' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(stats.savingsRate, 100)}%`, backgroundColor: '#10b981' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};