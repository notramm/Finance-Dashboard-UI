import React from 'react';
import { Search, Download, Plus, SlidersHorizontal } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';

export const FilterBar = ({ onAddClick }) => {
  const { filters, setFilters, role, transactions, theme } = useFinance();
  const isDark = theme === 'dark';

  const handleSearch = (e) => setFilters(p => ({ ...p, search: e.target.value }));
  const handleType = (e) => setFilters(p => ({ ...p, type: e.target.value }));
  const handleCategory = (e) => setFilters(p => ({ ...p, category: e.target.value }));

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.amount,
      t.category,
      t.type
    ]);
    const csv = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputStyle = {
    backgroundColor: 'var(--card-bg)',
    border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
    color: 'var(--foreground)',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    fontSize: '13px',
    fontWeight: 500,
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
      {/* Left: Search + Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#94a3b8' }}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 transition-all"
            style={inputStyle}
          />
        </div>

        {/* Selects */}
        <div className="flex items-center gap-2.5">
          <select
            value={filters.type}
            onChange={handleType}
            className="px-3 py-2.5 cursor-pointer transition-all"
            style={inputStyle}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={handleCategory}
            className="px-3 py-2.5 cursor-pointer transition-all max-w-40"
            style={inputStyle}
          >
            <option value="all">All Categories</option>
            {[...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            border: `1px solid ${isDark ? '#1e3a5f' : '#e2e8f0'}`,
            color: '#64748b',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.borderColor = isDark ? '#1e3a5f' : '#e2e8f0'}
        >
          <Download size={14} />
          Export
        </button>

        {role === 'admin' && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
          >
            <Plus size={14} />
            Add Transaction
          </button>
        )}
      </div>
    </div>
  );
};