import { subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO, isSameDay } from 'date-fns';

export const CATEGORIES = {
  INCOME: ['Salary', 'Freelance Income', 'Investment', 'Other Income'],
  EXPENSE: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Travel', 'Education', 'Other Expense']
};

export const COLORS = {
  Food: '#f87171',
  Transport: '#fb923c',
  Shopping: '#fbbf24',
  Entertainment: '#818cf8',
  Bills: '#34d399',
  Health: '#f472b6',
  Travel: '#2dd4bf',
  Education: '#a78bfa',
  Other: '#94a3b8',
  Salary: '#10b981',
  'Freelance Income': '#3b82f6',
  Investment: '#6366f1',
  'Other Income': '#64748b'
};

const generateMockTransactions = () => {
  const transactions = [];
  const now = new Date(2026, 3, 2); // April 2, 2026
  
  // Salary - once a month
  for (let i = 0; i < 3; i++) {
    const date = startOfMonth(subMonths(now, i));
    transactions.push({
      id: `salary-${i}`,
      description: 'Monthly Salary - Tech Corp',
      amount: 5500,
      category: 'Salary',
      type: 'income',
      date: format(date, "yyyy-MM-dd'T'HH:mm:ss")
    });
  }

  // Freelance - occasional
  const freelanceProjects = [
    { desc: 'Web Development Project', amount: 1200, date: new Date(2026, 3, 1) },
    { desc: 'App Design Consultation', amount: 850, date: new Date(2026, 2, 15) },
    { desc: 'API Integration Work', amount: 1500, date: new Date(2026, 1, 10) },
    { desc: 'UI/UX Audit', amount: 600, date: new Date(2026, 2, 5) }
  ];

  freelanceProjects.forEach((p, idx) => {
    transactions.push({
      id: `freelance-${idx}`,
      description: p.desc,
      amount: p.amount,
      category: 'Freelance Income',
      type: 'income',
      date: format(p.date, "yyyy-MM-dd'T'HH:mm:ss")
    });
  });

  // Regular Expenses (Food, Transport, etc.)
  const expenseTemplates = [
    { desc: 'Grocery Shopping', categories: ['Food'], amountRange: [40, 120] },
    { desc: 'Uber Ride', categories: ['Transport'], amountRange: [10, 35] },
    { desc: 'Dinner with friends', categories: ['Food'], amountRange: [30, 80] },
    { desc: 'Coffee Shop', categories: ['Food'], amountRange: [5, 15] },
    { desc: 'Gas Station', categories: ['Transport'], amountRange: [45, 65] },
    { desc: 'Amazon Purchase', categories: ['Shopping'], amountRange: [20, 150] },
    { desc: 'Netflix Subscription', categories: ['Entertainment'], amount: 15.99 },
    { desc: 'Internet Bill', categories: ['Bills'], amount: 79.99 },
    { desc: 'Electricity Bill', categories: ['Bills'], amount: 120.50 },
    { desc: 'Movie Tickets', categories: ['Entertainment'], amountRange: [25, 45] },
    { desc: 'Pharmacy', categories: ['Health'], amountRange: [15, 50] },
    { desc: 'Gym Membership', categories: ['Health'], amount: 50 },
    { desc: 'Cloud Storage', categories: ['Bills'], amount: 9.99 }
  ];

  // Generate around 40 more random expenses
  for (let i = 0; i < 40; i++) {
    const template = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
    const date = new Date(2026, Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 28) + 1);
    
    // Ensure date is not in the future beyond April 2
    if (date > now) continue;

    const amount = template.amountRange 
      ? Math.floor(Math.random() * (template.amountRange[1] - template.amountRange[0]) + template.amountRange[0])
      : template.amount;

    transactions.push({
      id: `expense-${i}`,
      description: template.desc,
      amount: Number(amount),
      category: template.categories[0],
      type: 'expense',
      date: format(date, "yyyy-MM-dd'T'HH:mm:ss")
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const MOCK_TRANSACTIONS = generateMockTransactions();
