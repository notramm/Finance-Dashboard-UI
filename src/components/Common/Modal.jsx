import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const { theme } = useFinance();
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative w-full max-w-md overflow-hidden"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
            borderRadius: '20px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${isDark ? '#1e3a5f' : '#f1f5f9'}` }}
          >
            <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? '#0f1e35' : '#f1f5f9'; e.currentTarget.style.color = 'var(--foreground)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};