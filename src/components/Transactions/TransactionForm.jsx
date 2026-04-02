import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';
import { Save, AlertCircle, ShieldCheck } from 'lucide-react';

const inputStyle = (isDark, error) => ({
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  backgroundColor: isDark ? '#0f1e35' : '#f8fafc',
  border: `1px solid ${error ? '#ef4444' : isDark ? '#1e3a5f' : '#e2e8f0'}`,
  color: isDark ? '#f1f5f9' : '#0f172a',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.15s',
});

const Label = ({ children }) => (
  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-0.5" style={{ color: '#94a3b8' }}>
    {children}
  </label>
);

export const TransactionForm = ({ transaction, onSuccess }) => {
  const { addTransaction, updateTransaction, role, toggleRole, theme } = useFinance();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: transaction.date.split('T')[0],
        amount: transaction.amount.toString()
      });
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (role !== 'admin') { setError('Only admins can add or edit transactions.'); return; }
    if (!formData.description || !formData.amount || !formData.date) { setError('Please fill in all required fields.'); return; }

    const data = { ...formData, amount: parseFloat(formData.amount) };
    transaction ? updateTransaction(data) : addTransaction(data);
    onSuccess();
  };

  const categories = formData.type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;

  if (role !== 'admin') {
    return (
      <div className="py-6 text-center space-y-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
        >
          <ShieldCheck size={22} style={{ color: '#ef4444' }} />
        </div>
        <div>
          <p className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Viewer Access Only</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Switch to Admin role to add or edit transactions.
          </p>
        </div>
        <button
          onClick={toggleRole}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}
        >
          Switch to Admin
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444',
          }}
        >
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Type toggle */}
      <div
        className="grid grid-cols-2 gap-2 p-1 rounded-xl"
        style={{ backgroundColor: isDark ? '#0f1e35' : '#f1f5f9' }}
      >
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFormData(p => ({ ...p, type: t, category: t === 'income' ? CATEGORIES.INCOME[0] : CATEGORIES.EXPENSE[0] }))}
            className="py-2 rounded-lg text-sm font-bold capitalize transition-all"
            style={{
              backgroundColor: formData.type === t ? (t === 'expense' ? '#ef4444' : '#10b981') : 'transparent',
              color: formData.type === t ? '#fff' : '#94a3b8',
              boxShadow: formData.type === t ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <input
          placeholder="e.g. Monthly Rent, Grocery Shopping"
          value={formData.description}
          onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
          style={inputStyle(isDark)}
          onFocus={e => e.target.style.borderColor = '#2563eb'}
          onBlur={e => e.target.style.borderColor = isDark ? '#1e3a5f' : '#e2e8f0'}
        />
      </div>

      {/* Amount + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Amount ($)</Label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
            style={inputStyle(isDark)}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = isDark ? '#1e3a5f' : '#e2e8f0'}
          />
        </div>
        <div>
          <Label>Category</Label>
          <select
            value={formData.category}
            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
            style={inputStyle(isDark)}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = isDark ? '#1e3a5f' : '#e2e8f0'}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <Label>Date</Label>
        <input
          type="date"
          value={formData.date}
          onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
          style={inputStyle(isDark)}
          onFocus={e => e.target.style.borderColor = '#2563eb'}
          onBlur={e => e.target.style.borderColor = isDark ? '#1e3a5f' : '#e2e8f0'}
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <Save size={16} />
            {transaction ? 'Update Transaction' : 'Save Transaction'}
          </span>
        </button>
      </div>
    </form>
  );
};