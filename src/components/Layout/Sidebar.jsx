import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Settings,
  LogOut,
  X,
  Wallet
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFinance } from '../../context/FinanceContext';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { signOut } = useFinance();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col',
          !isOpen && '-translate-x-full'
        )}
        style={{ backgroundColor: '#0f1e35' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2563eb' }}>
            <Wallet size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-sm tracking-tight">Personal</p>
            <p className="text-xs font-medium" style={{ color: '#3b82f6' }}>Finance</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto lg:hidden p-1 rounded-md transition-colors"
            style={{ color: '#64748b' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
            Navigation
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative group',
                )}
                style={{
                  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: isActive ? '#60a5fa' : '#64748b',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full" style={{ backgroundColor: '#3b82f6' }} />
                )}
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
            style={{ color: '#64748b' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};