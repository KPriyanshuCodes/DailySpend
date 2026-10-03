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
    <div className="flex flex-col gap-4 pb-24">
      {/* Month Navigator in Light Glass */}
      <MonthSelector
        selectedMonthKey={selectedMonthKey}
        onSelectMonth={onSelectMonth}
        availableMonthKeys={availableMonthKeys}
      />

      {/* Monthly Overview Card in Light Glass */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-4">
        <div className="border-b border-neutral-100 pb-2.5">
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">
            {summary.monthLabel} Overview
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium">Total Spent</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 font-mono tabular-nums">
              {formatCurrency(summary.totalSpent, currency)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium">Total Entries</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 font-mono tabular-nums">
              {summary.transactionCount}
            </span>
            <span className="text-[11px] text-neutral-400">
              {summary.transactionCount === 1 ? 'transaction' : 'transactions'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium">Daily Average</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 font-mono tabular-nums">
              {formatCurrency(summary.dailyAverage, currency)}
            </span>
            <span className="text-[11px] text-neutral-400">per active day</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium">Top Category</span>
            {summary.highestCategory ? (
              <span className="text-base font-bold text-neutral-900 mt-1 truncate">
                {summary.highestCategory.name}{' '}
                <span className="text-xs text-neutral-400 font-normal">
                  ({summary.highestCategory.percentage}%)
                </span>
              </span>
            ) : (
              <span className="text-sm font-semibold text-neutral-400 mt-1">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown Distributions */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <PieChart className="w-4 h-4 text-neutral-700" />
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Spending by Category
          </h3>
        </div>

        {summary.categories.length === 0 ? (
          <p className="text-xs text-neutral-400 py-3 text-center">
            No spending recorded for this month.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-100/80">
            {summary.categories.map((cat) => (
              <div
                key={cat.categoryId}
                onClick={() => onViewCategoryHistory && onViewCategoryHistory(cat.categoryId)}
                className="py-2.5 px-1 -mx-1 rounded-xl hover:bg-white/60 transition-all cursor-pointer flex flex-col gap-1.5 group"
                title="Click to view all expenses in this category"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 font-semibold text-neutral-900">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/50 flex items-center justify-center shrink-0 text-neutral-700">
                      <CategoryIcon name={cat.categoryIcon} size={14} />
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                      {cat.categoryName}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-normal">
                      · {cat.transactionCount} {cat.transactionCount === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-bold font-mono">
                    <span className="text-neutral-900 text-sm tabular-nums">
                      {formatCurrency(cat.totalAmount, currency)}
                    </span>
                    <span className="text-neutral-500 text-xs font-medium">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-neutral-800 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(3, cat.percentage))}%`,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Transactions
            </h3>
            <span className="text-xs text-neutral-400 font-medium tabular-nums">
              ({filteredExpenses.length})
            </span>
          </div>

          {/* Search bar in Frosted Glass */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search note or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200/80 bg-white/70 backdrop-blur-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
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
          <div className="flex flex-col gap-2">
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
