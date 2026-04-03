import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Navbar } from './components/Layout/Navbar';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { TransactionList } from './components/Transactions/TransactionList';
import { FilterBar } from './components/Transactions/FilterBar';
import { InsightsPanel } from './components/Insights/InsightsPanel';
import { Modal } from './components/Common/Modal';
import { TransactionForm } from './components/Transactions/TransactionForm';
import { useFinance } from './context/FinanceContext';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { theme } = useFinance();

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'transactions':
        return (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#2563eb' }}>
                Records
              </p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                Transactions
              </h1>
              <p className="text-sm font-medium mt-0.5" style={{ color: '#94a3b8' }}>
                Track and manage every cent of your activity.
              </p>
            </div>
            {/* FilterBar has export + add transaction here */}
            <FilterBar onAddClick={handleAddTransaction} />
            <TransactionList onEditClick={handleEditTransaction} />
          </div>
        );
      case 'insights':
        return <InsightsPanel />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-24" style={{ color: '#94a3b8' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Coming Soon</h2>
            <p className="text-sm font-medium">We're working hard to bring you more features.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)', fontFamily: 'Outfit, sans-serif' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm
          transaction={editingTransaction}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default App;