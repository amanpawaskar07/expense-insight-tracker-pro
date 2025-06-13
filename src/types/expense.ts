
export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly';
  createdAt: Date;
}

export interface FilterOptions {
  startDate: Date;
  endDate: Date;
  categories: string[];
  minAmount?: number;
  maxAmount?: number;
  type: 'all' | 'income' | 'expense';
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}
