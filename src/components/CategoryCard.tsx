import React from 'react';
import { Pencil, Power, Trash2, ChevronRight } from 'lucide-react';
import { Category } from '@/types';
import { CategoryIcon } from './CategoryIcon';

interface CategoryCardProps {
  category: Category;
  usageCount: number;
  onEdit: (category: Category) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
  onViewHistory?: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  usageCount,
  onEdit,
  onToggleActive,
  onDelete,
  onViewHistory,
}) => {
  return (
    <div
      onClick={() => onViewHistory && onViewHistory(category)}
      className={`rounded-2xl p-4 border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
        category.isActive
          ? 'bg-white/75 backdrop-blur-md border-white/90 shadow-[0_2px_10px_rgba(28,25,23,0.02)] hover:bg-white/90 hover:border-amber-200/60 hover:shadow-[0_6px_20px_rgba(28,25,23,0.04)]'
          : 'bg-white/40 border-stone-200/40 opacity-70 hover:opacity-85'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
          }}
        >
          <CategoryIcon name={category.icon} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-stone-900 truncate group-hover:text-[#B85D38] transition-colors">
              {category.name}
            </h4>
            {!category.isActive && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-600">
                Deactivated
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5 font-medium">
            <span>
              {usageCount} {usageCount === 1 ? 'expense' : 'expenses'}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[#B85D38] font-semibold flex items-center gap-0.5 group-hover:underline">
              View History
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-white/80 transition-colors cursor-pointer"
          title="Edit Category"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Soft-deactivation toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(category.id);
          }}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            category.isActive
              ? 'text-emerald-700 hover:bg-emerald-50'
              : 'text-stone-400 hover:bg-stone-100'
          }`}
          title={category.isActive ? 'Deactivate (hides from new transactions)' : 'Reactivate'}
        >
          <Power className="w-4 h-4" />
        </button>

        {/* Delete (only if 0 expenses) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category.id);
          }}
          disabled={usageCount > 0}
          className={`p-2 rounded-xl transition-colors ${
            usageCount > 0
              ? 'text-stone-300 cursor-not-allowed'
              : 'text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
          }`}
          title={
            usageCount > 0
              ? `Cannot delete: category has ${usageCount} expense(s). Use deactivation.`
              : 'Delete category'
          }
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#B85D38] group-hover:translate-x-0.5 transition-all ml-0.5" />
      </div>
    </div>
  );
};
