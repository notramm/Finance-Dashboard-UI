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
  } catch {
    return dateString;
  }
};