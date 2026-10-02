import React, { useState } from 'react';
import { Search, PieChart, Receipt } from 'lucide-react';
import { MonthlySummary, Expense } from '@/types';
import { MonthSelector } from '@/components/MonthSelector';
import { ExpenseCard } from '@/components/ExpenseCard';
import { CategoryIcon } from './../components/CategoryIcon';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/utils/currency';

interface SummaryViewProps {
  summary: MonthlySummary;
  monthExpenses: Expense[];
  currency: string;
  selectedMonthKey: string;
  onSelectMonth: (monthKey: string) => void;
  availableMonthKeys: string[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onViewCategoryHistory?: (categoryId: string) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  monthExpenses,
  currency,
  selectedMonthKey,
  onSelectMonth,
  availableMonthKeys,
  onEditExpense,
  onDeleteExpense,
  onViewCategoryHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const filteredExpenses = monthExpenses.filter((e) => {
    const matchesSearch =
      (e.note && e.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.categoryName && e.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.amount.toString().includes(searchQuery);

    const matchesCategory =
      selectedFilterCategory === 'all' || e.categoryId === selectedFilterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Month Navigator in Light Glass */}
      <MonthSelector
        selectedMonthKey={selectedMonthKey}
        onSelectMonth={onSelectMonth}
        availableMonthKeys={availableMonthKeys}
      />

      {/* Monthly Overview Card in Light Glass */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-[0_4px_20px_rgba(28,25,23,0.02)] flex flex-col gap-4">
        <div className="border-b border-stone-200/50 pb-3">
          <span className="text-xs uppercase font-extrabold tracking-wider text-stone-500">
            {summary.monthLabel} Analytics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-semibold">Total Spent</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {formatCurrency(summary.totalSpent, currency)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-semibold">Total Transactions</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {summary.transactionCount}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">
              {summary.transactionCount === 1 ? 'transaction' : 'transactions'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-semibold">Daily Average</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {formatCurrency(summary.dailyAverage, currency)}
            </span>
            <span className="text-[11px] text-stone-400 font-medium">per active day</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-semibold">Top Expense Category</span>
            {summary.highestCategory ? (
              <span className="text-base sm:text-lg font-bold text-stone-900 mt-1 flex items-center gap-1.5 truncate">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: summary.highestCategory.color }}
                />
                <span className="truncate">{summary.highestCategory.name}</span>
                <span className="text-xs text-stone-400 shrink-0">({summary.highestCategory.percentage}%)</span>
              </span>
            ) : (
              <span className="text-sm font-semibold text-stone-400 mt-1">None yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown Distributions */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-[0_4px_20px_rgba(28,25,23,0.02)] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#B85D38]" />
          <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
            Spending by Category
          </h3>
        </div>

        {summary.categories.length === 0 ? (
          <p className="text-xs text-stone-400 py-4 text-center">
            No spending recorded for this month.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {summary.categories.map((cat) => (
              <div
                key={cat.categoryId}
                onClick={() => onViewCategoryHistory && onViewCategoryHistory(cat.categoryId)}
                className="flex flex-col gap-1.5 p-2.5 -mx-2.5 rounded-2xl hover:bg-white border border-transparent hover:border-stone-200/50 transition-all cursor-pointer group"
                title="Click to view all expenses in this category"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-stone-800">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: `${cat.categoryColor}20`,
                        color: cat.categoryColor,
                      }}
                    >
                      <CategoryIcon name={cat.categoryIcon} size={15} />
                    </div>
                    <span className="text-sm font-bold text-stone-900 group-hover:text-[#B85D38] transition-colors">
                      {cat.categoryName}
                    </span>
                    <span className="text-[11px] text-stone-400 font-semibold">
                      ({cat.transactionCount} {cat.transactionCount === 1 ? 'entry' : 'entries'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-extrabold">
                    <span className="text-stone-900 text-sm">
                      {formatCurrency(cat.totalAmount, currency)}
                    </span>
                    <span className="text-[#B85D38] bg-[#B85D38]/10 border border-[#B85D38]/15 px-2 py-0.5 rounded-full text-[11px]">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(3, cat.percentage))}%`,
                      backgroundColor: cat.categoryColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chronological Transaction List with Search in Light Glass */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#B85D38]" />
            <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
              Month Transactions
            </h3>
            <span className="text-xs text-stone-400 font-semibold">
              ({filteredExpenses.length})
            </span>
          </div>

          {/* Search bar in Frosted Glass */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in note or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200/80 bg-white/70 backdrop-blur-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#B85D38] focus:bg-white"
            />
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <EmptyState
            title="No Matching Expenses"
            description={
              searchQuery
                ? 'Try a different search term.'
                : 'No transactions found for this month.'
            }
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                currency={currency}
                onEdit={onEditExpense}
                onDelete={onDeleteExpense}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
