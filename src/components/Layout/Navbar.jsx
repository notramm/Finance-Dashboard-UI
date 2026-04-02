import React from 'react';
import {
  Bell,
  Menu,
  Search,
  Sun,
  Moon,
  User,
  ChevronDown,
  ShieldCheck,
  Eye,
  Settings
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const Navbar = ({ setIsSidebarOpen }) => {
  const { role, toggleRole, theme, toggleTheme } = useFinance();

  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center justify-between px-5 lg:px-8"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(8,15,26,0.95)' : 'rgba(255,255,255,0.95)',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(30,58,95,0.5)' : '#e9edf2'}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: '#64748b' }}
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl w-64"
          style={{
            backgroundColor: theme === 'dark' ? '#0f1e35' : '#f1f5f9',
            border: `1px solid ${theme === 'dark' ? '#1e3a5f' : '#e2e8f0'}`,
          }}
        >
          <Search size={15} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search analytics..."
            className="bg-transparent border-none outline-none text-sm w-full font-medium"
            style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Role Switcher */}
        <div
          className="flex items-center p-1 rounded-xl gap-0.5"
          style={{
            backgroundColor: theme === 'dark' ? '#0f1e35' : '#f1f5f9',
            border: `1px solid ${theme === 'dark' ? '#1e3a5f' : '#e2e8f0'}`,
          }}
        >
          <button
            onClick={() => role !== 'viewer' && toggleRole()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: role === 'viewer' ? (theme === 'dark' ? '#1e3a5f' : '#fff') : 'transparent',
              color: role === 'viewer' ? '#2563eb' : '#94a3b8',
              boxShadow: role === 'viewer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Eye size={13} />
            Viewer
          </button>
          <button
            onClick={() => role !== 'admin' && toggleRole()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: role === 'admin' ? (theme === 'dark' ? '#1e3a5f' : '#fff') : 'transparent',
              color: role === 'admin' ? '#2563eb' : '#94a3b8',
              boxShadow: role === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <ShieldCheck size={13} />
            Admin
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px hidden sm:block" style={{ backgroundColor: theme === 'dark' ? '#1e3a5f' : '#e2e8f0' }} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-colors"
          style={{
            color: '#94a3b8',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#0f1e35' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Settings */}
        <button
          className="p-2 rounded-xl transition-colors hidden sm:flex"
          style={{ color: '#94a3b8' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#0f1e35' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Settings size={18} />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl transition-colors"
          style={{ color: '#94a3b8' }}
          onClick={() => alert("You have no new notifications.")}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#0f1e35' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Bell size={18} />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#ef4444' }}
          />
        </button>

        {/* Profile */}
        <button
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors"
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#0f1e35' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}
          >
            <User size={15} />
          </div>
          <ChevronDown size={13} style={{ color: '#94a3b8' }} className="hidden sm:block" />
        </button>
      </div>
    </header>
  );
};