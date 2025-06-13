import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download, TrendingUp, TrendingDown, DollarSign, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import CategoryManager from '@/components/CategoryManager';
import BudgetTracker from '@/components/BudgetTracker';
import FilterControls from '@/components/FilterControls';
import ChartsSection from '@/components/ChartsSection';
import { Expense, Category, Budget, FilterOptions } from '@/types/expense';
import { exportToCSV, getDefaultCategories } from '@/utils/expenseUtils';

const Index = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(getDefaultCategories());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    categories: [],
    minAmount: undefined,
    maxAmount: undefined,
    type: 'all'
  });
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedCategories = localStorage.getItem('categories');
    const savedBudgets = localStorage.getItem('budgets');

    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses).map((expense: any) => ({
        ...expense,
        date: new Date(expense.date)
      }));
      setExpenses(parsedExpenses);
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Filter expenses based on current filters
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const dateInRange = expenseDate >= filters.startDate && expenseDate <= filters.endDate;
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(expense.categoryId);
    const amountMatch = (!filters.minAmount || expense.amount >= filters.minAmount) &&
                       (!filters.maxAmount || expense.amount <= filters.maxAmount);
    const typeMatch = filters.type === 'all' || expense.type === filters.type;

    return dateInRange && categoryMatch && amountMatch && typeMatch;
  });

  // Calculate summary statistics
  const totalIncome = filteredExpenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpenses = filteredExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setExpenses(prev => [newExpense, ...prev]);
    setIsFormOpen(false);
    toast({
      title: "Expense Added",
      description: `${expenseData.type === 'income' ? 'Income' : 'Expense'} of $${expenseData.amount} has been added.`,
    });
  };

  const handleEditExpense = (id: string, expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id 
        ? { ...expense, ...expenseData }
        : expense
    ));
    setEditingExpense(null);
    toast({
      title: "Expense Updated",
      description: "Your expense has been successfully updated.",
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed.",
      variant: "destructive"
    });
  };

  const handleExport = () => {
    exportToCSV(filteredExpenses, categories);
    toast({
      title: "Export Successful",
      description: "Your expense data has been exported to CSV.",
    });
  };

  const goToPreviousMonth = () => {
    const newDate = subMonths(filters.startDate, 1);
    setFilters(prev => ({
      ...prev,
      startDate: startOfMonth(newDate),
      endDate: endOfMonth(newDate)
    }));
  };

  const goToNextMonth = () => {
    const newDate = addMonths(filters.startDate, 1);
    setFilters(prev => ({
      ...prev,
      startDate: startOfMonth(newDate),
      endDate: endOfMonth(newDate)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Expense Tracker Pro
              </h1>
              <p className="text-gray-600 mt-2">
                Get insights into your spending habits and take control of your finances
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="border-2"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExport}
                disabled={filteredExpenses.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
                <TrendingDown className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white border-0`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters & Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
            />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ChartsSection 
              expenses={filteredExpenses} 
              categories={categories}
              dateRange={filters}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <p className="text-sm text-gray-600">
                  Showing {filteredExpenses.length} transactions for {format(filters.startDate, 'MMM yyyy')}
                </p>
              </CardHeader>
              <CardContent>
                <ExpenseList
                  expenses={filteredExpenses}
                  categories={categories}
                  onEdit={setEditingExpense}
                  onDelete={handleDeleteExpense}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetTracker
              budgets={budgets}
              setBudgets={setBudgets}
              categories={categories}
              expenses={filteredExpenses}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager
              categories={categories}
              setCategories={setCategories}
            />
          </TabsContent>
        </Tabs>

        {/* Add/Edit Expense Form */}
        {(isFormOpen || editingExpense) && (
          <ExpenseForm
            isOpen={isFormOpen || !!editingExpense}
            onClose={() => {
              setIsFormOpen(false);
              setEditingExpense(null);
            }}
            onSubmit={editingExpense ? 
              (data) => handleEditExpense(editingExpense.id, data) : 
              handleAddExpense
            }
            categories={categories}
            expense={editingExpense}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
