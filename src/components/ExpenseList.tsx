
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search } from 'lucide-react';
import { Expense, Category } from '@/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  categories,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || '#gray-500';
  };

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(expense.categoryId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'category':
        aValue = getCategoryName(a.categoryId);
        bValue = getCategoryName(b.categoryId);
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No transactions found for the selected period.</p>
        <p className="text-gray-400 mt-2">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 text-right"
                onClick={() => handleSort('amount')}
              >
                Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExpenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                    />
                    {getCategoryName(expense.categoryId)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={expense.description}>
                    {expense.description || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={expense.type === 'income' ? 'default' : 'secondary'}
                    className={expense.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {expense.type === 'income' ? 'Income' : 'Expense'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  <span className={expense.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(expense)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredExpenses.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions match your search.</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
