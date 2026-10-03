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
          ? 'bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white/90 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
          : 'bg-white/30 border-neutral-200/40 opacity-60 hover:opacity-80'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/50 flex items-center justify-center shrink-0 text-neutral-800 transition-transform group-hover:scale-105">
          <CategoryIcon name={category.icon} size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-neutral-900 truncate group-hover:text-neutral-700 transition-colors">
              {category.name}
            </h4>
            {!category.isActive && (
              <span className="text-[10px] font-medium tracking-tight px-1.5 py-0.5 rounded bg-neutral-200/80 text-neutral-600">
                Inactive
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5 font-normal">
            <span>
              {usageCount} {usageCount === 1 ? 'expense' : 'expenses'}
            </span>
            <span>·</span>
            <span className="text-neutral-700 font-medium group-hover:underline">
              View History
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
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
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            category.isActive
              ? 'text-neutral-700 hover:bg-neutral-100'
              : 'text-neutral-400 hover:bg-neutral-100'
          }`}
          title={category.isActive ? 'Deactivate' : 'Reactivate'}
        >
          <Power className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category.id);
          }}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Delete category"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all ml-0.5" />
      </div>
    </div>
  );
};
