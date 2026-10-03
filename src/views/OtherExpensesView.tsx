import React, { useState } from 'react';
import { Plus, Search, Receipt, Layers, Filter } from 'lucide-react';
import { Expense, Category, CategorySummary } from '@/types';
import { ExpenseCard } from '@/components/ExpenseCard';
import { EmptyState } from '@/components/EmptyState';
import { CategoryIcon } from '@/components/CategoryIcon';
import { formatCurrency } from '@/utils/currency';

interface OtherExpensesViewProps {
  otherExpenses: Expense[];
  categories: Category[];
  currency: string;
  categoryTotals: CategorySummary[];
  totalAmount: number;
  onAddOtherExpense: (categoryId?: string) => void;
  onEditOtherExpense: (expense: Expense) => void;
  onDeleteOtherExpense: (id: string) => void;
  onCreateCategory: () => void;
}

export const OtherExpensesView: React.FC<OtherExpensesViewProps> = ({
  otherExpenses,
  currency,
  categoryTotals,
  totalAmount,
  onAddOtherExpense,
  onEditOtherExpense,
  onDeleteOtherExpense,
  onCreateCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const filteredExpenses = otherExpenses.filter((e) => {
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
      {/* Hero: Total Other Expenses Glass Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-3xl p-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-700" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Other Expenses
            </span>
          </div>
          <span className="text-xs text-neutral-400 tabular-nums">
            {otherExpenses.length} {otherExpenses.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="mt-2 flex items-baseline">
          <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-mono tabular-nums">
            {formatCurrency(totalAmount, currency)}
          </span>
        </div>

        <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
          Recorded separately · Excluded from regular monthly budget and totals
        </p>

        {/* Primary Add Action */}
        <button
          onClick={() => onAddOtherExpense()}
          className="mt-6 w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-2" />
          <span>Add Other Expense</span>
        </button>
      </div>

      {/* Category-Wise Totals Card */}
      {categoryTotals.length > 0 && (
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-3xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Category Breakdown
            </span>
            {selectedFilterCategory !== 'all' && (
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex flex-col divide-y divide-neutral-100/80">
            {categoryTotals.map((cat) => {
              const isFiltered = selectedFilterCategory === cat.categoryId;
              return (
                <div
                  key={cat.categoryId}
                  onClick={() =>
                    setSelectedFilterCategory(isFiltered ? 'all' : cat.categoryId)
                  }
                  className={`py-3 px-1 -mx-1 rounded-2xl hover:bg-white/60 transition-all cursor-pointer flex flex-col gap-2 group ${
                    isFiltered ? 'bg-neutral-100/70' : ''
                  }`}
                  title={isFiltered ? 'Showing this category (click to reset)' : 'Filter by this category'}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-800 shrink-0">
                        <CategoryIcon name={cat.categoryIcon} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-neutral-900 block truncate group-hover:text-neutral-700 transition-colors">
                          {cat.categoryName}
                        </span>
                        <span className="text-[11px] text-neutral-400 tabular-nums">
                          {cat.transactionCount} {cat.transactionCount === 1 ? 'entry' : 'entries'} · {cat.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                        {formatCurrency(cat.totalAmount, currency)}
                      </span>

                      {/* Quick Add for this category */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddOtherExpense(cat.categoryId);
                        }}
                        className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        title={`Quick add other expense in ${cat.categoryName}`}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-2" />
                      </button>
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
              );
            })}
          </div>
        </div>
      )}

      {/* Expense History Section */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Other Expense History
            </h3>
            <span className="text-xs text-neutral-400 font-medium tabular-nums">
              ({filteredExpenses.length})
            </span>
          </div>

          {/* Search bar */}
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

        {selectedFilterCategory !== 'all' && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-neutral-400" />
              Filtered by:
            </span>
            <span className="text-xs font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200 flex items-center gap-1.5">
              {categoryTotals.find((c) => c.categoryId === selectedFilterCategory)?.categoryName || 'Category'}
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className="hover:text-black font-bold cursor-pointer"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {filteredExpenses.length === 0 ? (
          <EmptyState
            title={otherExpenses.length === 0 ? 'No Other Expenses Yet' : 'No Matching Expenses'}
            description={
              otherExpenses.length === 0
                ? 'Record non-monthly purchases or special expenses here without affecting your regular monthly budget.'
                : 'Try adjusting your search query or category filter.'
            }
            actionLabel={otherExpenses.length === 0 ? 'Add First Other Expense' : undefined}
            onAction={otherExpenses.length === 0 ? () => onAddOtherExpense() : undefined}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                currency={currency}
                onEdit={onEditOtherExpense}
                onDelete={onDeleteOtherExpense}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
