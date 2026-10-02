import React from 'react';
import { Plus, PieChart, ArrowRight } from 'lucide-react';
import { MonthlySummary, Expense } from '@/types';
import { SummaryCard } from '@/components/SummaryCard';
import { MonthSelector } from '@/components/MonthSelector';
import { ExpenseCard } from '@/components/ExpenseCard';
import { EmptyState } from '@/components/EmptyState';
import { CategoryIcon } from '@/components/CategoryIcon';
import { formatCurrency } from '@/utils/currency';

interface DashboardViewProps {
  summary: MonthlySummary;
  recentExpenses: Expense[];
  currency: string;
  selectedMonthKey: string;
  onSelectMonth: (monthKey: string) => void;
  availableMonthKeys: string[];
  hasCategories: boolean;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onNavigateToSummary: () => void;
  onNavigateToCategories: () => void;
  onViewCategoryHistory?: (categoryId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  recentExpenses,
  currency,
  selectedMonthKey,
  onSelectMonth,
  availableMonthKeys,
  hasCategories,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onNavigateToSummary,
  onNavigateToCategories,
  onViewCategoryHistory,
}) => {
  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Month Selector in Light Glass */}
      <MonthSelector
        selectedMonthKey={selectedMonthKey}
        onSelectMonth={onSelectMonth}
        availableMonthKeys={availableMonthKeys}
      />

      {/* Summary KPI Cards in Light Glass */}
      <SummaryCard summary={summary} currency={currency} />

      {/* Category Breakdown Preview (Top 4) in Light Glass */}
      <div className="bg-white/75 backdrop-blur-md border border-white/90 rounded-3xl p-5 shadow-[0_4px_20px_rgba(28,25,23,0.02)] flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#B85D38]" />
            <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              Category Breakdown
            </h3>
          </div>
          {summary.categories.length > 0 && (
            <button
              onClick={onNavigateToSummary}
              className="text-xs font-bold text-[#B85D38] hover:text-[#A24E2B] flex items-center gap-1 cursor-pointer transition-colors"
            >
              View Full <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {summary.categories.length === 0 ? (
          <p className="text-xs text-stone-400 py-3 text-center">
            {hasCategories
              ? 'No category spending recorded for this month yet.'
              : 'No categories created yet. Create a category to start tracking.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {summary.categories.slice(0, 4).map((cat) => (
              <div
                key={cat.categoryId}
                onClick={() => onViewCategoryHistory && onViewCategoryHistory(cat.categoryId)}
                className="flex flex-col gap-1.5 p-2.5 -mx-2 rounded-2xl hover:bg-white/90 border border-transparent hover:border-stone-200/50 transition-all cursor-pointer group"
                title="View Category Expense History"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-stone-800">
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center shadow-2xs"
                      style={{
                        backgroundColor: `${cat.categoryColor}20`,
                        color: cat.categoryColor,
                      }}
                    >
                      <CategoryIcon name={cat.categoryIcon} size={12} />
                    </div>
                    <span className="group-hover:text-[#B85D38] transition-colors">
                      {cat.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-stone-900">
                      {formatCurrency(cat.totalAmount, currency)}
                    </span>
                    <span className="text-stone-400 font-semibold">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(2, cat.percentage))}%`,
                      backgroundColor: cat.categoryColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Expenses List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
            Recent Expenses
          </h3>
          <span className="text-xs text-stone-400 font-semibold">
            {recentExpenses.length} entries
          </span>
        </div>

        {recentExpenses.length === 0 ? (
          <EmptyState
            title="No Expenses Recorded"
            description={
              hasCategories
                ? 'Your expenses for this month will appear here. Tap Add Expense to log your first spend.'
                : 'Get started by creating your first category, then add your expenses.'
            }
            actionLabel={hasCategories ? 'Add Expense' : 'Create Category'}
            onAction={hasCategories ? onAddExpense : onNavigateToCategories}
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentExpenses.map((expense) => (
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

      {/* Floating Action Button with Muted Warm Accent */}
      <button
        onClick={hasCategories ? onAddExpense : onNavigateToCategories}
        className="fixed bottom-20 right-6 sm:bottom-8 sm:right-8 z-40 bg-[#B85D38] hover:bg-[#A24E2B] text-white p-4 sm:px-6 sm:py-3.5 rounded-full sm:rounded-2xl shadow-xl shadow-[#B85D38]/25 flex items-center justify-center gap-2 font-bold transition-all active:scale-95 cursor-pointer"
        title={hasCategories ? 'Add Expense' : 'Create Category'}
      >
        <Plus className="w-6 h-6 stroke-3" />
        <span className="hidden sm:inline text-sm font-extrabold">
          {hasCategories ? 'Add Expense' : 'Create Category'}
        </span>
      </button>
    </div>
  );
};
