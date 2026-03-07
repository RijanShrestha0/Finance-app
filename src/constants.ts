export const INITIAL_INCOME_CATEGORIES = ['Salary', 'Stock', 'Bonus', 'Investment', 'Gift'];
export const INITIAL_EXPENSE_CATEGORIES = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Health'];

export const CURRENCY_RATES: Record<string, number> = {
  'Rs.': 1,
  '$': 135,
  '€': 145,
  '₹': 1.6,
  'A$': 90
};

export const CURRENCY_OPTIONS = [
  { value: 'Rs.', label: 'NPR (Rs.)' },
  { value: '$', label: 'Dollar ($)' },
  { value: '€', label: 'Euro (€)' },
  { value: '₹', label: 'INR (₹)' },
  { value: 'A$', label: 'AusDollar (A$)' }
];
