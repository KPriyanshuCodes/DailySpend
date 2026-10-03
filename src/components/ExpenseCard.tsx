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
    <div className="group bg-white/70 hover:bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all flex items-center justify-between gap-3">
      {/* Category Icon & Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center shrink-0 text-neutral-800">
          <CategoryIcon name={expense.categoryIcon || 'ShoppingCart'} size={16} />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold text-neutral-900 truncate">
              {expense.categoryName || 'General'}
            </h4>
            <span className="text-[11px] font-normal text-neutral-400">
              · {formatDatePretty(expense.date)}
            </span>
          </div>
          {expense.note && (
            <p className="text-xs text-neutral-500 truncate mt-0.5 font-normal">
              {expense.note}
            </p>
          )}
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-sm font-bold font-mono text-neutral-900 tracking-tight tabular-nums">
          {formatCurrency(expense.amount, currency)}
        </span>

        <div className="flex items-center gap-0.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Edit Expense"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Delete Expense"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
