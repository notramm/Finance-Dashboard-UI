import React from 'react';
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Percent,
  Calendar,
  Download,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { StatCard } from './StatCard';
import { BalanceTrendChart } from './BalanceTrendChart';
import { CategorySpendingChart } from './CategorySpendingChart';
import { RecentActivity } from './RecentActivity';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export const DashboardOverview = () => {
  const { stats, role, theme } = useFinance();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#2563eb' }}>
            Financial Overview
          </p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              color: '#64748b',
            }}
          >
            <Download size={15} />
            Export Report
          </button>
          {role === 'admin' && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}
            >
              <Plus size={15} />
              Add Transaction
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <StatCard
            title="Total Balance"
            amount={stats.balance}
            icon={Wallet}
            trend={12.5}
            colorClass="primary"
            subtitle="+12.5% this month"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Income"
            amount={stats.totalIncome}
            icon={ArrowUpCircle}
            trend={8.2}
            colorClass="emerald"
            subtitle="+8.2% from last month"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Expenses"
            amount={stats.totalExpenses}
            icon={ArrowDownCircle}
            trend={-4.1}
            trendType="down"
            colorClass="rose"
            subtitle="85% of monthly budget"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Savings Rate"
            amount={`${stats.savingsRate}%`}
            icon={Percent}
            trend={2.4}
            colorClass="violet"
            subtitle="Great progress!"
          />
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Balance Trend */}
        <motion.div
          variants={item}
          className="lg:col-span-2 p-5 rounded-2xl"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Balance Trend</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#94a3b8' }}>
                Growth trajectory over the last 6 months
              </p>
            </div>
            <div
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{
                backgroundColor: theme === 'dark' ? '#0f1e35' : '#f1f5f9',
                border: '1px solid var(--border)',
                color: '#64748b',
              }}
            >
              <Calendar size={12} />
              Last 6 Months
            </div>
          </div>
          <BalanceTrendChart />
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div
          variants={item}
          className="p-5 rounded-2xl"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div className="mb-5">
            <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Spending Breakdown</h2>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#94a3b8' }}>
              Categorical distribution
            </p>
          </div>
          <CategorySpendingChart />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <RecentActivity />
      </motion.div>
    </motion.div>
  );
};