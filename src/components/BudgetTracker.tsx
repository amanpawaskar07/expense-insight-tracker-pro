
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Budget, Category, Expense } from '@/types/expense';
import { useToast } from '@/hooks/use-toast';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

interface BudgetTrackerProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  categories: Category[];
  expenses: Expense[];
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  budgets,
  setBudgets,
  categories,
  expenses
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly'
  });
  const { toast } = useToast();

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || '#gray-500';
  };

  const getSpentAmount = (budget: Budget) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (budget.period === 'weekly') {
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
    } else {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

    return expenses
      .filter(expense => 
        expense.type === 'expense' &&
        expense.categoryId === budget.categoryId &&
        new Date(expense.date) >= startDate &&
        new Date(expense.date) <= endDate
      )
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getBudgetStatus = (budget: Budget, spent: number) => {
    const percentage = (spent / budget.amount) * 100;
    
    if (percentage >= 100) return { status: 'exceeded', color: 'bg-red-500' };
    if (percentage >= 80) return { status: 'warning', color: 'bg-orange-500' };
    if (percentage >= 50) return { status: 'moderate', color: 'bg-yellow-500' };
    return { status: 'good', color: 'bg-green-500' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Budget amount must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    if (editingBudget) {
      // Edit existing budget
      setBudgets(prev => prev.map(budget => 
        budget.id === editingBudget.id 
          ? { ...budget, categoryId: formData.categoryId, amount, period: formData.period }
          : budget
      ));
      toast({
        title: "Budget Updated",
        description: `Budget for "${getCategoryName(formData.categoryId)}" has been updated.`,
      });
    } else {
      // Check if budget already exists for this category and period
      const existingBudget = budgets.find(
        budget => budget.categoryId === formData.categoryId && budget.period === formData.period
      );

      if (existingBudget) {
        toast({
          title: "Budget Exists",
          description: `A ${formData.period} budget for this category already exists.`,
          variant: "destructive"
        });
        return;
      }

      // Add new budget
      const newBudget: Budget = {
        id: Date.now().toString(),
        categoryId: formData.categoryId,
        amount,
        period: formData.period,
        createdAt: new Date()
      };
      setBudgets(prev => [...prev, newBudget]);
      toast({
        title: "Budget Added",
        description: `${formData.period.charAt(0).toUpperCase() + formData.period.slice(1)} budget for "${getCategoryName(formData.categoryId)}" has been set.`,
      });
    }

    // Reset form
    setFormData({ categoryId: '', amount: '', period: 'monthly' });
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setIsFormOpen(true);
  };

  const handleDelete = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
      toast({
        title: "Budget Deleted",
        description: `Budget for "${getCategoryName(budget.categoryId)}" has been removed.`,
        variant: "destructive"
      });
    }
  };

  const openAddForm = () => {
    setEditingBudget(null);
    setFormData({ categoryId: '', amount: '', period: 'monthly' });
    setIsFormOpen(true);
  };

  // Get available categories (not already budgeted for the selected period)
  const getAvailableCategories = () => {
    if (editingBudget) return categories;
    
    return categories.filter(category => {
      return !budgets.some(budget => 
        budget.categoryId === category.id && budget.period === formData.period
      );
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Budget Tracking
            </CardTitle>
            <Button onClick={openAddForm} className="bg-gradient-to-r from-green-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Set Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {budgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const spent = getSpentAmount(budget);
                const remaining = budget.amount - spent;
                const percentage = Math.min((spent / budget.amount) * 100, 100);
                const { status, color } = getBudgetStatus(budget, spent);

                return (
                  <Card key={budget.id} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getCategoryColor(budget.categoryId) }}
                          />
                          <h3 className="font-semibold">{getCategoryName(budget.categoryId)}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(budget)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(budget.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spent: ${spent.toFixed(2)}</span>
                          <span>Budget: ${budget.amount.toFixed(2)}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="flex justify-between items-center text-sm">
                          <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {remaining >= 0 ? 'Remaining' : 'Over budget'}: ${Math.abs(remaining).toFixed(2)}
                          </span>
                          <span className="text-gray-500">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Status Alert */}
                      {status === 'exceeded' && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Budget exceeded!</span>
                        </div>
                      )}
                      {status === 'warning' && (
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-2 rounded">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Approaching limit</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No budgets set</h3>
              <p className="text-gray-400 mb-4">
                Set budgets for your categories to track your spending and stay on target.
              </p>
              <Button onClick={openAddForm} className="bg-gradient-to-r from-green-600 to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Set Your First Budget
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Budget Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) {
          setEditingBudget(null);
          setFormData({ categoryId: '', amount: '', period: 'monthly' });
        }
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? 'Edit Budget' : 'Set New Budget'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Period Selection */}
            <div className="space-y-2">
              <Label>Budget Period *</Label>
              <Select
                value={formData.period}
                onValueChange={(value: 'weekly' | 'monthly') => 
                  setFormData(prev => ({ ...prev, period: value, categoryId: '' }))
                }
                disabled={!!editingBudget}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                disabled={!!editingBudget}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategories().map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget Amount */}
            <div className="space-y-2">
              <Label>Budget Amount *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
              >
                {editingBudget ? 'Update' : 'Set'} Budget
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetTracker;
