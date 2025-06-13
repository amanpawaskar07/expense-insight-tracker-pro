
import { Expense, Category } from '@/types/expense';

export const getDefaultCategories = (): Category[] => [
  { id: '1', name: 'Food & Dining', color: '#ef4444', icon: '🍔' },
  { id: '2', name: 'Transportation', color: '#f97316', icon: '🚗' },
  { id: '3', name: 'Utilities', color: '#eab308', icon: '⚡' },
  { id: '4', name: 'Entertainment', color: '#8b5cf6', icon: '🎬' },
  { id: '5', name: 'Shopping', color: '#ec4899', icon: '🛒' },
  { id: '6', name: 'Healthcare', color: '#06b6d4', icon: '💊' },
  { id: '7', name: 'Education', color: '#10b981', icon: '🎓' },
  { id: '8', name: 'Salary', color: '#22c55e', icon: '💰' },
  { id: '9', name: 'Housing', color: '#6366f1', icon: '🏠' },
  { id: '10', name: 'Personal Care', color: '#d946ef', icon: '💅' }
];

export const exportToCSV = (expenses: Expense[], categories: Category[]) => {
  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  // Create CSV headers
  const headers = ['Date', 'Category', 'Description', 'Type', 'Amount'];
  
  // Convert expenses to CSV rows
  const rows = expenses.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    getCategoryName(expense.categoryId),
    expense.description || '',
    expense.type === 'income' ? 'Income' : 'Expense',
    expense.amount.toFixed(2)
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculateCategoryTotals = (expenses: Expense[], categories: Category[], type?: 'income' | 'expense') => {
  return categories.map(category => {
    const categoryExpenses = expenses.filter(expense => 
      expense.categoryId === category.id && 
      (type ? expense.type === type : true)
    );
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      category,
      total,
      count: categoryExpenses.length
    };
  }).filter(item => item.total > 0);
};
