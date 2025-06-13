
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfMonth, endOfMonth, subMonths, addMonths, startOfYear, endOfYear } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterOptions, Category } from '@/types/expense';

interface FilterControlsProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  categories: Category[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  setFilters,
  categories,
  onPreviousMonth,
  onNextMonth
}) => {
  const [isStartDateOpen, setIsStartDateOpen] = React.useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = React.useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const clearCategoryFilters = () => {
    setFilters(prev => ({ ...prev, categories: [] }));
  };

  const setQuickDateRange = (range: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (range) {
      case 'thisMonth':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      case 'thisYear':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case 'last90Days':
        startDate = subMonths(now, 3);
        endDate = now;
        break;
      default:
        return;
    }

    setFilters(prev => ({ ...prev, startDate, endDate }));
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const currentMonthYear = format(filters.startDate, 'MMMM yyyy');

  return (
    <div className="space-y-6">
      {/* Quick Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold min-w-[150px] text-center">
            {currentMonthYear}
          </h3>
          <Button variant="outline" size="sm" onClick={onNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Date Range Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange('thisMonth')}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange('lastMonth')}
          >
            Last Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange('last90Days')}
          >
            Last 90 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickDateRange('thisYear')}
          >
            This Year
          </Button>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                {format(filters.startDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => {
                  if (date) {
                    setFilters(prev => ({ ...prev, startDate: date }));
                    setIsStartDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                {format(filters.endDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => {
                  if (date) {
                    setFilters(prev => ({ ...prev, endDate: date }));
                    setIsEndDateOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Transaction Type Filter */}
        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value: 'all' | 'income' | 'expense') =>
              setFilters(prev => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Amount */}
        <div className="space-y-2">
          <Label>Min Amount</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.minAmount || ''}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                minAmount: e.target.value ? parseFloat(e.target.value) : undefined
              }))
            }
          />
        </div>

        {/* Max Amount */}
        <div className="space-y-2">
          <Label>Max Amount</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="No limit"
            value={filters.maxAmount || ''}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                maxAmount: e.target.value ? parseFloat(e.target.value) : undefined
              }))
            }
          />
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <Label>Actions</Label>
          <Button
            variant="outline"
            onClick={() =>
              setFilters(prev => ({
                ...prev,
                categories: [],
                minAmount: undefined,
                maxAmount: undefined,
                type: 'all'
              }))
            }
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Filter by Categories</Label>
          {filters.categories.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCategoryFilters}>
              Clear ({filters.categories.length})
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = filters.categories.includes(category.id);
            return (
              <Badge
                key={category.id}
                variant={isSelected ? 'default' : 'outline'}
                className={`cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </Badge>
            );
          })}
        </div>
        
        {filters.categories.length > 0 && (
          <div className="text-sm text-gray-600">
            Filtering by: {filters.categories.map(id => getCategoryName(id)).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;
