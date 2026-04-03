import React from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Percent, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { StatCard } from './StatCard';
import { BalanceTrendChart } from './BalanceTrendChart';
import { CategorySpendingChart } from './CategorySpendingChart';
import { RecentActivity } from './RecentActivity';
import { WeeklyExpenseTracker } from './WeeklyExpenseTracker';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export const DashboardOverview = ({ setActiveTab }) => {
  const { stats, theme } = useFinance();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#2563eb' }}>
            Financial Overview
          </p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            Executive Dashboard
          </h1>
        </div>
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold self-start sm:self-auto"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', color: '#64748b' }}
        >
          <Calendar size={14} style={{ color: '#2563eb' }} />
          April 2026
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Balance', amount: stats.balance, icon: Wallet, trend: 12.5, colorClass: 'primary', subtitle: '+12.5% this month' },
          { title: 'Total Income', amount: stats.totalIncome, icon: ArrowUpCircle, trend: 8.2, colorClass: 'emerald', subtitle: '+8.2% from last month' },
          { title: 'Total Expenses', amount: stats.totalExpenses, icon: ArrowDownCircle, trend: -4.1, trendType: 'down', colorClass: 'rose', subtitle: '85% of monthly budget' },
          { title: 'Savings Rate', amount: `${stats.savingsRate}%`, icon: Percent, trend: 2.4, colorClass: 'violet', subtitle: 'Great progress!' },
        ].map((card, i) => (
          <motion.div key={card.title} variants={item}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          variants={item}
          className="lg:col-span-2 p-5 rounded-2xl"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Balance Trend</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#94a3b8' }}>Growth trajectory over the last 6 months</p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ backgroundColor: theme === 'dark' ? '#0f1e35' : '#f1f5f9', border: '1px solid var(--border)', color: '#64748b' }}
            >
              <Calendar size={12} />
              Last 6 Months
            </div>
          </div>
          <BalanceTrendChart />
        </motion.div>

        <motion.div
          variants={item}
          className="p-5 rounded-2xl"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Expense Composition</h2>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#94a3b8' }}>Hover a slice to inspect</p>
          </div>
          <CategorySpendingChart />
        </motion.div>
      </div>

      {/* Weekly Expense Tracker */}
      <motion.div variants={item}>
        <WeeklyExpenseTracker />
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <RecentActivity onViewAll={() => setActiveTab && setActiveTab("transactions")} />
      </motion.div>
    </motion.div>
  );
};