import React from 'react';
import { X, ArrowLeft, Plus, Trash2, Pencil } from 'lucide-react';
import { Category, Expense } from '@/types';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '@/utils/currency';
import { formatDateWithMonthDay } from '@/utils/date';

interface CategoryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  expenses: Expense[];
  currency: string;
  onAddExpenseForCategory?: (categoryId: string) => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (id: string) => void;
}

export const CategoryHistoryModal: React.FC<CategoryHistoryModalProps> = ({
  isOpen,
  onClose,
  category,
  expenses,
  currency,
  onAddExpenseForCategory,
  onEditExpense,
  onDeleteExpense,
}) => {
  if (!isOpen || !category) return null;

  // Filter and sort expenses for this category by date descending
  const categoryExpenses = expenses
    .filter((e) => e.categoryId === category.id)
    .sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

  const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(28,25,23,0.12)] overflow-hidden border border-white/95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200/50 bg-white/50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              <CategoryIcon name={category.icon} size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-stone-900 leading-tight">
                  {category.name}
                </h2>
                {!category.isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                    Deactivated
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 font-medium">Expense History</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Spent Banner */}
        <div className="p-5 bg-gradient-to-b from-white/70 to-white/90 border-b border-stone-200/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Spent in {category.name}
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-white px-2.5 py-0.5 rounded-full border border-stone-200/60 shadow-2xs">
              {categoryExpenses.length} {categoryExpenses.length === 1 ? 'expense' : 'expenses'}
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-stone-900 tracking-tight">
            {formatCurrency(totalSpent, currency)}
          </div>
        </div>

        {/* Action: Add Expense for this category */}
        {category.isActive && onAddExpenseForCategory && (
          <div className="px-5 py-3 border-b border-stone-200/50 bg-[#FAF8F5]/60 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Log a new purchase:</span>
            <button
              onClick={() => {
                onClose();
                onAddExpenseForCategory(category.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B85D38] hover:bg-[#A24E2B] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-3" />
              Add Expense
            </button>
          </div>
        )}

        {/* Expenses List */}
        <div className="overflow-y-auto p-4 flex flex-col gap-2.5 flex-1">
          {categoryExpenses.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400">
              No expenses recorded under this category yet.
            </div>
          ) : (
            categoryExpenses.map((expense) => (
              <div
                key={expense.id}
                className="group bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl p-3.5 border border-stone-200/60 shadow-2xs transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-800">
                      {formatDateWithMonthDay(expense.date)}
                    </span>
                    {expense.note && (
                      <span className="text-xs text-stone-400 truncate">• {expense.note}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-sm font-extrabold text-stone-900">
                    {formatCurrency(expense.amount, currency)}
                  </span>

                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditExpense && (
                      <button
                        onClick={() => {
                          onClose();
                          onEditExpense(expense);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit Expense"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteExpense && (
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
