import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (err) {
    return dateString;
  }
};

export const getStatusColor = (type) => {
  return type === 'income' ? 'text-emerald-500' : 'text-rose-500';
};

export const getStatusBg = (type) => {
  return type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10';
};
