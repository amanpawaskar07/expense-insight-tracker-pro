
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, startOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { Expense, Category, FilterOptions } from '@/types/expense';

interface ChartsSectionProps {
  expenses: Expense[];
  categories: Category[];
  dateRange: FilterOptions;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ expenses, categories, dateRange }) => {
  // Prepare data for pie chart (spending by category)
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(
      expense => expense.categoryId === category.id && expense.type === 'expense'
    );
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color
    };
  }).filter(item => item.value > 0);

  // Prepare data for daily spending trend
  const getDailyData = () => {
    const days = eachDayOfInterval({ start: dateRange.startDate, end: dateRange.endDate });
    return days.map(day => {
      const dayExpenses = expenses.filter(expense => 
        startOfDay(new Date(expense.date)).getTime() === startOfDay(day).getTime()
      );
      const expenseAmount = dayExpenses
        .filter(expense => expense.type === 'expense')
        .reduce((sum, expense) => sum + expense.amount, 0);
      const incomeAmount = dayExpenses
        .filter(expense => expense.type === 'income')
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        date: format(day, 'MMM dd'),
        expenses: expenseAmount,
        income: incomeAmount,
        net: incomeAmount - expenseAmount
      };
    });
  };

  const dailyData = getDailyData();

  // Prepare cumulative data for line chart
  const getCumulativeData = () => {
    let cumulativeIncome = 0;
    let cumulativeExpenses = 0;
    
    return dailyData.map(day => {
      cumulativeIncome += day.income;
      cumulativeExpenses += day.expenses;
      return {
        date: day.date,
        cumulativeIncome,
        cumulativeExpenses,
        balance: cumulativeIncome - cumulativeExpenses
      };
    });
  };

  const cumulativeData = getCumulativeData();

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Pie Chart - Spending by Category */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrency} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
          
          {/* Legend */}
          {categoryData.length > 0 && (
            <div className="mt-4 space-y-2">
              {categoryData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-medium">${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Daily Income vs Expenses */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartIcon className="w-5 h-5 text-green-600" />
            Daily Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={formatCurrency}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Line Chart - Cumulative Balance */}
      <Card className="col-span-1 lg:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-purple-600" />
            Balance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={formatCurrency}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Balance"
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
