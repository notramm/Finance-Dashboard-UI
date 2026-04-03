import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Menu, Search, Sun, Moon,
  ShieldCheck, Eye, Settings, ChevronDown,
  User, LogOut, UserCircle, HelpCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const Navbar = ({ setIsSidebarOpen }) => {
  const { role, toggleRole, theme, toggleTheme, signOut } = useFinance();
  const isDark = theme === 'dark';
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const headerBg = isDark ? 'rgba(8,15,26,0.95)' : 'rgba(255,255,255,0.95)';
  const borderBtm = isDark ? 'rgba(30,58,95,0.5)' : '#e9edf2';
  const pillBg = isDark ? '#0f1e35' : '#f1f5f9';
  const pillBorder = isDark ? '#1e3a5f' : '#e2e8f0';
  const divider = isDark ? '#1e3a5f' : '#e2e8f0';
  const iconColor = '#94a3b8';
  const hoverBg = isDark ? '#0f1e35' : '#f1f5f9';

  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center justify-between px-5 lg:px-8"
      style={{
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderBtm}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: iconColor }}
        >
          <Menu size={20} />
        </button>

        <div
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl w-64"
          style={{ backgroundColor: pillBg, border: `1px solid ${pillBorder}` }}
        >
          <Search size={15} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search analytics..."
            className="bg-transparent border-none outline-none text-sm w-full font-medium"
            style={{ color: isDark ? '#94a3b8' : '#64748b', fontFamily: 'Outfit, sans-serif' }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Role Switcher */}
        <div
          className="flex items-center p-1 rounded-xl gap-0.5"
          style={{ backgroundColor: pillBg, border: `1px solid ${pillBorder}` }}
        >
          {[
            { id: 'viewer', label: 'Viewer', Icon: Eye },
            { id: 'admin', label: 'Admin', Icon: ShieldCheck },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => role !== id && toggleRole()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: role === id ? (isDark ? '#1e3a5f' : '#fff') : 'transparent',
                color: role === id ? '#2563eb' : '#94a3b8',
                boxShadow: role === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px hidden sm:block" style={{ backgroundColor: divider }} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-colors"
          style={{ color: iconColor }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl transition-colors"
          style={{ color: iconColor }}
          onClick={() => alert('No new notifications.')}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Bell size={18} />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#ef4444' }}
          />
        </button>

        <div className="h-5 w-px hidden sm:block" style={{ backgroundColor: divider }} />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors"
            onClick={() => setProfileOpen(p => !p)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
            onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
            style={{ backgroundColor: profileOpen ? hoverBg : 'transparent' }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}
            >
              <User size={15} />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>Velora User</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                {role}
              </p>
            </div>
            <ChevronDown
              size={13}
              style={{
                color: '#94a3b8',
                transition: 'transform 0.2s',
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              className="hidden sm:block"
            />
          </button>

          {/* Dropdown menu */}
          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden py-1.5 z-50"
              style={{
                backgroundColor: isDark ? '#0f1e35' : '#fff',
                border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
                boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
              }}
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b" style={{ borderColor: isDark ? '#1e3a5f' : '#f1f5f9' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Velora User</p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  {role === 'admin' ? 'Administrator' : 'Viewer'} · Velora Finance
                </p>
              </div>

              {/* Menu items */}
              {[
                { icon: UserCircle, label: 'View Profile', action: () => { alert('Profile page coming soon!'); setProfileOpen(false); } },
                { icon: Settings, label: 'Settings', action: () => { alert('Settings coming soon!'); setProfileOpen(false); } },
                { icon: HelpCircle, label: 'Help Center', action: () => { alert('Help center coming soon!'); setProfileOpen(false); } },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left"
                  style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(30,58,95,0.4)' : '#f8fafc'; e.currentTarget.style.color = 'var(--foreground)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}

              <div className="my-1 mx-3 border-t" style={{ borderColor: isDark ? '#1e3a5f' : '#f1f5f9' }} />

              {/* Role switcher within dropdown */}
              <div className="px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Switch Role</p>
                <div
                  className="flex rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}` }}
                >
                  {['viewer', 'admin'].map((r) => (
                    <button
                      key={r}
                      onClick={() => { if (role !== r) toggleRole(); }}
                      className="flex-1 py-1.5 text-xs font-bold capitalize transition-all"
                      style={{
                        backgroundColor: role === r ? '#2563eb' : 'transparent',
                        color: role === r ? '#fff' : '#94a3b8',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-1 mx-3 border-t" style={{ borderColor: isDark ? '#1e3a5f' : '#f1f5f9' }} />

              {/* Sign out */}
              <button
                onClick={() => { signOut(); setProfileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left"
                style={{ color: '#ef4444' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};