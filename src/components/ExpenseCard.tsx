import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { formatDatePretty } from '@/utils/date';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseCardProps {
  expense: Expense;
  currency: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  currency,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group bg-white/70 hover:bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-white/85 shadow-[0_2px_10px_rgba(28,25,23,0.02)] hover:shadow-[0_6px_20px_rgba(28,25,23,0.04)] transition-all flex items-center justify-between gap-3">
      {/* Category Icon & Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
          style={{
            backgroundColor: `${expense.categoryColor || '#B85D38'}15`,
            color: expense.categoryColor || '#B85D38',
          }}
        >
          <CategoryIcon name={expense.categoryIcon || 'ShoppingCart'} size={18} />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-stone-900 truncate">
              {expense.categoryName || 'General'}
            </h4>
            <span className="text-[11px] font-medium text-stone-400">
              • {formatDatePretty(expense.date)}
            </span>
          </div>
          {expense.note && (
            <p className="text-xs text-stone-500 truncate mt-0.5 font-normal">
              {expense.note}
            </p>
          )}
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-base font-extrabold text-stone-900 tracking-tight">
          {formatCurrency(expense.amount, currency)}
        </span>

        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100/80 transition-colors cursor-pointer"
            title="Edit Expense"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Expense"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
